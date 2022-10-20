let mongoose = require("mongoose");

let roomSchema = new mongoose.Schema({
    roomId: String,
    roomName: String,
    isGroup: Boolean,
    creator: String,
    users: [{name: String}],
    messages: [{name: String, content: String, imageUrl: String, time: String}]
});

let Room = mongoose.model("Room", roomSchema);

module.exports = Room;