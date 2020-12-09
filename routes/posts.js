const router = require("express").Router();
let Post = require("../models/post.model");

router.route("/").get(function(req, res) {
    Post.find({}, function(err, posts) {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json(posts);
        }
    });
});

router.route("/delete/:id").delete(function(req, res) {
    Post.deleteOne({_id: req.params.id}, function(err) {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json("post deleted");
        }
    });
});

router.route("/:username").get(function(req, res) {
    Post.find({author: req.params.username}, function(err, posts) {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json(posts);
        }
    });
});

router.route("/update/:react/:username").post(function(req, res) {
    Post.findOne({_id:req.body._id}, function(err, post) {
        if(err) {
            console.log(err);
        }
        else {
            var react = req.params.react;
            if(react === "like") {
                post.like.push(req.params.username);
            }
            else if(react === "love") {
                post.love.push(req.params.username);
            }
            else {
                post.laugh.push(req.params.username);
            }
            post.save(function(err) {
                if(err) {
                    res.status(400).json("Error: " + err);
                }
                else {
                    res.json(post);
                }    
            });
        }
    })

});

router.route("/add").post(function(req, res) {
    const post = new Post({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        like: [],
        love: [],
        laugh: []
    });

    post.save(function(err) {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json("post added");
        }
    });
});

module.exports = router;