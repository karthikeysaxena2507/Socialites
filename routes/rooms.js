const router = require("express").Router();
const Room = require("../models/room.model");
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

// CREATING A NEW CHAT
router.post("/chat", async(req, res, next) => {
    try {
        const room = await Room.findOne({roomId: req.body.roomId});
        if(room === null) {
            const room = new Room({
                roomId: req.body.roomId,
                messages: []
            });
            const message = {name: "Admin", content: `Hello Users`, time: time()};
            room.messages.push(message);
            room.save()
            .then((data) => {
                res.json(data);
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
        const room = await Room.findOne({roomId: req.body.roomId, roomName: req.body.roomId});
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

// CREATING A NEW ROOM
router.post("/create", async(req, res, next) => {
    try {
        const roomId = uuidv4().replace(/-/g,'').substring(0,6);
        const room = new Room({
            roomId: roomId,
            roomName: roomId,
            messages: []
        });
        const message = {name: "Admin", content: `Hello Users`, time: time()};
        room.messages.push(message);
        room.save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
    }
    catch(error) {
        res.json(next(error));
    }
});

module.exports = router;
