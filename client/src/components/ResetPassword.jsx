import React, { useState } from "react";
import { useParams,useHistory } from "react-router-dom";
import axios from "axios";
import Heading from "./Heading";

const ResetPassword = () => {

    var { username } = useParams();
    var history = useHistory();
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
            const drop = async() => {
                try {
                    const response = await axios.post("/users/reset", password);
                    console.log(response.data);
                    history.push("/login");    
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
            setMessage(" ");
        }
        else {
            setMessage("Above 2 password fields don't match");
        }
    }

    return (<div className="container text-center">
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