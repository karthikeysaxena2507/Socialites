const router = require("express").Router();
let Post = require("../models/post.model");
let React = require("../models/react.model");
let Comment = require("../models/comment.model");

router.route("/").get( async(req, res, next) => {
    try {
        const posts = await Post.find({});
        res.json(posts);
    }
    catch(error) {
        res.json(next(error));
    }
})

router.route("/getcomment/:commentId/:id").get( async(req, res, next) => {
    try {
        const post = await Post.find({_id: req.params.id});
        for (var index = 0; index < post[0].comments.length; index++) {
            if(post[0].comments[index]._id == req.params.commentId) {
                break;
            }    
        }
        res.json(post[0].comments[index]);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/:id").get( async(req, res, next) => {
    try {
        const post = await Post.find({_id: req.params.id});
        res.json(post);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/list/:username").get( async(req, res, next) => {
    try {
        const posts = await Post.find({author: req.params.username});
        res.json(posts);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/edit/:id").get( async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        const edited_post = {
            title: post.title,
            content: post.content,
            category: post.category
        }
        res.json(edited_post);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/update/:react/:username").post( async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.body._id});
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
        post.save();
        res.json(post);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/editpost/:id").post( async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        post.title = req.body.title;
        post.content = req.body.content;
        post.category = req.body.category;
        post.save();
        res.json("post updated");
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/add").post( async(req, res, next) => {
    try {   
        const post = new Post({
            author: req.body.author,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            reacts: [],
            comment_count: 0,
            like: 0,
            love: 0,
            laugh: 0
        });
        post.save();
        res.json("post added");
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/add/:id").post( async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        const comment = new Comment(req.body);
        post.comments.push(comment);
        post.comment_count = post.comments.length;
        post.save();
        res.json(post.comments);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/comment/:react/:postId/:username").post( async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.postId});
        for (var index = 0; index < post.comments.length; index++) {
            if(post.comments[index]._id == req.body._id) {
                break;
            }    
        }
        const newReact = new React({
            name: req.params.username,
            type: req.params.react
        });
        for (var cur = 0; cur < post.comments[index].reacts.length; cur++) {
            if(post.comments[index].reacts[cur].name === req.params.username) {
                if(req.params.react !== post.comments[index].reacts[cur].type) {
                    post.comments[index][post.comments[index].reacts[cur].type]--;
                    post.comments[index][req.params.react]++;
                    post.comments[index].reacts.push(newReact);
                }
                else {
                    post.comments[index][req.params.react]--; 
                }
                break;
            }
        }
        if(cur === post.comments[index].reacts.length) {
            post.comments[index].reacts.push(newReact);
            post.comments[index][newReact.type]++;
        }
        else {
            post.comments[index].reacts.splice(cur,1);
        }
        post.save(); 
        res.json(post.comments[index]);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/remove/:id").post( async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        for (var index = 0; index < post.comments.length; index++) {
            if(post.comments[index]._id == req.body._id) {
                break;
            }    
        }
        post.comments.splice(index, 1);
        post.comment_count--;
        post.save();
        res.json(post.comments);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.route("/delete/:id").delete( async(req, res, next) => {
    try {
        const response = await Post.deleteOne({_id: req.params.id});
    }
    catch(error) {
        res.json(next(error));
    }
});

module.exports = router;