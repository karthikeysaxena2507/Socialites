require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
let User = require("../models/user.model.js");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get("/", async(req, res, next) => {
    try {   
        const users = await User.find({});
        res.json(users);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.get("/find/:username", async(req, res, next) => {
    try {
        const user = await User.find({username: req.params.username});
        res.json(user);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.post("/reset", async(req, res, next) => {
    try {
        const foundUser = await User.findOne({username: req.body.name});
        if(foundUser) {
            foundUser.setPassword(req.body.new, function() {
                foundUser.save();
                res.json("password reset successfull");
            });
        }
        else {
            res.json("user does not exists");
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

router.post("/forgot", async(req, res, next) => {
    try {
        const foundUser = await User.findOne({ email: req.body.mail });
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

router.post("/", async(req, res, next) => {
    try {
        const user = new User ({
            username: req.body.username,
            password: req.body.password
        });
        req.login(user, async() => {
            try {
                const foundUser = await User.findOne({username: req.body.username});
                passport.authenticate("local")(req, res, function() {
                    res.json(foundUser);
                });
            }
            catch(error) {
                res.json("user not found");
            }
        });
    }
    catch(error) {
        res.json(next(error));
    }
});

router.post("/send", async(req, res, next) => {
    try {
        const foundUser = await User.findOne({username: req.body.name});
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
    catch(error) {
        res.json(next(error));
    }
});

router.post("/verify", async(req, res, next) => {
    try {
        const foundUser = await User.findOne({username: req.body.name});
        foundUser.verified = true;
        foundUser.save();
    }
    catch(error) {
        res.json(next(error));
    }
});

router.post("/add", async(req, res, next) => {
    try {
        const foundUser = await User.findOne({username: req.body.username});
        const newUser = new User ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            verified: false
        });
        if(foundUser === null) {
            const user = await User.findOne({email: req.body.email});
            if(user === null) {
                User.register({username: req.body.username, email: req.body.email, verified: newUser.verified},
                    req.body.password, async(err,foundUser) => {
                        try {
                            passport.authenticate("local")(req, res, () => {
                                var link = "https://socialites-karthikey.herokuapp.com/verified/" + req.body.username;
                                const msg = {
                                    to: newUser.email,
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
                                });
                            res.json(foundUser);
                        }
                        catch(error) {
                            res.json(error);
                        }
                });
            }
            else {
                res.json("Account with given Email Already Exists");
            }
        }
        else {
            res.json("Username Already Exists");
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

module.exports = router;