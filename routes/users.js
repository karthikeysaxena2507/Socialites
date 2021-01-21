require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
let User = require("../models/user.model.js");
const sgMail = require("@sendgrid/mail");
const { cloudinary } = require("../utils/cloudinary");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
})

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
                const newUser = new User({
                    username,
                    email, 
                    password,
                    about: `Hello, ${username} here`,
                    verified: false,
                    imageUrl: ""
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
                                var link = "https://socialites-karthikey.herokuapp.com/verified/" + user.username;
                                const msg = {
                                    to: user.email,
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
                                res.json({
                                    user: {
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                    }
                                });
                            })
                            .catch((error) => {
                                res.json(error);
                            });
                        }
                    })
                }})
            }
        }
    }
    catch(error) {
        res.json(next(error));
    }
})

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
})

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

// ACCESSING A PARTILCULAR USER
router.get("/find/:username", async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username});
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
        user.save();
        res.json(user);
    }
    catch(error) {
        res.json(next(error));
    }
})

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
        const foundUser = await User.findOne({username: req.body.username});
        if(foundUser) {
            foundUser.setPassword(req.body.newPassword, () => {
                foundUser.save();
                res.json("password reset successfull");
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
            var link = "https://socialites-karthikey.herokuapp.com/reset/" + foundUser.username;
            const msg = {
                to: foundUser.email,
                from: "karthikeysaxena@outlook.com",
                subject: "Welcome to Socialites",
                html: `<a href=${link}> Link to Reset your Password </a>`
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
        }
    }
    catch (error) {
        res.json(next(error));
    }
});

// SENDING EMAIL VERIFICATION MAIL TO USER
router.post("/send", async(req, res, next) => {
    try {
        const foundUser = await User.findOne({username: req.body.username});
        if(foundUser) {
            var link = "https://socialites-karthikey.herokuapp.com/verified/" + foundUser.username;
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
                res.json(foundUser);
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
        const foundUser = await User.findOne({username: req.body.username});
        if(foundUser) {
            foundUser.verified = true;
            foundUser.save();
            res.json(foundUser);
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