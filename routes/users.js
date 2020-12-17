const router = require("express").Router();
const md5 = require("md5");
const passport = require("passport");
let User = require("../models/user.model.js");

router.route("/:username/create").get(function(req, res) {
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

router.route("/").post(function(req, res) {
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err) {
        if(err) {
            res.json("user not found");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.json(user);
            });
        }
    });
});

router.route("/add").post(function(req, res) {
    const newUser = new User ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    User.findOne({
        username: req.body.username
    }, function(err, foundUser) {
        if(err) {
            console.log(err);
        }
        else {
            if(foundUser === null) {
                User.register({username: req.body.username}, req.body.password, function(err, user) {
                    if(err) {
                        res.status(400).json("Error: " + err);
                    }
                    else {
                        passport.authenticate("local")(req, res, function(){
                            res.json(user);
                        });
                    }
                });
            }
            else {
                res.json("Username Already Exists");
            }
        }
    })
});

module.exports = router;