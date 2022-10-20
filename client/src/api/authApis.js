import axios from "axios";

axios.defaults.withCredentials = true;

// let backendUrl = "https://socialites-karthikey.herokuapp.com/";
let backendUrl = "https://socialites-24x7.herokuapp.com/";
// let backendUrl = "/";

/**
 * The function to login the user
 * @param {String} email 
 * @param {String} password 
 * @param {boolean} rememberMe 
 */
let loginUser = async(email, password, rememberMe) => {
    let userData = await axios.post(backendUrl + "users/login", {email, password, rememberMe});
    return userData.data.user;
}

/**
 * The function to register new user
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 */
let registerUser = async(username, email, password) => {
    let user = await axios.post(backendUrl + "users/register", {username, email, password});
    return user.data;
}

/**
 * The function to login a user with google
 * @param {String} tokenId 
 */
let LoginWithGoogle = async(tokenId) => {
    let userData = await axios.post(backendUrl + "users/googlelogin", {token: tokenId});
    return userData.data.user;
}

export { loginUser, registerUser, LoginWithGoogle };