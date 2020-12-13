const mongoose = require("mongoose");

const reactSchema = new mongoose.Schema({
    name: String,
    type: String
});

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    reacts: [reactSchema],
    like: Number,
    love: Number,
    laugh: Number
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;