require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/user.model");
var LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://socialites-karthikey.herokuapp.com/socialites-karthikey/auth/google/social",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {

    User.findOrCreate( { 
        googleId: profile.id,
        username: profile._json.given_name
    }, function(err, user) {
        return cb(err, user);
    });
  }
));

app.get("/auth/google", passport.authenticate("google", { 
    scope: ["profile"]
 })
);

app.get("/socialites-karthikey/auth/google/social", passport.authenticate("google", {
    failureRedirect: "/login"
    }), function(req, res) {
        res.redirect("/allposts/"+req.user.username);
});

app.post("/logout", function(req, res) {
    req.logOut();
});

if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", function(req, res) {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    });
};

app.listen(port, function() {
    console.log("server is ready");
});

