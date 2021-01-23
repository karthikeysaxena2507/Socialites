const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: String,
    roomName: String,
    messages: [{name: String, content: String, time: String}]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;