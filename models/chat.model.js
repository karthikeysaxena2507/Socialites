const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    username: String,
    content: String
});

const chatSchema = new mongoose.Schema({
    room: String,
    messages: [messageSchema]
});

const Chat = new mongoose.model("Chat", chatSchema);

module.exports = Chat;
