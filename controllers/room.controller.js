const Room = require("../models/room.model");
const User = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const { time } = require("../helper/date");

const getRoom = async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.params.id});
        res.json(room);
    }
    catch(error) {
        res.json(next(error));
    }
}

const getRoomsByUser = async(req, res, next) => {
    try {
        const userRooms = await User.findOne({username: req.params.username}).select(['rooms']);
        res.json(userRooms);
    }
    catch(err) {
        res.json(next(err));
    }
}   

const getChatsByUser = async(req, res, next) => {
    try {
        const userChats = await User.findOne({username: req.params.username}).select(['chats']);
        res.json(userChats);
    }
    catch(err) {
        res.json(next(err));
    }
}

const createChat = async(req, res, next) => {
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
            const userRoom1 = {
                roomId: req.body.roomId, 
                name: req.body.user2, 
                lastCount: 1,
                unreadCount: 0
            };
            user1.chats.push(userRoom1);
            user1.save()
            .then(async() => {
                const user2 = await User.findOne({username: req.body.user2});
                const userRoom2 = {
                    roomId: req.body.roomId, 
                    name: req.body.user1, 
                    lastCount: 1,
                    unreadCount: 0
                };
                user2.chats.push(userRoom2);
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
}

const joinRoom = async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.body.roomId, isGroup: true});
        const user = await User.findOne({username: req.body.username});
        if(room === null) {
            res.json("invalid");
        }
        else {
            const userRoom = {
                roomId: room.roomId, 
                roomName: room.roomName, 
                unreadCount: 0,
                lastCount: 1
            };
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
                    });
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
}

const createRoom = async(req, res, next) => {
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
                users: [],
                messages: []
            });
            const userRoom = {
                roomId: room.roomId, 
                roomName: room.roomName, 
                unreadCount: 0,
                lastCount: 1
            };
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
}

const deleteRoom = async(req, res, next) => {
    try {
        const { username, id, roomId } = req.body;
        const user = await User.findOne({username});
        const room = await Room.findOne({roomId, isGroup: true});
        let userIndex = await room.users.findIndex((user) => (user.name === username));
        let roomIndex = await user.rooms.findIndex((room) => (room._id == id));
        await user.rooms.splice(roomIndex, 1);
        await room.users.splice(userIndex, 1);
        user.save()
        .then(async() => {
            room.save()
            .then(() => {
                res.json(user.rooms);
            })
            .catch((error) => {
                res.json(error);
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }
    catch(error) {
        res.json(next(error));
    }
}

const deleteMessage = async(req, res, next) => {
    try {

    }
    catch(error) {
        res.json(next(error));
    }
}

module.exports = {
                    getRoom,
                    getChatsByUser,
                    getRoomsByUser,
                    createChat,
                    createRoom,
                    joinRoom,
                    deleteRoom,
                    deleteMessage
                 }