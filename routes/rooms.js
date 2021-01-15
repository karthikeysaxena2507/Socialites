const router = require("express").Router();
const Room = require("../models/room.model");
const Message = require("../models/message.model");
const Users = require("../models/users.model");
const { v4: uuidv4 } = require("uuid");

router.get("/get/:id", async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.params.id});
        res.json(room);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.post("/add", async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.body.roomId});
        const message = new Message({
            username: req.body.username,
            content: req.body.message
        });
        room.messages.push(message);
        room.save();
        res.json(room);
    }
    catch(error) {
        res.json(next(error));
    }
})

router.post("/join", async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.body.roomId});
        if(room === null) {
            res.json("invalid");
        }
        else {
            res.json(room);
        }
    }
    catch(error) {
        res.json(next(error));
    }
});

router.post("/create", async(req, res, next) => {
    try {
        const roomId = uuidv4().replace(/-/g,'').substring(0,6);
        const room = new Room({
            roomId: roomId,
            messages: [],
            users: []
        });
        const user = new Users({
            name: req.body.username
        });
        room.users.push(user);
        room.save();
        res.json(room);
    }
    catch(error) {
        res.json(next(error));
    }
});

module.exports = router;