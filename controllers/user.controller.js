require("dotenv").config();
const User = require("../models/user.model");
const Room = require("../models/room.model");
const brcypt = require("bcryptjs");
const crypto = require("crypto");
const { cloudinary } = require("../utils/cloudinary");
const { OAuth2Client } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");
const { sendEmailVerificationMail, sendResetPasswordMail } = require("../utils/sendgrid");
const redis = require("../redis/functions"); 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const checkAuth = async(req, res, next) => {
    try {
        if(req.cookies.SESSIONID !== undefined) 
        {
            const userId = await redis.getUserId(req.cookies.SESSIONID);
            if(userId !== null && userId !== undefined) 
            {
                const user = await User.findById(userId);
                if(user) 
                {
                    let totalUnread = 0;
                    for (let tempRoom of user.rooms) 
                    {
                        const room = await Room.findOne({roomId: tempRoom.roomId});
                        if(room) 
                        {
                            tempRoom.unreadCount = (room.messages.length - tempRoom.lastCount);
                            if(tempRoom.unreadCount < 0) tempRoom.unreadCount = 0;
                            totalUnread += tempRoom.unreadCount;
                        }
                    }
                    for (let tempChat of user.chats) 
                    {
                        const room = await Room.findOne({roomId: tempChat.roomId});
                        if(room) 
                        {
                            tempChat.unreadCount = (room.messages.length - tempChat.lastCount);
                            if(tempChat.unreadCount < 0) tempChat.unreadCount = 0;
                            totalUnread += tempChat.unreadCount;
                        }
                    }
                    user.totalUnread = totalUnread;
                    user.save()
                    .then(() => {
                        res.json({
                            id: user._id,
                            username: user.username,
                            about: user.about,
                            imageUrl: user.imageUrl,
                            totalUnread
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
                }
                else 
                {
                    res.clearCookie("SESSIONID");
                    res.json("INVALID");
                }     
            }
            else 
            {
                res.clearCookie("SESSIONID");
                res.json("INVALID");
            }
        }
        else 
        {
            res.clearCookie("SESSIONID");
            res.json("INVALID");
        }
    }
    catch(error) 
    {
        res.json(next(error));
    }
}

const registerUser = async(req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) 
        {
            res.json("Email already exists");
        }
        else {
            const foundUser = await User.findOne({username});
            if(foundUser) 
            {
                res.json("Username already exists");
            }
            else {
                crypto.randomBytes(32, (err, buffer) => 
                {
                    if(err) 
                    {
                        console.log(err);
                    }
                    const token = buffer.toString("hex");
                    const newUser = new User({
                        username,
                        email, 
                        password,
                        about: `Hello, ${username} here`,
                        verified: false,
                        imageUrl: "",
                        verifyToken: token,
                        totalUnread: 0,
                        expiresIn: Date.now() + 1800000
                    });
                    brcypt.genSalt(10, (err, salt) => 
                    {
                        if(!err) 
                        {
                            brcypt.hash(newUser.password, salt, (err, hash) => 
                            {
                                if(err) 
                                {
                                    res.json(err);
                                }
                                else 
                                {
                                    newUser.password = hash;
                                    newUser.save()
                                    .then((user) => {
                                        console.log(user);
                                        sendEmailVerificationMail(user.verifyToken, user.email);
                                        res.json({
                                            user: {
                                                id: user.id,
                                                username: user.username,
                                                email: user.email,
                                                token: user.verifyToken
                                            }
                                        });
                                    })
                                    .catch((error) => {
                                        res.json(error);
                                    });
                                }
                            })
                        }
                    })
                })
            }
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const loginUser = async(req, res, next) => {
    try {
        const {email, password, rememberMe} = req.body;
        const user = await User.findOne({email});
        if(user) 
        {
            brcypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) 
                {
                    res.json("Password is not Correct");
                }
                else 
                {
                    if(user.verified) 
                    {
                        const sessionId = uuidv4().replace(/-/g,'');
                        const {id, username, email, verified} = user;
                        if(rememberMe) 
                        {
                            res.cookie("SESSIONID", sessionId, {
                                httpOnly: true,
                                sameSite: true,
                                secure: true,
                                maxAge: 24*60*60*1000 // (1 DAY)
                            });
                            redis.setRedisValue(sessionId, id, 24*60*60); // 1 DAY
                        }
                        else 
                        {
                            res.cookie("SESSIONID", sessionId, {
                                httpOnly: true,
                                sameSite: true,
                                secure: true
                            });
                            redis.setRedisValue(sessionId, id, 60*60); // 1 HOUR
                        }
                        res.json({user: {id, username, email, verified}});
                    }
                    else 
                    {
                        crypto.randomBytes(32, (err, buffer) => 
                        {
                            if(err) 
                            {
                                console.log(err);
                            }
                            const verifyToken = buffer.toString("hex");
                            user.verifyToken = verifyToken;
                            user.expiresIn = Date.now() + 1800000;
                            user.save()
                            .then(() => {
                                sendEmailVerificationMail(verifyToken, user.email);
                                res.json({
                                    user: {
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                        verified: user.verified,
                                        token: verifyToken
                                    }
                                });
                            })
                            .catch((err) => {
                                res.json(err);
                            });
                        });
                    }
                }
            });
        }
        else 
        {
            res.json("User does not exist");
        }
    }
    catch(error) 
    {
        res.json(next(error));
    }
}

const loginWithGoogle = async(req, res, next) => {
    try {   
        var tokenId = req.body.token;
        const response = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID});
        var {email_verified, given_name, email} = response.payload;
        if(email_verified) 
        {
            const user = await User.findOne({email});
            if(user) 
            {
                const sessionId = uuidv4().replace(/-/g,'');
                res.cookie("SESSIONID", sessionId, {
                    httpOnly: true,
                    sameSite: true,
                    secure: true,
                    maxAge: 24*60*60*1000
                });
                const {id, username, email} = user;
                redis.setRedisValue(sessionId, id, 24*60*60); 
                res.json({user: {id, username, email}});
            }
            else 
            {
                const newUser = new User({
                    username: given_name,
                    email,
                    about: `Hello, ${given_name} here`,
                    imageUrl: "",
                    totalUnread: 0,
                    verified: true
                });
                newUser.save()
                .then((data) => {
                    const sessionId = uuidv4().replace(/-/g,'');
                    res.cookie("SESSIONID", sessionId, {
                        httpOnly: true,
                        sameSite: true,
                        secure: true,
                        maxAge: 7*24*60*60*1000
                    });
                    const {id, username, email} = data;
                    redis.setRedisValue(sessionId, id, 24*60*60);
                    res.json({user: {id, username, email}});
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
        else 
        {
            res.json("INVALID");
        }
    }
    catch(error) 
    {
        res.json(next(error));
    }
}

const getAllUsers = async(req, res, next) => {
    try {  
        const users = await User.find({}).select(['username']);
        res.json(users);
    }
    catch(error) {
        res.json(next(error));
    }
}

const getUserByUsername = async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.user});
        res.json(user);
    }
    catch(error) {
        res.json(next(error));
    }
}

const updateProfileImage = async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.user});
        var imageUrl = "";
        if(req.body.data !== "") 
        {
            var fileStr = req.body.data;
            var uploadedResponse = await cloudinary.uploader.
            upload(fileStr, {
                upload_preset: "socialites"
            });
            imageUrl = uploadedResponse.url;
        }
        user.imageUrl = imageUrl;
        user.save()
        .then(() => {
            res.json("Successfully Updated Image");  
        })
        .catch((err) => {
            res.json(err);
        })
    }
    catch(error) {
        res.json(next(error));
    }
}

const updateUserBio = async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.user});
        user.about = req.body.text;
        user.save()
        .then((data) => {
            res.json(data.about);
        })
        .catch((err) => {
            res.json(err);
        });
    }
    catch(error) {
        res.json(next(error));
    }
}

const resetPassword = async(req, res, next) => {
    try {
        const foundUser = await User.findOne({resetToken: req.body.token});
        console.log(Date.now());
        console.log(foundUser);
        if(foundUser && foundUser.expiresIn >= Date.now()) {
            brcypt.genSalt(10, (err, salt) => {
                if(!err) {
                    brcypt.hash(req.body.newPassword, salt, (err, hash) => {
                        if(err) {
                            res.json(err);
                        }
                        else {
                            foundUser.password = hash;
                            foundUser.resetToken = undefined;
                            foundUser.expiresIn = undefined;
                            foundUser.save()
                            .then(() => {
                                res.json("Successfully Resetted Password");
                            })
                            .catch((error) => {
                                res.json(error);
                            });
                        }
                    })
                }
            });
        }
        else {
            res.json("INVALID");
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const forgotPassword = async(req, res, next) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email });
        if (foundUser === null) {
            res.json("account with the entered email does not exists, please enter the email with which you registered");
        }
        else {
            crypto.randomBytes(32, (err, buffer) => {
                if(err) {
                    console.log(err);
                }
                const token = buffer.toString("hex");
                foundUser.resetToken = token;
                foundUser.expiresIn = Date.now() + 1800000;
                foundUser.save()
                .then((user) => {
                    sendResetPasswordMail(token, user.email);
                    res.json("Password reset mail is sent to the user, check your email");
                })
                .catch((error) => {
                    console.log(error);
                })
            })
        }
    }
    catch (error) {
        res.json(next(error));
    }
}

const sendEmail = async(req, res, next) => {
    try {
        const foundUser = await User.findOne({verifyToken: req.body.token});
        if(foundUser && foundUser.expiresIn >= Date.now()) {
            sendEmailVerificationMail(foundUser.verifyToken, foundUser.email);
            res.json("Email Sent Successfully");
        }
        else {
            res.json("INVALID");
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const verifyUser = async(req, res, next) => {
    try {
        const foundUser = await User.findOne({verifyToken: req.body.token});
        if(foundUser && foundUser.expiresIn >= Date.now()) {
            foundUser.verified = true;
            foundUser.verifyToken = undefined;
            foundUser.expiresIn = undefined;
            foundUser.save()
            .then(() => {
                res.json("Successfully Verified User's Email");
            })
            .catch((error) => {
                res.json(error);
            });
        }
        else {
            res.json("INVALID");
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const logoutUser = async(req, res, next) => {
    try {
        const response = redis.deleteBySessionId(req.cookies.SESSIONID);
        res.clearCookie("SESSIONID");
        res.json(response);
    }
    catch(err) {
        res.json(next(error));
    }
}

module.exports = {  
                    checkAuth, 
                    registerUser, 
                    loginUser, 
                    loginWithGoogle, 
                    getAllUsers, 
                    getUserByUsername,  
                    updateProfileImage,
                    updateUserBio,
                    resetPassword,
                    forgotPassword,
                    sendEmail,
                    verifyUser,
                    logoutUser
                 }