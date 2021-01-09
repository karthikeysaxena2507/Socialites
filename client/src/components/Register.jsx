/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Heading from "./Heading";

const Register = () => {

    var history = useHistory();
    var [userDetails, setuserDetails] = useState({username:"", email:"", password:""});
    var [message, setMessage] = useState(" ");

    const change = (event) => {
        var {name, value} = event.target;

        setuserDetails((prevUser) => {
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
                const response = await axios.post("/users/add", userDetails);
                if(response.data === "Username Already Exists") {
                    setMessage(response.data);
                }
                else if(response.data === "Account with given Email Already Exists") {
                    setMessage(response.data);
                }
                else {
                    history.push(`/verify/${userDetails.email}`);
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
    }

    return (<div className="center-text">
    <Heading />
    <h2> Register Your Account </h2>
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
                    type="email" 
                    name="email" 
                    value={userDetails.email}
                    className="margin width" 
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
                    value={userDetails.password}
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
        <div className="margin"> <a className="btn btn-lg expand" href="/auth/google"><img src="https://img.icons8.com/color/32/000000/google-logo.png" /> SignUp Using Google </a> </div>
    <div className="space"></div>
    <Footer />
</div>);
}

export default Register;

