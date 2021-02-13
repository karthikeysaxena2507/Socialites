const router = require("express").Router();
const Room = require("../models/room.model");
const User = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const { time } = require("../utils/date");

// ACCESSING A PARTCULAR ROOM
router.get("/get/:id", async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.params.id});
        res.json(room);
    }
    catch(error) {
        res.json(next(error));
    }
});

//ACCESSING ALL ROOMS CREATED BY A USER
router.get("/all/:username", async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username}).select(['rooms']);
        const rooms = await user.rooms.filter((room) => {return (room.isGroup === true)});
        res.json(rooms);
    }
    catch(err) {
        res.json(next(err));
    }
})

// CREATING A NEW CHAT
router.post("/chat", async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.body.roomId, isGroup: false});
        if(room === null) {
            const room = new Room({
                roomId: req.body.roomId,
                roomName: req.body.roomId,
                isGroup: false,
                users: [],
                messages: []
            });
            const user1 = await User.findOne({username: req.body.user1});
            const userRoom = {roomId: req.body.roomId, roomName: req.body.roomName, isGroup: false};
            user1.rooms.push(userRoom);
            user1.save()
            .then(async() => {
                const user2 = await User.findOne({username: req.body.user2});
                user2.rooms.push(userRoom);
                user2.save()
                .then(() => {
                    const message = {name: "Admin", content: `Hello Users`, time: time()};
                    room.messages.push(message);
                    room.users.push({name: req.body.user1});
                    room.users.push({name: req.body.user2});
                    room.save()
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) => {
                        res.json(err);
                    });
                })
                .catch((err) => {
                    res.json(err);
                });
            })
            .catch((err) => {
                res.json(err);
            });
        }
        else {
            res.json(room);
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

// JOINING AN EXISTING ROOM
router.post("/join", async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.body.roomId, isGroup: true});
        const user = await User.findOne({username: req.body.username});
        if(room === null) {
            res.json("invalid");
        }
        else {
            const userRoom = {roomId: room.roomId, roomName: room.roomName, isGroup: true};
            let flag = false;
            for (let item of user.rooms) {
                if(item.roomId === room.roomId) {
                    flag = true;
                    break;
                }
            }
            if(!flag) {
                user.rooms.push(userRoom);
                user.save()
                .then(() => {
                    room.users.push({name: req.body.username});
                    room.save()
                    .then(() => {
                        res.json(room);
                    })
                    .catch((err) => {
                        res.json(err);
                    })
                    res.json(room);
                })
                .catch((err) => {
                    res.json(err);
                })
            }
            else {
                res.json(room);
            }
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

// CREATING A NEW ROOM
router.post("/create", async(req, res, next) => {
    try {
        const roomId = uuidv4().replace(/-/g,'').substring(0,6);
        const existingRoom = await Room.findOne({roomName: req.body.roomName});
        if(existingRoom) {
            res.json("Room Name Already Exists");
        }
        else {
            const room = new Room({
                roomId: roomId,
                roomName: req.body.roomName,
                isGroup: true,
                creator: req.body.username,
                messages: []
            });
            const userRoom = {roomId, roomName: req.body.roomName, isGroup: true};
            const user = await User.findOne({username: req.body.username});
            user.rooms.push(userRoom);
            user.save()
            .then(() => {
                const message = {name: "Admin", content: `Hello Users`, time: time()};
                room.messages.push(message);
                room.users.push({name: req.body.username});
                room.save()
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    res.json(err);
                });
            })  
            .catch((err) => {
                res.json(err);
            }); 
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

module.exports = router;
