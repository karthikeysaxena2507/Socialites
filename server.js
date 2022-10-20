require("dotenv").config();
let express = require("express");
let cors = require("cors");
let mongoose = require("mongoose");
let cookieParser = require("cookie-parser");
let http = require("http");
let app = express();
let server = http.createServer(app);
let port = process.env.PORT || 5000;
let help = require("./helper/index");

// USING ALL MIDDLEWARES
app.use(cors({
    origin: "https://socialites-karthikey.herokuapp.com/"
}));
app.use(express.json( {limit: "50mb"}));
app.use(cookieParser(process.env.COOKIE_SECRET));

// CONNECTING TO MONGODB ATLAS
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {console.log("Mongodb cluster connected Successfully");})
.catch((err) => {console.log(err);});

// IMPORTING ALL ROUTES
let postsRouter = require("./routes/post.routes");
let usersRouter = require("./routes/user.routes");
let roomsRouter = require("./routes/room.routes");
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);

// SETTING UP SOCKET.IO FOR REAL TIME CHAT FEATURE
let Room = require("./models/room.model");
let Chat = require("./models/chat.model");
let helper = require("./helper/chat");
let { cloudinary } = require("./utils/cloudinary");

let io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});


io.on("connection", (socket) => {

    socket.on("join", async(data) => {
        try {
            let room = await Room.findOne({roomId: data.room});
            let existingUser = await Chat.findOne({name: data.name, room: data.room});
            if(existingUser === null) 
            {
                let chat = new Chat({id: socket.id, name: data.name, room: data.room});
                await chat.save();
            }
            await helper.updateOnlineUsers(data.room, room.messages.length, room.isGroup)
            let chat = await Chat.find({room: data.room});
            await socket.join(data.room);
            await io.to(data.room).emit("users", {chat: chat});
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("sendmessage", async(data) => {
        try {
            let room = await Room.findOne({roomId: data.room});
            var imageUrl = "";
            if(data.imageUrl !== "") 
            {
                var fileStr = data.imageUrl;
                var uploadedResponse = await cloudinary.uploader.
                upload(fileStr, {
                    upload_preset: "socialites"
                });
                imageUrl = uploadedResponse.url;
            }
            await room.messages.push({name: data.name, content: help.sanitize(data.message), imageUrl, time: data.time});
            await helper.updateOnlineUsers(data.room, room.messages.length, room.isGroup);    
            let chat = await Chat.find({room: data.room});
            let messagesCount = room.messages.length;
            room.save()
            .then((roomData) => {
                let messageId = roomData.messages[messagesCount - 1]._id;
                io.to(data.room).emit("users", {chat: chat});
                io.to(data.room).emit("message", { _id: messageId , name: data.name, content: help.sanitize(data.message), imageUrl, time: data.time});
            })
            .catch((err) => {
                console.log(err);
            });
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("deletemessage", async(data) => {
        try {
            let room = await Room.findOne({roomId: data.room});
            let chat = await Chat.find({room: data.room});
            let messageIndex = await room.messages.findIndex((message) => (message._id == data.messageId));
            room.messages[messageIndex].content = "";
            room.messages[messageIndex].imageUrl = "";
            await helper.updateOnlineUsers(data.room, room.messages.length, room.isGroup);    
            room.save()
            .then(async (roomData) => {
                await io.to(data.room).emit("users", {chat});
                await io.to(data.room).emit("updatemessages", {messages: roomData.messages});
            })
            .catch((error) => {
                console.log(error);
            });
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("disconnect", async() => {
        try {
            await Chat.deleteOne({id: socket.id});
        }
        catch(error) {
            console.log(error);
        }
    });

});

// HANDLING THE PRODUCTION BUILD FOR HEROKU
if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    let path = require("path");
    app.get("*", function(req, res) {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    });
};

// LISTENTING THE SERVER ON DEFINED PORT 
server.listen(port, () => {
    console.log(`server is ready on ${port}`);
});

