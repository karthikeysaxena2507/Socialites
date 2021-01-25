/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import axios from "axios";
import Footer from "../Footer";
import Heading from "../Heading";
import { Link,useHistory } from "react-router-dom";
import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});


const Login = () => {

    let history = useHistory();

    var [email, setEmail] = useState("");
    var [password, setPassword] = useState("");
    var [message, setMessage] = useState(" ");
    var [rememberMe, setRememberMe] = useState(false);

    const add = (event) => {
        event.preventDefault();
        sound.play();
        const drop = async() => {
            try {
                const response = await axios.post("/users/login", {email, password});
                setMessage(" ");
                if(rememberMe) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.removeItem("Guest");
                }
                else {
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.removeItem("Guest");
                }
                if(response.data.user.verified) {
                    history.push(`/profile/${response.data.user.username}`);
                }
                else {
                    history.push(`/verify/${response.data.user.token}`);  
                }
            }
            catch(error) {
                console.log(error);
                setMessage("User Not Found");
            } 
        }
        drop();
    }

    const guestLogin = () => {
        sound.play();
        localStorage.setItem("Guest", true);
    }

    const successGoogle = (response) => {
        const post = async() => {
            try {
                const userData = await axios.post("/users/googlelogin", {token: response.tokenId});
                localStorage.setItem("token", userData.data.token);
                localStorage.removeItem("Guest");
                history.push(`/profile/${userData.data.user.username}`);
            }
            catch(error) {
                console.log(error);
            }
        }
        post();
    }

    const failureGoogle = () => {
        setMessage("Google Login Failed");
        window.location = "/";
    }

    return (<div className="text-center">
        <Heading />
        <h2> Login to Your Account </h2>
        <form onSubmit={add}>
            <div>
                <input 
                    type="email" 
                    value={email}
                    className="margin width" 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email" 
                    autoComplete="off" 
                    required 
                />
            </div>
            <div>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="margin width" 
                    placeholder="Password" 
                    required 
                />
            </div>
            <div className="margin">
                <p className="margin"> {message} </p>
            </div>
            <div className="margin">
                <input type="checkbox" onChange={() => {setRememberMe(!rememberMe); sound.play();}} className="mr-2"/> Remember Me
            </div>
            <div className="margin">
                <input type="submit" className="btn btn-lg expand margin" value="Login"/> 
            </div>
        </form>
            <div className="margin">
                New User ? 
                <Link to="/register" onClick={() => sound.play()}> Create a New account </Link>
            </div>
            <div className="margin">
                <Link to="/forgot" onClick={() => sound.play()}> Forgot Password </Link>
            </div>
            <div className="margin">
                <h3> OR </h3>
            </div>
            <div>
                <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    buttonText="Login With Google"
                    onSuccess={successGoogle}
                    onFailure={failureGoogle}
                    className="btn google"
                    cookiePolicy={'single_host_origin'}
                />
                <Link to="/allposts">
                <span className="mt-1"> <button className="btn btn-lg expand" onClick={guestLogin}> Login as Guest </button> </span>
                </Link>
            </div>
        <div className="space"></div>
        <Footer />
</div>);
}

export default Login;