/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import { Link } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import { Howl } from "howler";
import Loader from "../helper/Loader";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis"
import { loginUser, LoginWithGoogle } from "../../api/authApis";
var sound = new Howl({src: [music]});

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(" ");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async() => {
            try {
                const user = await checkUser();
                (user !== "INVALID") && (window.location = `/profile/${user.username}`);
                setLoading(false);
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[]);

    const add = (event) => {
        event.preventDefault();
        sound.play();
        const drop = async() => {
            try {
                const user = await loginUser(email, password, rememberMe);
                localStorage.removeItem("Guest");
                setMessage(" ");
                (user.verified) ? window.location = `/profile/${user.username}` : window.location = `/verify/${user.token}`;
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
                const user = await LoginWithGoogle(response.tokenId);
                localStorage.removeItem("Guest");
                window.location = `/profile/${user.username}`;
            }
            catch(error) {
                console.log(error);
            }
        }
        post();
    }

    const failureGoogle = () => {
        setMessage("Google Login Failed");
    }

    return (loading) ? <Loader /> :
    <div className="text-center">
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
        <Footer />
    </div>
}

export default Login;