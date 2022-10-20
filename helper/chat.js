let User = require("../models/user.model");
let Chat = require("../models/chat.model");

let updateOnlineUsers = async(roomId, countOfMessages, isGroup) => {
    let onlineUsers = await Chat.find({room: roomId});
    for (let tempUser of onlineUsers) {
        let user = await User.findOne({username: tempUser.name});
        if(isGroup) {
            let temp = null;
            for (let item of user.rooms) {
                if(item.roomId === roomId) {
                    temp = item;
                    break;
                }
            }
            if(temp !== null) temp.lastCount = countOfMessages;
            await user.save();
        }
        else {
            let temp = null;
            for (let item of user.chats) {
                if(item.roomId === roomId) {
                    temp = item;
                    break;
                }
            }
            if(temp !== null) temp.lastCount = countOfMessages;
            await user.save();
        }
    }
}

module.exports = { updateOnlineUsers };