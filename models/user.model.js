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
    about: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;