const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    id: String,
    name: String,
    room: String
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;