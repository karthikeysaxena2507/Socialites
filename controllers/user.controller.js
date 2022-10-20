require("dotenv").config();
let User = require("../models/user.model");
let Room = require("../models/room.model");
let brcypt = require("bcryptjs");
let crypto = require("crypto");
let { cloudinary } = require("../utils/cloudinary");
let { OAuth2Client } = require("google-auth-library");
let { v4: uuidv4 } = require("uuid");
let { sendEmailVerificationMail, sendResetPasswordMail } = require("../utils/sendgrid");
let redis = require("../redis/functions"); 
let helper = require("../helper/index");
let client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

let checkAuth = async(req, res, next) => {
    try {
        let user = req.user;
        if(user === null) 
        {
            redis.deleteBySessionId(req.cookies.SESSIONID);
            res.clearCookie("SESSIONID");
            res.json("INVALID");
        }
        else 
        {
            let totalUnread = 0;
            for (let tempRoom of user.rooms) 
            {
                let room = await Room.findOne({roomId: tempRoom.roomId});
                if(room) 
                {
                    tempRoom.unreadCount = (room.messages.length - tempRoom.lastCount);
                    if(tempRoom.unreadCount < 0) tempRoom.unreadCount = 0;
                    totalUnread += tempRoom.unreadCount;
                }
            }
            for (let tempChat of user.chats) 
            {
                let room = await Room.findOne({roomId: tempChat.roomId});
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
    }
    catch(error) 
    {
        res.json(next(error));
    }
}

let registerUser = async(req, res, next) => {
    try {
        let {username, email, password} = req.body;
        username = helper.sanitize(username);
        email = helper.sanitize(email);
        password = helper.sanitize(password);
        let existingUser = await User.findOne({email});
        if(existingUser) 
        {
            res.json("Email already exists");
        }
        else {
            let foundUser = await User.findOne({username});
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
                    let token = buffer.toString("hex");
                    let newUser = new User({
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

let loginUser = async(req, res, next) => {
    try {
        let {email, password, rememberMe} = req.body;
        email = helper.sanitize(email);
        password = helper.sanitize(password);
        let user = await User.findOne({email});
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
                        let sessionId = uuidv4().replace(/-/g,'');
                        let {id, username, email, verified} = user;
                        if(rememberMe) 
                        {
                            res.cookie("SESSIONID", sessionId, {
                                httpOnly: true,
                                secure: true,
                                sameSite: "strict",
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
                        res.json({user: {id, username, email, verified, sessionId}});
                    }
                    else 
                    {
                        crypto.randomBytes(32, (err, buffer) => 
                        {
                            if(err) 
                            {
                                console.log(err);
                            }
                            let verifyToken = buffer.toString("hex");
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

let loginWithGoogle = async(req, res, next) => {
    try {   
        var tokenId = req.body.token;
        let response = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID});
        var {email_verified, given_name, email} = response.payload;
        if(email_verified) 
        {
            let user = await User.findOne({email});
            if(user) 
            {
                let sessionId = uuidv4().replace(/-/g,'');
                res.cookie("SESSIONID", sessionId, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 24*60*60*1000
                });
                let {id, username, email} = user;
                redis.setRedisValue(sessionId, id, 24*60*60); 
                res.json({user: {id, username, email}});
            }
            else 
            {
                let newUser = new User({
                    username: given_name,
                    email,
                    about: `Hello, ${given_name} here`,
                    imageUrl: "",
                    totalUnread: 0,
                    verified: true
                });
                newUser.save()
                .then((data) => {
                    let sessionId = uuidv4().replace(/-/g,'');
                    res.cookie("SESSIONID", sessionId, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 7*24*60*60*1000
                    });
                    let {id, username, email} = data;
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

let getAllUsers = async(req, res, next) => {
    try {  
        let users = await User.find({}).select(['username']);
        res.json(users);
    }
    catch(error) {
        res.json(next(error));
    }
}

let getUserByUsername = async(req, res, next) => {
    try {
        let user = await User.findOne({username: req.params.user});
        res.json(user);
    }
    catch(error) {
        res.json(next(error));
    }
}

let updateProfileImage = async(req, res, next) => {
    try {
        if(req.user ===  null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.user) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let user = await User.findOne({username: req.body.user});
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
            user.imageUrl = helper.sanitize(imageUrl);
            user.save()
            .then(() => {
                res.json("Successfully Updated Image");  
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let updateUserBio = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.user) {
            res.status(401).json({Error: "You are not authenticated"});
        } 
        else {
            let user = await User.findOne({username: req.body.user});
            user.about = helper.sanitize(req.body.text);
            user.save()
            .then((data) => {
                res.json(data.about);
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let resetPassword = async(req, res, next) => {
    try {
        let foundUser = await User.findOne({resetToken: req.body.token});
        if(foundUser && foundUser.expiresIn >= Date.now()) {
            brcypt.genSalt(10, (err, salt) => {
                if(!err) {
                    brcypt.hash(helper.sanitize(req.body.newPassword), salt, (err, hash) => {
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

let forgotPassword = async(req, res, next) => {
    try {
        let foundUser = await User.findOne({ email: helper.sanitize(req.body.email) });
        if (foundUser === null) {
            res.json("account with the entered email does not exists, please enter the email with which you registered");
        }
        else {
            crypto.randomBytes(32, (err, buffer) => {
                if(err) {
                    console.log(err);
                }
                let token = buffer.toString("hex");
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

let sendEmail = async(req, res, next) => {
    try {
        let foundUser = await User.findOne({verifyToken: req.body.token});
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

let verifyUser = async(req, res, next) => {
    try {
        let foundUser = await User.findOne({verifyToken: req.body.token});
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

let logoutUser = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.clearCookie("SESSIONID");
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let response = redis.deleteBySessionId(req.cookies.SESSIONID);
            res.clearCookie("SESSIONID");
            res.json(response);
        }
    }
    catch(err) {
        res.json(next(err));
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