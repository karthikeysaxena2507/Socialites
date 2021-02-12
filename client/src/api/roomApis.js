import axios from "axios";

/**
 * The function to get a chat room by id
 * @param {String} id 
 */
const getRoomById = async(id) => {
    const room = await axios.get(`/rooms/get/${id}`);
    return room.data;
} 

/**
 * The function to create chat between two users
 * @param {String} room 
 */
const createChat = async(room) => {
    await axios.post("/rooms/chat",{roomId: room});
}

/**
 * The function to create a chat room for more than 2 users
 * @param {String} username 
 */
const createChatRoom = async(username) => {
    const roomData = await axios.post("/rooms/create", {username});
    return roomData.data;
}

/**
 * The function to join an existing chat room by room Id
 * @param {String} roomId 
 * @param {String} username 
 */
const joinChatRoom = async(roomId, username) => {
    const roomData = await axios.post("/rooms/join", {roomId, username});
    return roomData.data;
}

export { getRoomById, createChat, createChatRoom, joinChatRoom };