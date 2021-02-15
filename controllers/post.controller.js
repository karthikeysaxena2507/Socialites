let Post = require("../models/post.model");
let React = require("../models/react.model");
let Comment = require("../models/comment.model");
const { cloudinary } = require("../utils/cloudinary");

const getAllPosts = async(req, res, next) => {
    try {
        const posts = await Post.find({});
        res.json(posts);
    }
    catch(error) {
        res.json(next(error));
    }
}

const getComment = async(req, res, next) => {
    try {
        const post = await Post.find({_id: req.params.id});
        var index = post[0].comments.findIndex((comment) => (comment._id == req.params.commentId));
        res.json(post[0].comments[index]);
    }
    catch(error) {
        res.json(next(error));
    }
}

const getPost = async(req, res, next) => {
    try {
        const post = await Post.find({_id: req.params.id});
        res.json(post);
    }
    catch(error) {
        res.json(next(error));
    }
}

const getPostsByUser = async(req, res, next) => {
    try {
        const posts = await Post.find({author: req.params.username});
        res.json(posts);
    }
    catch(error) {
        res.json(next(error));
    }
}

const getPostById = async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        const edited_post = {
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            category: post.category
        }
        res.json(edited_post);
    }
    catch(error) {
        res.json(next(error));
    }
}

const addReactionToPost = async(req, res, next) => {
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
        post.save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
    }
    catch(error) {
        res.json(next(error));
    }
}

const editPost = async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        var imageUrl = "";
        if(req.body.data !== "") {
            var fileStr = req.body.data;
            var uploadedResponse = await cloudinary.uploader.
            upload(fileStr, {
                upload_preset: "socialites"
            });
            imageUrl = uploadedResponse.url;
        }
        post.title = req.body.title;
        post.content = req.body.content;
        post.category = req.body.category;
        post.imageUrl = imageUrl;
        post.save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
    }
    catch(error) {
        res.json(next(error));
    }
}

const addPost = async(req, res, next) => {
    try {
        var imageUrl = "";
        if(req.body.data !== "") {
            var fileStr = req.body.data;
            var uploadedResponse = await cloudinary.uploader.
            upload(fileStr, {
                upload_preset: "socialites"
            });
            imageUrl = uploadedResponse.url;
        }
        const post = new Post({
            author: req.body.author,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            imageUrl: imageUrl,
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
    catch(error) {
        res.json(next(error));
    }
}

const addComment = async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        const comment = new Comment(req.body);
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
    catch(error) {
        res.json(next(error));
    }
}

const addReactionToComment = async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.postId});
        var index = post.comments.findIndex((comment) => (comment._id == req.body._id));
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
        post.save()
        .then((data) => {
            res.json(data.comments[index]);
        })
        .catch((err) => {
            res.json(err);
        });
    }
    catch(error) {
        res.json(next(error));
    }
}

const deleteComment = async(req, res, next) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        var index = post.comments.findIndex((comment) => comment._id == req.body._id);
        if(index !== -1) {
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
    catch(error) {
        res.json(next(error));
    }
}

const deletePost = async(req, res, next) => {
    try {
        const response = await Post.deleteOne({_id: req.params.id});
        res.json(response);
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