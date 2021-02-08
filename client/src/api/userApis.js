import axios from "axios";

var checkUser = async() => {
   const user = await axios.get("/users/auth");
   return user.data;
}
 
const getAllUsers = async() => {
   const users = await axios.get(`/users/get`);
   return users.data;
}

const getUserData = async(username) => {
   const userData = await axios.get(`/users/find/${username}`);
   return userData.data;
}

export {  checkUser, getAllUsers, getUserData };