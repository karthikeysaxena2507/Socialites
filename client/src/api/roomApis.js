import axios from "axios";

const getRoomById = async(id) => {
    const room = await axios.get(`/rooms/get/${id}`);
    return room.data;
} 

export { getRoomById };