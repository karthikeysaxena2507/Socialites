require("dotenv").config();
const router = require("express").Router();
const User = require("../models/user.model");
const Room = require("../models/room.model");
const brcypt = require("bcryptjs");
const crypto = require("crypto");
const redisClient = require("../redis/client");
const { cloudinary } = require("../utils/cloudinary");
const { OAuth2Client } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");
const { sendEmailVerificationMail, sendResetPasswordMail } = require("../utils/sendgrid");
const { deleteBySessionId, getUserId } = require("../redis/functions"); 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SESSION AUTHENTICATION MIDDLEWARE FOR A USER
router.get("/auth", async(req, res, next) => {
    try {
        if(req.cookies.SESSIONID !== undefined) {
            const userId = await getUserId(req.cookies.SESSIONID);
            if(userId !== null && userId !== undefined) {
                const user = await User.findById(userId);
                if(user) {
                    let totalUnread = 0;
                    for (let tempRoom of user.rooms) {
                        const room = await Room.findOne({roomId: tempRoom.roomId});
                        tempRoom.unreadCount = (room.messages.length - tempRoom.lastCount);
                        totalUnread += tempRoom.unreadCount;
                    }
                    for (let tempChat of user.chats) {
                        const room = await Room.findOne({roomId: tempChat.roomId});
                        tempChat.unreadCount = (room.messages.length - tempChat.lastCount);
                        totalUnread += tempChat.unreadCount;
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
                else {
                    res.clearCookie("SESSIONID");
                    res.json("INVALID");
                }     
            }
            else {
                res.clearCookie("SESSIONID");
                res.json("INVALID");
            }
        }
        else {
            res.clearCookie("SESSIONID");
            res.json("INVALID");
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

// REGISTER THE USER
router.post("/register", async(req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.json("Email already exists");
        }
        else {
            const foundUser = await User.findOne({username});
            if(foundUser) {
                res.json("Username already exists");
            }
            else {
                crypto.randomBytes(32, (err, buffer) => {
                    if(err) {
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
                    brcypt.genSalt(10, (err, salt) => {
                        if(!err) {
                        brcypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) {
                                res.json(err);
                            }
                            else {
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
                    }})
                })
            }
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

// LOGIN THE USER
router.post("/login", async(req, res, next) => {
    try {
        const {email, password, rememberMe} = req.body;
        const user = await User.findOne({email});
        if(user) {
            brcypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) {
                    res.json("Password is not Correct");
                }
                else {
                    if(user.verified) {
                        const sessionId = uuidv4().replace(/-/g,'');
                        const {id, username, email, verified} = user;
                        if(rememberMe) {
                            res.cookie("SESSIONID", sessionId, {
                                httpOnly: true,
                                sameSite: true,
                                secure: true,
                                maxAge: 7*24*60*60*1000 // (7 DAYS)
                            });
                            redisClient.setex(sessionId, 7*24*60*60, id); // 7 DAYS
                        }
                        else {
                            res.cookie("SESSIONID", sessionId, {
                                httpOnly: true,
                                sameSite: true,
                                secure: true
                            });
                            redisClient.setex(sessionId, 6*60*60, id); // 10 HOURS
                        }
                        res.json({user: {id, username, email, verified}});
                    }
                    else {
                        crypto.randomBytes(32, (err, buffer) => {
                            if(err) {
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
        else {
            res.json("User does not exist");
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

// GOOGLE LOGIN
router.post("/googlelogin", async(req, res, next) => {
    try {   
        var tokenId = req.body.token;
        const response = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID});
        var {email_verified, given_name, email} = response.payload;
        if(email_verified) {
            const user = await User.findOne({email});
            if(user) {
                const sessionId = uuidv4().replace(/-/g,'');
                res.cookie("SESSIONID", sessionId, {
                    httpOnly: true,
                    sameSite: true,
                    secure: true,
                    maxAge: 7*24*60*60*1000
                });
                const {id, username, email} = user;
                redisClient.setex(sessionId, 7*24*60*60, id, (err) => {
                    if(err) {
                        res.json(err);
                    }
                    else {
                        res.json({user: {id, username, email}});     
                    }
                });
            }
            else {
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
                    redisClient.setex(sessionId, 7*24*60*60, id);
                    res.json({user: {id, username, email}});
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
        else {
            res.json("INVALID");
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

// ACCESSING ALL USERS
router.get("/get", async(req, res, next) => {
    try {  
        const users = await User.find({});
        res.json(users);
    }
    catch(error) {
        res.json(next(error));
    }
});

// ACCESSING A PARTICULAR USER BY USERNAME
router.get("/find/:user", async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.user});
        res.json(user);
    }
    catch(error) {
        res.json(next(error));
    }
});

// UPDATING THE PROFILE PIC OF USER
router.post("/updateimage", async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.user});
        var imageUrl = "";
        if(req.body.data !== "") {
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
});

// UPDATING THE USER BIO IN PROFILE PAGE
router.post("/updatebio", async(req, res, next) => {
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
});

// RESETING THE PASSWORD
router.post("/reset", async(req, res, next) => {
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
});

// SENDING RESET PASSWORD MAIL TO USER
router.post("/forgot", async(req, res, next) => {
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
});

// SENDING EMAIL VERIFICATION MAIL TO USER
router.post("/send", async(req, res, next) => {
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
});

// VERIFY THE REGISTERED USER
router.post("/verify", async(req, res, next) => {
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
});

// LOGGING OUT THE USER
router.post("/logout", async(req, res, next) => {
    try {
        const response = deleteBySessionId(req.cookies.SESSIONID);
        res.clearCookie("SESSIONID");
        res.json(response);
    }
    catch(err) {
        res.json(next(error));
    }
});

module.exports = router;