const router = require("express").Router();
const md5 = require("md5");
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
    User.findOne({
        username: req.body.username,
        password: md5(req.body.password)
    }, function(err, foundUser) {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            if(foundUser === null) {
                res.json("user not found");
            }
            else {
                res.json("user found");
            }
        }
    })
});

router.route("/add").post(function(req, res) {
    const newUser = new User ({
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password)
    });

    User.findOne({
        username: req.body.username
    }, function(err, foundUser) {
        if(err) {
            console.log(err);
        }
        else {
            if(foundUser === null) {
                newUser.save(function(err) {
                    if(err) {
                        res.status(400).json("Error: " + err);
                    }
                    else {
                        res.json("user added");
                    }
                });
            }
            else {
                res.json("username alredy exists");
            }
        }
    })
});

module.exports = router;