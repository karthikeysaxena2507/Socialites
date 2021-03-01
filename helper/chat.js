const User = require("../models/user.model");
const Chat = require("../models/chat.model");

const updateOnlineUsers = async(roomId, countOfMessages, isGroup) => {
    const onlineUsers = await Chat.find({room: roomId});
    for (let tempUser of onlineUsers) {
        const user = await User.findOne({username: tempUser.name});
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