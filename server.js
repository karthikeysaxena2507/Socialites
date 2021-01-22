require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
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

// SETTING UP SOCKET.IO FOR REAL TIME CHAT FEATURE
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
            // const chat = await Chat.find({room: data.room});
            room.save();
            // io.emit("users", {chat: chat});
            io.to(data.room).emit("message", {name: data.name, content: data.message});
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("disconnect", async() => {
        try {
            console.log("disconnected");
            const response = await Chat.deleteOne({id: socket.id});
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

// LISTENTING THE SERVER ON DEFINED PORT 
server.listen(port, () => {
    console.log(`server is ready on ${port}`);
});

