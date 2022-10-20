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

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;