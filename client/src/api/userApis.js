import axios from "axios";

axios.defaults.withCredentials = true;

// let backendUrl = "https://socialites-karthikey.herokuapp.com/";
let backendUrl = "https://socialites-24x7.herokuapp.com/";
// let backendUrl = "/";

/**
 * The function to check the authentication status of a user
 */
var checkUser = async() => {
   let user = await axios.get(backendUrl + "users/auth");
   return user.data;
}

/**
 * The function to get all the users
 */ 
let getAllUsers = async() => {
   let users = await axios.get(backendUrl + `users/get`);
   return users.data;
}

/**
 * The function to get all data of a user
 * @param {String} username 
 */
let getUserData = async(username) => {
   let userData = await axios.get(backendUrl + `users/find/${username}`);
   return userData.data;
}

/**
 * The function to update the profile bio of user
 * @param {String} user 
 * @param {String} text 
 */
let updateUserBio = async(user, text) => {
   let userData = await axios.post(backendUrl + `users/updatebio`,{user, text});
   return userData.data;
}

/**
 * The function to update the profile image of a user
 * @param {Object} body 
 */
let updateUserImage = async(body, options) => {
   await axios.post(backendUrl + "users/updateimage", body, options);
}

export { checkUser, getAllUsers, getUserData, updateUserBio, updateUserImage };