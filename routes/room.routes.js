let router = require("express").Router();
let roomCtrl = require("../controllers/room.controller");
let auth = require("../middleware/auth");

// ACCESSING A PARTCULAR ROOM
router.get("/get/:id/:username", auth, roomCtrl.getRoom);

//ACCESSING ALL CHAT GROUPS CREATED BY A USER
router.get("/groups/:username", auth, roomCtrl.getRoomsByUser);

//ACCESSING ALL CHATS OF A USER
router.get("/chats/:username", auth, roomCtrl.getChatsByUser)

// CREATING A NEW CHAT
router.post("/chat", auth, roomCtrl.createChat);

// JOINING AN EXISTING ROOM
router.post("/join", auth, roomCtrl.joinRoom);

// CREATING A NEW ROOM
router.post("/create", auth, roomCtrl.createRoom);

// DELETING A CHAT ROOM
router.post("/delete/room", auth, roomCtrl.deleteRoom);


module.exports = router;
