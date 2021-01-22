const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

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

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;