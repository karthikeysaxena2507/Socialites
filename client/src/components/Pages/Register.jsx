/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import GoogleLogin from 'react-google-login';
import { Howl } from "howler";
import Loader from "../helper/Loader";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis";
import { registerUser, LoginWithGoogle } from "../../api/authApis";
var sound = new Howl({src: [music]});

let Register = () => {

    let [username, setUsername] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [message, setMessage] = useState(" ");
    let [correct, setCorrect] = useState(false);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        let check = async() => {
            try {
                let user = await checkUser();
                setLoading(false);
                (user !== "INVALID") && (window.location = `/profile/${user.username}`)
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[]);

    let check = (e) => {
        setPassword(e.target.value);
        (e.target.value.length >= 8) ? setCorrect(true) : setCorrect(false)
    }

    let add = (event) => {
        event.preventDefault();
        sound.play();
        if(password.length >= 8) {
            let drop = async() => {
                try {
                    let response = await registerUser(username, email, password);
                    if(response === "Username Already Exists" || response === "Email already exists") {
                        setMessage(response);
                    }
                    else {
                        window.location = `/verify/${response.user.token}`;
                        setMessage("");
                    }
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    let successGoogle = (response) => {
        let post = async() => {
            try {
                let user = await LoginWithGoogle(response.tokenId);
                localStorage.removeItem("Guest");
                window.location = `/profile/${user.username}`;
            }
            catch(error) {
                console.log(error);
            }
        }
        post();
    }

    let failureGoogle = () => {
        setMessage("Google Login Failed");
        window.location = "/";
    }

    let guestLogin = () => {
        sound.play();
        localStorage.setItem("Guest", true);
    }

    return (loading) ? <Loader /> :
    <div className="text-center">
        <Heading />
        <h2> Register Your Account </h2>
            <form onSubmit={add}>
                <div>
                    <input 
                        type="text" 
                        name="username" 
                        value={username}
                        className="margin width" 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username" 
                        autoComplete="off" 
                        required 
                    />
                </div>
                <div>
                    <input 
                        type="email" 
                        name="email" 
                        value={email}
                        className="margin width" 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email" 
                        autoComplete="off" 
                        required 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        name="password" 
                        value={password}
                        onChange={check}
                        className="margin width" 
                        placeholder="Password" 
                        required 
                    />
                </div>
                <p className="text-danger" style={correct ? {display: "none"} : null}> Password must be at least 8 characters long </p>
                <div>
                    <p className="margin"> {message} </p>
                </div>
                <div>
                    <input type="submit" className="btn btn-lg expand margin" value="Register"/> 
                </div>
                <div className="margin">
                    Already have an account ? 
                    <Link to="/login" onClick={() => sound.play()}> Login here </Link>
                </div>
            </form>
            <div className="margin">
                <h3> OR </h3>
            </div>
            <GoogleLogin
                    clientId="632402415694-9ecqnttq28h5hola3u415aq1ltpiq30c.apps.googleusercontent.com"
                    buttonText="Login With Google"
                    onSuccess={successGoogle}
                    onFailure={failureGoogle}
                    className="btn btn-lg expand"
                    cookiePolicy={'single_host_origin'}
            />
            <Link to="/allposts">
                <span className="mt-1"> <button className="btn btn-lg expand" onClick={guestLogin}> Login as Guest </button> </span>
            </Link>
        <Footer />
    </div>
}

export default Register;