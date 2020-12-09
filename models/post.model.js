const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    like: [String],
    love: [String],
    laugh: [String]
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;