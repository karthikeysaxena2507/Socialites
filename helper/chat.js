const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Room = require("../models/room.model");

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

const updateOfflineUsers = async(roomId, messageNumber, isGroup) => {
    const onlineUsers = await Chat.find({room: roomId});
    const room = await Room.findOne({roomId}).select(["users"]);
    const allUsers = room.users;
    for(let user of allUsers)
    {
        let userIndex = onlineUsers.findIndex((item) => (item.name == user.name));
        if(userIndex === (-1))
        {
            const currentUser = await User.findOne({username: user.name});
            if(isGroup) 
            {
                let temp = null;
                for (let item of currentUser.rooms) 
                {
                    if(item.roomId === roomId) 
                    {
                        temp = item;
                        break;
                    }
                }
                if(temp !== null) 
                {
                    if(temp.lastCount >= messageNumber) temp.lastCount--;
                }
                await user.save();
            }
            else 
            {
                let temp = null;
                for (let item of currentUser.chats) 
                {
                    if(item.roomId === roomId) 
                    {
                        temp = item;
                        break;
                    }
                }
                if(temp !== null) 
                {
                    if(temp.lastCount >= messageNumber) temp.lastCount--;
                }
                await user.save();
            }
        }
    }
}

module.exports = { updateOnlineUsers, updateOfflineUsers };