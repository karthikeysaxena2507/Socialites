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
const http = require("http");
const webpush = require("web-push");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// WEB PUSH NOTIFICATIONS
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);
app.post("/subscribe", (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: "Push test"});
    webpush.sendNotification(subscription, payload).catch(err => console.log(err));
});

// USING ALL MIDDLEWARES
app.use(cors());
app.use(express.json( {limit: "50mb"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// CONNECTING TO MONGODB ATLAS
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then(() => {console.log("DB connected successfully");})
.catch((err) => {console.log(err);});

// IMPORTING ALL ROUTES
const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");
const roomsRouter = require("./routes/rooms.js");
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);

// SETTING UP PASSPORT MIDDLEWARE
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
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ 
        userId: profile.id,
        username: profile._json.given_name,
        email: profile.email
    }, function(err, user) {
        return cb(err, user);
    });
  }
));

// AUTHENTICATIONS ROUTES
app.get("/auth/google", passport.authenticate("google", { 
    scope: ["profile"]
 })
);
var googleUser = "";
app.get("/socialites-karthikey/auth/google/social", passport.authenticate("google", {
    failureRedirect: "/login"
    }), (req, res) => {
        googleUser = req.user.username;
        res.redirect("/allposts");
});
app.get("/auth", async(req, res, next) => {
    try {
        res.json(googleUser);
    }
    catch(err) {
        res.json(next(err));
    }
}); 
app.post("/logout", (req, res) => {
    req.logOut();
    res.json("logged out");
});

// SOCKET.IO FOR REAL TIME CHAT FEATURE
const Room = require("./models/room.model");
const Chat = require("./models/chat.model");
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

io.on("connection", (socket) => {
    socket.on("join", async(data) => {
        try {
            const existingUser = await Chat.findOne({name: data.name, room: data.room});
            if(existingUser === null) {
                const chat = await new Chat({id: socket.id, name: data.name, room: data.room});
                chat.save();
            }
            socket.join(data.room);
            io.to(data.room).emit("message", {name: "Admin", content: `Hello ${data.name}, Welcome`});
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("sendmessage", async(data) => {
        try {
            const room = await Room.findOne({roomId: data.room});
            room.messages.push({name: data.name, content: data.message});
            room.save();
            io.to(data.room).emit("message", {name: data.name, content: data.message});
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("disconnect", async() => {
        try {
            console.log("disconnected");
        }
        catch(error) {
            console.log(error);
        }
    })
});

// HANDLING THE PRODUCTION BUILD FOR HEROKU
if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", function(req, res) {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    });
};

server.listen(port, () => {
    console.log(`server is ready on ${port}`);
});

