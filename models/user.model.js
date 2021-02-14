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
    totalUnread: Number,
    chats: [{
        roomId: String,
        name: String,
        unreadCount: Number,
        lastCount: Number
    }],
    rooms: [{
        roomId: String, 
        roomName: String,
        unreadCount: Number,
        lastCount: Number
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;