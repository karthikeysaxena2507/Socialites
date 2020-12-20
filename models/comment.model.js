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

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;