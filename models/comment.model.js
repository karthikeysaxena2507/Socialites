const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    name: String,
    content: String,
    likes: Number
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;