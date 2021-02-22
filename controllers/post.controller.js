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
        const { title, content, imageUrl, category } = post;
        res.json({ title, content, imageUrl, category });
    }
    catch(error) {
        res.json(next(error));
    }
}

const addReactionToPost = async(req, res, next) => {
    try 
    {
        const post = await Post.findOne({_id: req.body._id});
        const newReaction = new React({
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
        const { author, title, content, category } = req.body;
        const post = new Post({
            author,
            title,
            content,
            category,
            imageUrl,
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
        const newReaction = new React({
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
            post.comments[index].reacts.push(newReaction);
            post.comments[index][newReaction.type]++;
        }
        else 
        {
            post.comments[index].reacts.splice(id,1);
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