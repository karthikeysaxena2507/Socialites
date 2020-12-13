require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const passport = require("passport");
// const session = require("express-session");
// const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.use(session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

// userSchema.plugin(passportLocalMongoose);

const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

// USEFUL WHEN DEPLOYING
if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", function(req,res) {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    });
};

app.listen(port, function() {
    console.log("server is ready");
});

