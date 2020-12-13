const mongoose = require("mongoose");

const reactSchema = new mongoose.Schema({
    name: String,
    type: String
});

const React = mongoose.model("React", reactSchema);

module.exports = React;