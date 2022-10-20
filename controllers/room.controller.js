let Room = require("../models/room.model");
let User = require("../models/user.model");
let { v4: uuidv4 } = require("uuid");
let { time } = require("../helper/date");
let helper = require("../helper/index");

let getRoom = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authorized"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You can only see your own chats"});
        }
        else {
            let room = await Room.findOne({roomId: req.params.id});
            res.json(room);
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

let getRoomsByUser = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authorized"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You can only see your own chat rooms"});
        }
        else {
            let userRooms = await User.findOne({username: req.params.username}).select(['rooms']);
            res.json(userRooms);
        }
    }
    catch(err) {
        res.json(next(err));
    }
}   

let getChatsByUser = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You can only see your own chats"});
        }
        else {
            let userChats = await User.findOne({username: req.params.username}).select(['chats']);
            res.json(userChats);
        }
    }
    catch(err) {
        res.json(next(err));
    }
}

let createChat = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.user1) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let room = await Room.findOne({roomId: req.body.roomId, isGroup: false});
            if(room === null) {
                let room = new Room({
                    roomId: req.body.roomId,
                    roomName: req.body.roomId,
                    isGroup: false,
                    users: [],
                    messages: []
                });
                let user1 = await User.findOne({username: req.body.user1});
                let userRoom1 = {
                    roomId: req.body.roomId, 
                    name: req.body.user2, 
                    lastCount: 1,
                    unreadCount: 0
                };
                user1.chats.push(userRoom1);
                user1.save()
                .then(async() => {
                    let user2 = await User.findOne({username: req.body.user2});
                    let userRoom2 = {
                        roomId: req.body.roomId, 
                        name: req.body.user1, 
                        lastCount: 1,
                        unreadCount: 0
                    };
                    user2.chats.push(userRoom2);
                    user2.save()
                    .then(() => {
                        let message = {name: "Admin", content: `Hello Users`, time: time()};
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
    }
    catch(error) {
        res.json(next(error));
    }
}

let joinRoom = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let room = await Room.findOne({roomId: req.body.roomId, isGroup: true});
            let user = await User.findOne({username: req.body.username});
            if(room === null) {
                res.json("invalid");
            }
            else {
                let userRoom = {
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
    }
    catch(error) {
        res.json(next(error));
    }
}

let createRoom = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let roomId = uuidv4().replace(/-/g,'').substring(0,6);
            let existingRoom = await Room.findOne({roomName: req.body.roomName});
            if(existingRoom) {
                res.json("Room Name Already Exists");
            }
            else {
                let room = new Room({
                    roomId: roomId,
                    roomName: helper.sanitize(req.body.roomName),
                    isGroup: true,
                    creator: req.body.username,
                    users: [],
                    messages: []
                });
                let userRoom = {
                    roomId: room.roomId, 
                    roomName: helper.sanitize(room.roomName), 
                    unreadCount: 0,
                    lastCount: 1
                };
                let user = await User.findOne({username: req.body.username});
                user.rooms.push(userRoom);
                user.save()
                .then(() => {
                    let message = {name: "Admin", content: `Hello Users`, time: time()};
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
    }
    catch(error) {
        res.json(next(error));
    }
}

let deleteRoom = async(req, res, next) => {
    try {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            let { username, id, roomId } = req.body;
            let user = await User.findOne({username});
            let room = await Room.findOne({roomId, isGroup: true});
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
                 }
