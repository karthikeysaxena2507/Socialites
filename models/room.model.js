const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    username: String,
    content: String
});

const usersSchema = new mongoose.Schema({
    name: String
});

const roomSchema = new mongoose.Schema({
    roomId: String,
    users: [usersSchema],
    messages: [messageSchema]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;