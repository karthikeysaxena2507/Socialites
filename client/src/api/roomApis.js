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
 * The function to get all the chat room created by a user
 * @param {String} username 
 */
const getRoomsByUser = async(username) => {
    const rooms = await axios.get(`/rooms/groups/${username}`);
    return rooms.data;
}

/**
 * The function to get all the chats of a user
 * @param {String} username 
 */
const getChatsByUser = async(username) => {
    const chats = await axios.get(`/rooms/chats/${username}`);
    return chats.data;
}

/**
 * The function to create chat between two users
 * @param {String} room 
 */
const createChat = async(room, user1, user2) => {
    await axios.post("/rooms/chat",{roomId: room, user1, user2});
}

/**
 * The function to create a chat room for more than 2 users
 * @param {String} username 
 */
const createChatRoom = async(username, roomName) => {
    const roomData = await axios.post("/rooms/create", {username, roomName});
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

/**
 * The function to delete a chat room of a user
 * @param {String} id 
 * @param {String} roomId 
 * @param {String} username 
 */
const deleteRoom = async(id, roomId, username) => {
    const rooms = await axios.post("/rooms/delete/room", {username, id, roomId});
    return rooms.data;
}

export { 
    getRoomById, 
    createChat, 
    createChatRoom, 
    joinChatRoom, 
    getRoomsByUser, 
    getChatsByUser,
    deleteRoom
};