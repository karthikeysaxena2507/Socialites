/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import Heading from "./Heading";
import { Link,useHistory } from "react-router-dom";

const Login = (props) => {

    let history = useHistory();

    var [userDetails, setUserDetails] = useState({username:"", password:""});
    var [message, setMessage] = useState(" ");

    const change = (event) => {
        var {name, value} = event.target;
        setUserDetails((prevUser) => {
        return {
          ...prevUser,
          [name]: value
        };
      });
    }

    const add = (event) => {
        event.preventDefault();
        const drop = async() => {
            try {
                const response = await axios.post("/users/", userDetails);
                localStorage.setItem("username", response.data.user.username);
                // localStorage.setItem("token", response.data.token);
                if(response.data.user.verified) {
                    history.push(`/allposts`);
                }
                else {
                    history.push(`/verify/${userDetails.username}`);  
                }
                setMessage("");
            }
            catch(error) {
                console.log(error);
                setMessage("User Not Found");
            } 
        }
        drop();
    }

    return (<div className="center-text">
        <Heading />
        <h2> Log In to Your Account </h2>
        <form onSubmit={add}>
            <div>
                <input 
                    type="text" 
                    name="username" 
                    value={userDetails.username}
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
                    value={userDetails.password}
                    onChange={change}
                    className="margin width" 
                    placeholder="Password" 
                    required 
                />
            </div>
            <div className="margin">
                <p className="margin"> {message} </p>
            </div>
            <div className="margin">
            </div>
            <div className="margin">
                <input type="submit" className="btn btn-lg expand margin" value="Log In"/> 
            </div>
        </form>
            <div className="margin">
                New User ? 
                <Link to="/register"> Create a New account </Link>
            </div>
            <div className="margin">
                <Link to="/forgot"> Forgot Password </Link>
            </div>
            <div className="margin">
                <h3> OR </h3>
            </div>
            <div className="margin"> <a className="btn btn-lg expand" href="/auth/google"><img src="https://img.icons8.com/color/32/000000/google-logo.png" /> SignIn Using Google </a> </div>
        <div className="space"></div>
        <Footer />
</div>);
}

export default Login;

