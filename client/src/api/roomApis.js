import axios from "axios";

axios.defaults.withCredentials = true;

// let backendUrl = "https://socialites-karthikey.herokuapp.com/";
let backendUrl = "/";

/**
 * The function to get a chat room by id
 * @param {String} id 
 */
let getRoomById = async(id, username) => {
    let room = await axios.get(backendUrl + `rooms/get/${id}/${username}`);
    return room.data;
} 

/**
 * The function to get all the chat room created by a user
 * @param {String} username 
 */
let getRoomsByUser = async(username) => {
    let rooms = await axios.get(backendUrl + `rooms/groups/${username}`);
    return rooms.data;
}

/**
 * The function to get all the chats of a user
 * @param {String} username 
 */
let getChatsByUser = async(username) => {
    let chats = await axios.get(backendUrl + `rooms/chats/${username}`);
    return chats.data;
}

/**
 * The function to create chat between two users
 * @param {String} room 
 */
let createChat = async(room, user1, user2) => {
    await axios.post(backendUrl + "rooms/chat",{roomId: room, user1, user2});
}

/**
 * The function to create a chat room for more than 2 users
 * @param {String} username 
 */
let createChatRoom = async(username, roomName) => {
    let roomData = await axios.post(backendUrl + "rooms/create", {username, roomName});
    return roomData.data;
}

/**
 * The function to join an existing chat room by room Id
 * @param {String} roomId 
 * @param {String} username 
 */
let joinChatRoom = async(roomId, username) => {
    let roomData = await axios.post(backendUrl + "rooms/join", {roomId, username});
    return roomData.data;
}

/**
 * The function to delete a chat room of a user
 * @param {String} id 
 * @param {String} roomId 
 * @param {String} username 
 */
let deleteRoom = async(id, roomId, username) => {
    let rooms = await axios.post(backendUrl + "rooms/delete/room", {username, id, roomId});
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