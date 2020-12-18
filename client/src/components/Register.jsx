/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import axios from "axios";
import Footer from "./Footer";

function Register() {

    var [user, setUser] = useState({username:"", email:"", password:""});
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

        axios.post("/users/add", user)
            .then((res) => {
                if(res.data === "Username Already Exists") {
                    setMessage(res.data);
                }
                else {
                    window.location = "/allposts/" + user.username;
                }
            })
            .catch((res) => {
                console.log(res);
            });
    }

    return (<div className="center-text upper-margin">
    <h2> Register Your Account </h2>
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
                    type="email" 
                    name="email" 
                    value={user.email}
                    className="margin" 
                    onChange={change}
                    placeholder="email" 
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
                <input type="submit" className="btn btn-lg expand margin" value="Register"/> 
            </div>
        </form>
        <h3 className="margin"> OR </h3>
        <div className="margin"> <a className="btn btn-lg expand" href="/auth/google"><img src="https://img.icons8.com/color/32/000000/google-logo.png" /> SignUp Using Google </a> </div>
        <Footer />
</div>);
}

export default Register;

