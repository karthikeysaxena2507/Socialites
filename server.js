require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// USING ALL MIDDLEWARES
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(express.json( {limit: "50mb"}));
app.use(cookieParser(process.env.COOKIE_SECRET));

// CONNECTING TO MONGODB ATLAS
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then(() => {console.log("Mongodb cluster connected Successfully");})
.catch((err) => {console.log(err);});

// IMPORTING ALL ROUTES
const postsRouter = require("./routes/post.routes");
const usersRouter = require("./routes/user.routes");
const roomsRouter = require("./routes/room.routes");
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);

// SETTING UP SOCKET.IO FOR REAL TIME CHAT FEATURE
const Room = require("./models/room.model");
const Chat = require("./models/chat.model");
const helper = require("./helper/chat");
const { cloudinary } = require("./utils/cloudinary");

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});


io.on("connection", (socket) => {

    socket.on("join", async(data) => {
        try {
            const room = await Room.findOne({roomId: data.room});
            const existingUser = await Chat.findOne({name: data.name, room: data.room});
            if(existingUser === null) 
            {
                const chat = new Chat({id: socket.id, name: data.name, room: data.room});
                await chat.save();
            }
            await helper.updateOnlineUsers(data.room, room.messages.length, room.isGroup)
            const chat = await Chat.find({room: data.room});
            await socket.join(data.room);
            await io.to(data.room).emit("users", {chat: chat});
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("sendmessage", async(data) => {
        try {
            const room = await Room.findOne({roomId: data.room});
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
            await room.messages.push({name: data.name, content: data.message, imageUrl, time: data.time});
            await helper.updateOnlineUsers(data.room, room.messages.length, room.isGroup);    
            const chat = await Chat.find({room: data.room});
            const messagesCount = room.messages.length;
            room.save()
            .then((roomData) => {
                const messageId = roomData.messages[messagesCount - 1]._id;
                io.to(data.room).emit("users", {chat: chat});
                io.to(data.room).emit("message", { _id: messageId , name: data.name, content: data.message, imageUrl, time: data.time});
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
            const room = await Room.findOne({roomId: data.room});
            const chat = await Chat.find({room: data.room});
            const messageIndex = await room.messages.findIndex((message) => (message._id == data.messageId));
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
    const path = require("path");
    app.get("*", function(req, res) {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    });
};

// LISTENTING THE SERVER ON DEFINED PORT 
server.listen(port, () => {
    console.log(`server is ready on ${port}`);
});

