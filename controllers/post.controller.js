let Post = require("../models/post.model");
let React = require("../models/react.model");
let Comment = require("../models/comment.model");
let helper = require("../helper/index");
let { cloudinary } = require("../utils/cloudinary");
let { lifestyleKeywords } = require("../utils/data");

let getAllPosts = async(req, res, next) => {
    try {
        let posts = await Post.find({});
        res.json(posts);
    }
    catch(error) {
        res.json(next(error));
    }
}

let getComment = async(req, res, next) => {
    try {
        let post = await Post.find({_id: req.params.id});
        var index = post[0].comments.findIndex((comment) => (comment._id == req.params.commentId));
        res.json(post[0].comments[index]);
    }
    catch(error) {
        res.json(next(error));
    }
}

let getPost = async(req, res, next) => {
    try {
        let post = await Post.find({_id: req.params.id});
        res.json(post);
    }
    catch(error) {
        res.json(next(error));
    }
}

let getPostsByUser = async(req, res, next) => {
    try {
        let posts = await Post.find({author: req.params.username});
        res.json(posts);
    }
    catch(error) {
        res.json(next(error));
    }
}

let getPostById = async(req, res, next) => {
    try {
        let post = await Post.findOne({_id: req.params.id});
        let { title, content, imageUrl, category } = post;
        res.json({ title, content, imageUrl, category });
    }
    catch(error) {
        res.json(next(error));
    }
}

let addReactionToPost = async(req, res, next) => {
    try 
    {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let post = await Post.findOne({_id: req.body._id});
            let newReaction = new React({
                name: req.params.username,
                type: req.params.react
            });
            let id = 0;
            for (let reaction of post.reacts) 
            {
                if(reaction.name === newReaction.name) 
                {
                    if(newReaction.type === reaction.type) 
                    {
                        post[reaction.type]--;
                    }
                    else 
                    {
                        post[reaction.type]--;
                        post[newReaction.type]++;
                        post.reacts.push(newReaction);
                    }
                    break;
                }
                id++;
            }
            if(id === post.reacts.length) {
                post[newReaction.type]++;
                post.reacts.push(newReaction);
            }
            else {
                post.reacts.splice(id, 1);
            }
            post.save()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let editPost = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.author) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let post = await Post.findOne({_id: req.params.id});
            var imageUrl = "";
            if(req.body.data !== "") {
                var fileStr = req.body.data;
                var uploadedResponse = await cloudinary.uploader.
                upload(fileStr, {
                    upload_preset: "socialites"
                });
                imageUrl = uploadedResponse.url;
            }
            post.title = helper.sanitize(req.body.title);
            post.content = helper.sanitize(req.body.content);
            post.category = helper.sanitize(req.body.category);
            post.imageUrl = helper.sanitize(imageUrl);
            post.save()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let addPost = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.author) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            var imageUrl = "";
            if(req.body.data !== "") {
                var fileStr = req.body.data;
                var uploadedResponse = await cloudinary.uploader.
                upload(fileStr, {
                    upload_preset: "socialites"
                });
                imageUrl = uploadedResponse.url;
            }
            let { author, title, content, category } = req.body;
            let post = new Post({
                author: helper.sanitize(author),
                title: helper.sanitize(title),
                content: helper.sanitize(content),
                category: helper.sanitize(category),
                imageUrl: helper.sanitize(imageUrl),
                reacts: [],
                comment_count: 0,
                like: 0,
                love: 0,
                laugh: 0
            });
            post.save()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }   
    catch(error) {
        res.json(next(error));
    }
}

let addComment = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.name) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let post = await Post.findOne({_id: req.params.id});
            req.body.content = helper.sanitize(req.body.content);
            let comment = new Comment(req.body);
            post.comments.push(comment);
            post.comment_count = post.comments.length;
            post.save()
            .then((data) => {
                res.json(data.comments);
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let addReactionToComment = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let post = await Post.findOne({_id: req.params.postId});
            let index = await post.comments.findIndex((comment) => (comment._id == req.body._id));
            let newReaction = new React({
                name: req.params.username,
                type: req.params.react
            });
            let id = 0;
            for (let reaction of post.comments[index].reacts) 
            {
                if(reaction.name === newReaction.name)
                {
                    if(newReaction.type !== reaction.type)
                    {
                        post.comments[index][reaction.type]--;
                        post.comments[index][newReaction.type]++;
                        post.comments[index].reacts.push(newReaction);
                    }
                    else 
                    {
                        post.comments[index][newReaction.type]--;
                    }
                    break;
                }
                id++;
            }
            if(id === post.comments[index].reacts.length) 
            {
                await post.comments[index].reacts.push(newReaction);
                post.comments[index][newReaction.type]++;
            }
            else 
            {
                await post.comments[index].reacts.splice(id,1);
            }
            post.save()
            .then((data) => {
                res.json(data.comments[index]);
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let deleteComment = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let post = await Post.findOne({_id: req.params.id});
            var index = post.comments.findIndex((comment) => comment._id == req.body._id);
            if(index !== -1) 
            {
                post.comments.splice(index, 1);
                post.comment_count--;
            }
            post.save()
            .then((data) => {
                res.json(data.comments);
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let deletePost = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let response = await Post.deleteOne({_id: req.params.id});
            res.json(response);
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

module.exports = { 
                    getAllPosts,
                    getComment,
                    getPost,
                    getPostById,
                    getPostsByUser,
                    addComment,
                    addPost,
                    addReactionToComment,
                    addReactionToPost,
                    editPost,
                    deleteComment,
                    deletePost
                 };