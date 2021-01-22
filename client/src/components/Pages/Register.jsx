/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import Heading from "../Heading";
import GoogleLogin from 'react-google-login';

const Register = () => {

    var history = useHistory();
    var [username, setUsername] = useState("");
    var [email, setEmail] = useState("");
    var [password, setPassword] = useState("");
    var [message, setMessage] = useState(" ");
    var [correct, setCorrect] = useState(false);

    const check = (e) => {
        setPassword(e.target.value);
        if(e.target.value.length >= 8) {
            setCorrect(true);
        }
        else {
            setCorrect(false);
        }
    }

    const add = (event) => {
        event.preventDefault();
        if(password.length >= 8) {
            const drop = async() => {
                try {
                    const response = await axios.post("/users/register", {username, email, password});
                    if(response.data === "Username Already Exists" || response.data === "Email already exists") {
                        setMessage(response.data);
                    }
                    else {
                        history.push(`/verify/${response.data.user.token}`);
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


    const guestLogin = () => {
        localStorage.setItem("Guest", true);
    }

    return (<div className="text-center">
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
                 <Link to="/login"> Login here </Link>
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
        <div className="margin">
                <h3> OR </h3>
        </div>
        <Link to="/allposts">
            <div className="mt-1"> <button className="btn btn-lg expand" onClick={guestLogin}> Login as Guest </button> </div>
        </Link>
    <div className="space"></div>
    <Footer />
</div>);
}

export default Register;