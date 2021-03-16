import axios from "axios";

axios.defaults.withCredentials = true;

// const backendUrl = "https://socialites-karthikey.herokuapp.com/";
const backendUrl = "/";

/**
 * The function to login the user
 * @param {String} email 
 * @param {String} password 
 * @param {boolean} rememberMe 
 */
const loginUser = async(email, password, rememberMe) => {
    const userData = await axios.post(backendUrl + "users/login", {email, password, rememberMe});
    return userData.data.user;
}

/**
 * The function to register new user
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 */
const registerUser = async(username, email, password) => {
    const user = await axios.post(backendUrl + "users/register", {username, email, password});
    return user.data;
}

/**
 * The function to login a user with google
 * @param {String} tokenId 
 */
const LoginWithGoogle = async(tokenId) => {
    const userData = await axios.post(backendUrl + "users/googlelogin", {token: tokenId});
    return userData.data.user;
}

export { loginUser, registerUser, LoginWithGoogle };