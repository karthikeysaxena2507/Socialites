/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import axios from "axios";
import Footer from "./Footer";

function Login() {

    var [user, setUser] = useState({username:"", password:""});
    var [message, setMessage] = useState(" ");

    function change(event) {
        var {name, value} = event.target;

        setUser((prevUser) => {
        return {
          ...prevUser,
          [name]: value
        };
      });
    }

    function add(event) {
        event.preventDefault();

        axios.post("/users/", user)
            .then(() => {
                window.location = "/allposts/" + user.username;
            })
            .catch(() => {
                setMessage("User Not Found");
            });
    }

    return (<div className="center-text upper-margin">
        <h2> Log In to Your Account </h2>
        <form onSubmit={add}>
            <div>
                <input 
                    type="text" 
                    name="username" 
                    value={user.username}
                    className="margin" 
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
                    className="margin" 
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
            <div className="margin"> <a className="btn btn-lg expand" href="/auth/google"><img src="https://img.icons8.com/color/32/000000/google-logo.png" /> SignIn Using Google </a> </div>
        </form>
        <Footer />
</div>);
}

export default Login;

