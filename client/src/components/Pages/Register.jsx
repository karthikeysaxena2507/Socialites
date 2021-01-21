/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import Heading from "../Heading";

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

    const guestLogin = () => {
        localStorage.setItem("username", "Guest");
        history.push(`/allposts`);
    }

    const add = (event) => {
        event.preventDefault();
        if(password.length >=8) {
            const drop = async() => {
                try {
                    const response = await axios.post("/users/add", {username, email, password});
                    if(response.data === "Username Already Exists" || response.data === "Email already exists") {
                        setMessage(response.data);
                    }
                    else {
                        history.push(`/verify/${response.data.username}`);
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
        {/* <div className="margin">
            <h3> OR </h3>
        </div>
        <div className="margin"> <a className="btn btn-lg expand" href="/auth/google"><img src="https://img.icons8.com/color/32/000000/google-logo.png" /> SignUp Using Google </a> </div>
        <div className="margin">
                <h3> OR </h3>
        </div>
        <Link to="/allposts">
            <div className="mt-1"> <button className="btn btn-lg expand" onClick={guestLogin}> Login as Guest </button> </div>
        </Link> */}
    <div className="space"></div>
    <Footer />
</div>);
}

export default Register;