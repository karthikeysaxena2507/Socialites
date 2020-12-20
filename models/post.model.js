const mongoose = require("mongoose");

const reactSchema = new mongoose.Schema({
    name: String,
    type: String
});

const commentSchema = new mongoose.Schema({
    name: String,
    content: String,
    likes: Number,
    loves: Number,
    laughs: Number,
    reacts: [reactSchema]
});

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    reacts: [reactSchema],
    comments: [commentSchema],
    comment_count: Number,
    like: Number,
    love: Number,
    laugh: Number
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;