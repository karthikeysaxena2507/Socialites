const router = require("express").Router();
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

router.get("/get/:room", async(req, res, next) => {
    try {
        const foundChat = await Chat.findOne({room: req.params.room});
        if(foundChat === null) {
            const chat = new Chat({
                room: req.params.room,
                messages: []
            });
            chat.save();
            res.json([]);
        }
        res.json(foundChat.messages);
    }
    catch(error) {
        res.json(next(error));
    }
});

router.post("/add/:room", async(req, res, next) => {
    try {
        const chat = await Chat.findOne({room: req.params.room});
        const message = new Message({
            username: req.body.username,
            content: req.body.content
        });
        chat.messages.push(message);
        chat.save();
        res.json(chat.messages);
    }
    catch(error) {
        res.json(next(error));
    }
})

module.exports = router;