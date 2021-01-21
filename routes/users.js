require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
let User = require("../models/user.model.js");
const sgMail = require("@sendgrid/mail");
const { cloudinary } = require("../utils/cloudinary");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const crypto = require("crypto");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// JWT AUTHENTICATION MIDDLEWARE FOR A USER
router.get("/auth", auth, async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if(user) {
            res.json({
                id: user._id,
                username: user.username,
                about: user.about,
                imageUrl: user.imageUrl
            });
        }
        else {
            res.json("Invalid User");
        }
    }
    catch(error) {
        res.json(error);
    }
});

// REGISTER
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
                                    var link = "https://socialites-karthikey.herokuapp.com/verified/" + token;
                                    const msg = {
                                        to: user.email,
                                        from: "karthikeysaxena@outlook.com", 
                                        subject: "Welcome to Socialites",
                                        html: `<a href=${link}> Link to verify your Email </a>
                                                <p> The Link will expire in 30 mins </p>`
                                    }
                                    sgMail
                                        .send(msg)
                                        .then(() => {
                                            console.log("Email sent");
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
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

// LOGIN
router.post("/login", async(req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user) {
            brcypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) {
                    res.json("Password is not Correct");
                }
                else {
                    jwt.sign(
                        {id: user.id},
                        process.env.JWT_SECRET,
                        {expiresIn: 3600},
                        (err, token) => {
                            if(err) {
                                res.json(err);
                            }
                            else {
                                if(user.verified) {
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            username: user.username,
                                            email: user.email,
                                            verified: user.verified
                                        }
                                    });
                                }
                                else {
                                    crypto.randomBytes(32, (err, buffer) => {
                                        if(err) {
                                            console.log(err);
                                        }
                                        const verifyToken = buffer.toString("hex");
                                        user.verifyToken = verifyToken;
                                        user.expiresIn = Date.now() + 1800000;
                                        user.save();
                                        var link = "https://socialites-karthikey.herokuapp.com/verified/" + verifyToken;
                                        const msg = {
                                            to: user.email,
                                            from: "karthikeysaxena@outlook.com", 
                                            subject: "Welcome to Socialites",
                                            html: `<a href=${link}> Link to verify your Email </a>
                                                    <p> The Link will expire in 30 mins </p>`
                                        }
                                        sgMail
                                        .send(msg)
                                        .then(() => {
                                            console.log("Email sent");
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                        res.json({
                                            token,
                                            user: {
                                                id: user.id,
                                                username: user.username,
                                                email: user.email,
                                                verified: user.verified,
                                                token: verifyToken
                                            }
                                        });
                                    })
                                }
                            }
                        }
                    )
                }
            })
        }
        else {
            res.json("User does not exist");
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

// ACCESSING ALL USERS
router.get("/get/:username", async(req, res, next) => {
    try {  
        const users = await User.find({});
        res.json(users);
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
        user.save();
        res.json("Successfully Updated Image");
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
        user.save();
        res.json(user.about);
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
                            .then((user) => {
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
                    var link = "https://socialites-karthikey.herokuapp.com/reset/" + token;
                    const msg = {
                        to: user.email,
                        from: "karthikeysaxena@outlook.com",
                        subject: "Welcome to Socialites",
                        html: `<a href=${link}> Link to Reset your Password </a> 
                                <p> The link is valid for 30 mins only </p>`
                    };
                    sgMail
                        .send(msg)
                        .then(() => {
                            console.log("Email sent");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
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
            var link = "https://socialites-karthikey.herokuapp.com/verified/" + foundUser.verifyToken;
            const msg = {
                to: foundUser.email,
                from: "karthikeysaxena@outlook.com", 
                subject: "Welcome to Socialites",
                html: `<a href=${link}> Link to verify your Email </a>`
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log("Email sent");
                })
                .catch((error) => {
                    console.log(error);
                });
            res.json("Email Sent");
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
            .then((user) => {
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

module.exports = router;