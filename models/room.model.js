const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: String,
    roomName: String,
    messages: [{name: String, content: String}]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;