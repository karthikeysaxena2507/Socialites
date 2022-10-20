let mongoose = require("mongoose");

let reactSchema = new mongoose.Schema({
    name: String,
    type: String
});

let commentSchema = new mongoose.Schema({
    name: String,
    content: String,
    likes: Number,
    loves: Number,
    laughs: Number,
    reacts: [reactSchema]
});

let postSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    reacts: [reactSchema],
    comments: [commentSchema],
    comment_count: Number,
    category: String,
    imageUrl: String,
    like: Number,
    love: Number,
    laugh: Number
});

let Post = mongoose.model("Post", postSchema);

module.exports = Post;