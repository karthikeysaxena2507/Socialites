import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Heading from "./Heading";

const ResetPassword = () => {

    let { username } = useParams();

    var [password, setPassword] = useState({name: username, new: "", confirm:""});

    var [message, setMessage] = useState(" ");

    const change = (event) => {
        var {name, value} = event.target;
        setPassword((prevPassword) => {
        return {
          ...prevPassword,
          [name]: value
        };
      });
    }

    const reset = () => {
        if(password.new === password.confirm) {
            axios.post("/users/reset", password)
            .then((response) => {
                console.log(response.data);
                window.location = "/login";
            })
            .catch((err) => {
                console.log(err);
            });
            setMessage(" ");
        }
        else {
            setMessage("Above 2 password fields don't match");
        }
    }

    return (<div className="container center-text">
    <Heading />
        <h5 className="margin"> Set New Password </h5>
        <div>
            <input 
                type = "password" 
                name = "new"
                value = {password.new}
                className = "margin" 
                onChange = {change}
                placeholder = "New Password" 
                autoComplete = "off" 
                required 
            />
        </div>
        <div>
            <input 
                type = "password" 
                name = "confirm"
                value = {password.confirm}
                className = "margin" 
                onChange = {change}
                placeholder = "Confirm New Password" 
                autoComplete = "off" 
                required 
            />
        </div>
        <div>
            <p className="margin"> {message} </p>
        </div>
        <div className="margin"><button className="btn btn-lg expand margin" onClick={reset}> Set Password </button> </div>
    </div>);
}

export default ResetPassword;