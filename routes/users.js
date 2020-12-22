require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
let User = require("../models/user.model.js");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.route("/find/:username").get((req, res) => {
    User.find({
        username: req.params.username
    }
    , function(err, user) {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json(user);
        }
    })
});

router.route("/reset").post((req, res) => {
    User.findOne({
        username: req.body.name
    }, (err, foundUser) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
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
    });
});

router.route("/forgot").post((req, res) => {
    User.findOne({
        email: req.body.mail
    }, (err, foundUser) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            if(foundUser === null) {
                res.json("account with the entered email does not exists, please enter the email with which you registered");
            }
            else {
                var link = "https://socialites-karthikey.herokuapp.com/reset/" + foundUser.username;
                const msg = {
                    to: foundUser.email,
                    from: "karthikeysaxena@outlook.com", 
                    subject: "Welcome to Socialites",
                    html: `<a href=${link}> Link to Reset your Password </a>`
                }
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
    });
});

router.route("/").post((req, res) => {
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err) {
        if(err) {
            res.json("user not found");
        }
        else {
            User.findOne({
                username: req.body.username
            },(err, foundUser) => {
                if(err) {
                    res.status(400).json("Error: " + err);
                }
                else {
                    passport.authenticate("local")(req, res, function() {
                        res.json(foundUser);
                    });
                }
            });
        }
    });
});

router.route("/send").post((req, res) => {
    User.findOne({
        username: req.body.name
    }, (err, foundUser) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
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
    });
});

router.route("/verify").post((req, res) => {
    User.findOne({
        username: req.body.name
    }, (err, foundUser) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            foundUser.verified = true;
            foundUser.save((err) => {
                if(err) {
                    res.status(400).json("Error: " + err);
                }
                else {
                    res.json(foundUser);
                }
            })
        }
    });
});

router.route("/add").post((req, res) => {
    const newUser = new User ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        verified: false
    });
    User.findOne({
        username: req.body.username
    }, function(err, foundUser) {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            if(foundUser === null) {
                User.findOne({
                    email: req.body.email
                }, (err, user) => {
                    if(err) {
                        res.status(400).json("Error: " + err);
                    }
                    else {
                        if(user === null) {
                            User.register({username: req.body.username, email: req.body.email, verified: newUser.verified}, req.body.password, function(err, user) {
                                if(err) {
                                    res.status(400).json("Error: " + err);
                                }
                                else {
                                        passport.authenticate("local")(req, res, function(){
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
                                        res.json(user);
                                    });
                                }
                            });
                        }
                        else {
                            res.json("Account with given Email Already Exists");
                        }
                    }
                })
            }
            else {
                res.json("Username Already Exists");
            }
        }
    })
});

module.exports = router;