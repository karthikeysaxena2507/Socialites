const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userId: String,
    verified: Boolean,
    resetToken: String,
    verifyToken: String,
    expiresIn: Date,
    imageUrl: String,
    about: String,
    rooms: [{roomId: String, roomName: String, isGroup: Boolean}]
});

const User = mongoose.model("User", userSchema);

module.exports = User;