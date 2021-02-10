import axios from "axios";

const loginUser = async(email, password, rememberMe) => {
    const userData = await axios.post("/users/login", {email, password, rememberMe});
    return userData.data.user;
}

const registerUser = async(username, email, password) => {
    const user = await axios.post("/users/register", {username, email, password});
    return user.data;
}

const LoginWithGoogle = async(tokenId) => {
    const userData = await axios.post("/users/googlelogin", {token: tokenId});
    return userData.data.user;
}

export { loginUser, registerUser, LoginWithGoogle };