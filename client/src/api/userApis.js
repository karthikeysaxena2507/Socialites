import axios from "axios";

axios.defaults.withCredentials = true;

// const backendUrl = "https://socialites-karthikey.herokuapp.com/";
const backendUrl = "/";

/**
 * The function to check the authentication status of a user
 */
var checkUser = async() => {
   const user = await axios.get(backendUrl + "users/auth");
   return user.data;
}

/**
 * The function to get all the users
 */ 
const getAllUsers = async() => {
   const users = await axios.get(backendUrl + `users/get`);
   return users.data;
}

/**
 * The function to get all data of a user
 * @param {String} username 
 */
const getUserData = async(username) => {
   const userData = await axios.get(backendUrl + `users/find/${username}`);
   return userData.data;
}

/**
 * The function to update the profile bio of user
 * @param {String} user 
 * @param {String} text 
 */
const updateUserBio = async(user, text) => {
   const userData = await axios.post(backendUrl + `users/updatebio`,{user, text});
   return userData.data;
}

/**
 * The function to update the profile image of a user
 * @param {Object} body 
 */
const updateUserImage = async(body) => {
   await fetch(backendUrl + "users/updateimage", {
      method: "POST",
      body,
      headers: {"Content-type": "application/json"}                
  });
}

export { checkUser, getAllUsers, getUserData, updateUserBio, updateUserImage };