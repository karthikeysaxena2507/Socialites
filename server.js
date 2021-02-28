require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const { time } = require("./utils/date");

// USING ALL MIDDLEWARES
app.use(cors());
app.use(express.json( {limit: "50mb"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
const User = require("./models/user.model");

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
            if(existingUser === null) {
                const chat = new Chat({id: socket.id, name: data.name, room: data.room});
                await chat.save();
            }
            const onlineUsers = await Chat.find({room: data.room});
            for (let tempUser of onlineUsers) {
                const user = await User.findOne({username: tempUser.name});
                if(room.isGroup) {
                    let temp = null;
                    for (let item of user.rooms) {
                        if(item.roomId === data.room) {
                            temp = item;
                            break;
                        }
                    }
                    if(temp !== null) temp.lastCount = room.messages.length;
                    await user.save();
                }
                else {
                    let temp = null;
                    for (let item of user.chats) {
                        if(item.roomId === data.room) {
                            temp = item;
                            break;
                        }
                    }
                    if(temp !== null) temp.lastCount = room.messages.length;
                    await user.save();
                }
            }
            const chat = await Chat.find({room: data.room});
            await socket.join(data.room);
            await io.to(data.room).emit("users", {chat: chat});
            await io.to(data.room).emit("message", {name: "Admin", content: `Hello ${data.name}, Welcome`, time: time()});
        }
        catch(error) {
            console.log(error);
        }
    });

    socket.on("sendmessage", async(data) => {
        try {
            const room = await Room.findOne({roomId: data.room});
            const onlineUsers = await Chat.find({room: data.room});
            room.messages.push({name: data.name, content: data.message, time: data.time});
            for (let tempUser of onlineUsers) {
                const user = await User.findOne({username: tempUser.name});
                if(room.isGroup) {
                    let temp = null;
                    for (let item of user.rooms) {
                        if(item.roomId === data.room) {
                            temp = item;
                            break;
                        }
                    }
                    if(temp !== null) temp.lastCount = room.messages.length;
                    await user.save();
                }
                else {
                    let temp = null;
                    for (let item of user.chats) {
                        if(item.roomId === data.room) {
                            temp = item;
                            break;
                        }
                    }
                    if(temp !== null) temp.lastCount = room.messages.length;
                    await user.save();
                }
            }    
            room.save()
            .then(async() => {
                const chat = await Chat.find({room: data.room});
                await io.to(data.room).emit("users", {chat: chat});
                await io.to(data.room).emit("message", {name: data.name, content: data.message, time: data.time});
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
            const onlineUsers = await Chat.find({room: data.room});
            const messageIndex = await room.messages.findIndex((message) => (message._id == data.messageId));
            await room.messages.splice(messageIndex, 1);
            for(let tempUser of onlineUsers) 
            {
                const user = await User.findOne({username: tempUser.name});
                if(room.isGroup)
                {
                    let temp = null;
                    for (let item of user.rooms) {
                        if(item.roomId === data.room) {
                            temp = item;
                            break;
                        }
                    }
                    if(temp !== null) temp.lastCount = room.messages.length;
                    await user.save();
                }
                else 
                {
                    let temp = null;
                    for (let item of user.chats) {
                        if(item.roomId === data.room) {
                            temp = item;
                            break;
                        }
                    }
                    if(temp !== null) temp.lastCount = room.messages.length;
                    await user.save();
                }
            }
            room.save()
            .then(async() => {
                const chat = await Chat.find({room: data.room});
                await io.to(data.room).emit("users", {chat});
                await io.to(data.room).emit("updatemessages", {messages: room.messages});
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

