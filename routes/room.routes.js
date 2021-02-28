const router = require("express").Router();
const roomCtrl = require("../controllers/room.controller");

// ACCESSING A PARTCULAR ROOM
router.get("/get/:id", roomCtrl.getRoom);

//ACCESSING ALL CHAT GROUPS CREATED BY A USER
router.get("/groups/:username", roomCtrl.getRoomsByUser);

//ACCESSING ALL CHATS OF A USER
router.get("/chats/:username", roomCtrl.getChatsByUser)

// CREATING A NEW CHAT
router.post("/chat", roomCtrl.createChat);

// JOINING AN EXISTING ROOM
router.post("/join", roomCtrl.joinRoom);

// CREATING A NEW ROOM
router.post("/create", roomCtrl.createRoom);

// DELETING A MESSAGE FROM A CHAT
router.post("/delete/message", roomCtrl.deleteMessage);

// DELETING A CHAT ROOM
router.post("/delete/room", roomCtrl.deleteRoom);


module.exports = router;
