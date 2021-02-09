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

const updateUserBio = async(user, text) => {
   const userData = await axios.post(`/users/updatebio`,{user, text});
   return userData.data;
}

const updateUserImage = async(body) => {
   await fetch("/users/updateimage", {
      method: "POST",
      body,
      headers: {"Content-type": "application/json"}                
  });
}

export { checkUser, getAllUsers, getUserData, updateUserBio, updateUserImage };