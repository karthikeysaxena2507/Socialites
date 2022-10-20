let mongoose = require("mongoose");

let chatSchema = new mongoose.Schema({
    id: String,
    name: String,
    room: String
});

let Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;