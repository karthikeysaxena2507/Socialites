let mongoose = require("mongoose");

let reactSchema = new mongoose.Schema({
    name: String,
    type: String
});

let React = mongoose.model("React", reactSchema);

module.exports = React;