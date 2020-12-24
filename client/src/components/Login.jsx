/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import Heading from "./Heading";

const Login = () => {

    var [user, setUser] = useState({username:"", password:""});
    var [message, setMessage] = useState(" ");

    const change = (event) => {
        var {name, value} = event.target;

        setUser((prevUser) => {
        return {
          ...prevUser,
          [name]: value
        };
      });
    }

    const add = (event) => {
        event.preventDefault();
        axios.post("/users/", user)
            .then((response) => {
                if(response.data.verified) {
                    window.location = "/allposts/" + user.username;  
                }
                else {
                    window.location = "/verify/" + user.username;  
                }
            })
            .catch(() => {
                setMessage("User Not Found");
            });
    }

    return (<div className="center-text">
        <Heading />
        <h2> Log In to Your Account </h2>
        <form onSubmit={add}>
            <div>
                <input 
                    type="text" 
                    name="username" 
                    value={user.username}
                    className="margin width" 
                    onChange={change}
                    placeholder="Username" 
                    autoComplete="off" 
                    required 
                />
            </div>
            <div>
                <input 
                    type="password" 
                    name="password" 
                    value={user.password}
                    onChange={change}
                    className="margin width" 
                    placeholder="Password" 
                    required 
                />
            </div>
            <div>
                <p className="margin"> {message} </p>
            </div>
            <div>
                <input type="submit" className="btn btn-lg expand margin" value="Log In"/> 
            </div>
            <div className="margin">
                <a href="/register"> Create an account </a>
            </div>
            <div className="margin">
                <a href="/forgot"> Forgot Password </a>
            </div>
            <div className="margin"> <a className="btn btn-lg expand" href="/auth/google"><img src="https://img.icons8.com/color/32/000000/google-logo.png" /> SignIn Using Google </a> </div>
        </form>
        <div className="space"></div>
        <Footer />
</div>);
}

export default Login;

