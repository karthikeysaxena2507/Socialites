import axios from "axios";

const getRoomById = async(id) => {
    const room = await axios.get(`/rooms/get/${id}`);
    return room.data;
} 

const createChat = async(room) => {
    await axios.post("/rooms/chat",{roomId: room});
}

const createChatRoom = async(username) => {
    const roomData = await axios.post("/rooms/create", {username});
    return roomData.data;
}

const joinChatRoom = async(roomId, username) => {
    const roomData = await axios.post("/rooms/join", {roomId, username});
    return roomData.data;
}

export { getRoomById, createChat, createChatRoom, joinChatRoom };