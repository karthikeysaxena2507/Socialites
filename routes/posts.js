
const router = require("express").Router();
let Post = require("../models/post.model");
let React = require("../models/react.model");
let Comment = require("../models/comment.model");

router.route("/").get((req, res) => {
    Post.find({}, (err, posts) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json(posts);
        }
    });
});

router.route("/:id").get((req, res) => {
    Post.find({_id: req.params.id}, (err, post) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json(post);
        }
    });
});

router.route("/list/:username").get((req, res) => {
    Post.find({author: req.params.username}, (err, posts) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json(posts);
        }
    });
});

router.route("/edit/:id").get((req, res) => {
    Post.findOne({_id: req.params.id}, (err, post) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            const edited_post = {
                title: post.title,
                content: post.content
            }
            post.save(function(err) {
                if(err) {
                    res.status(400).json("Error: " + err);
                }
                else {
                    res.json(edited_post);
                }
            });
        }
    });
});

router.route("/update/:react/:username").post((req, res) => {
    Post.findOne({_id:req.body._id}, (err, post) => {
        if(err) {
            console.log(err);
        }
        else {
            const newReact = new React({
                name: req.params.username,
                type: req.params.react
            });
            let index;
            for (index = 0 ; index < post.reacts.length ; index++) {
                if(post.reacts[index].name === newReact.name) {
                    if(newReact.type === post.reacts[index].type) {
                        post[post.reacts[index].type]--;
                    }
                    else {
                        post[post.reacts[index].type]--;
                        post[req.params.react]++;
                        post.reacts.push(newReact);
                    }
                    break;
                }
            }
            if(index === post.reacts.length) {
                post[newReact.type]++;
                post.reacts.push(newReact);
            }
            else {
                post.reacts.splice(index, 1);
            }
            post.save(function(err) {
                if(err) {
                    res.status(400).json("Error: " + err);
                }
                else {
                    res.json(post.reacts);
                }    
            });
        }
    })

});

router.route("/edit/:id").post((req, res) => {
    Post.findOne({_id: req.params.id}, (err, post) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
                post.title = req.body.title;
                post.content = req.body.content;
                post[comment_count]++;
                post.save(function(err) {
                if(err) {
                    res.status(400).json("Error: " + err);
                }
                else {
                    res.json("post updated");
                }
            });
        }
    });
});

router.route("/add").post((req, res) => {
    const post = new Post({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        reacts: [],
        like: 0,
        love: 0,
        laugh: 0
    });

    post.save((err) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json("post added");
        }
    });
});

router.route("/add/:id").post((req, res) => {
    Post.findOne({_id:req.params.id}, (err, post) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            const comment = new Comment(req.body);
            post.comments.push(comment);
            post.comment_count = post.comments.length;
            post.save(function(err) {
                if(err) {
                    res.status(400).json("Error: " + err);
                }
                else {
                    res.json(post.comments);
                }    
            });
        }
    });
});

router.route("/delete/:id").delete((req, res) => {
    Post.deleteOne({_id: req.params.id}, (err) => {
        if(err) {
            res.status(400).json("Error: " + err);
        }
        else {
            res.json("post deleted");
        }
    });
});

module.exports = router;