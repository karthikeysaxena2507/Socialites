import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Heading from "../Heading";

const ResetPassword = () => {

    var { username } = useParams();
    var [newPassword, setNewPassword] = useState("");
    var [confirmPassword, setConfirmPassword] = useState("");
    var [message, setMessage] = useState(" ");
    var [correct, setCorrect] = useState(false);

    const check = (e) => {
        setNewPassword(e.target.value);
        if(e.target.value.length >= 8) {
            setCorrect(true);
        }
        else {
            setCorrect(false);
        }
    }

    const reset = () => {
        if(newPassword === confirmPassword && newPassword.length >= 8) {
            const drop = async() => {
                try {
                    const response = await axios.post("/users/reset", {username, newPassword});
                    if(response.data === "INVALID") {
                        alert("You are not a Registered User, Please go to the site and register yourself");
                    }
                    else {
                        console.log(response.data);
                        window.location = "/login";    
                    }
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
                value = {newPassword}
                className = "margin" 
                onChange = {check}
                placeholder = "New Password" 
                autoComplete = "off" 
                required 
            />
        </div>
        <p className="text-danger mt-2 mb-2" style={correct ? {display: "none"} : null}> Password must be at least 8 characters long </p>
        <div>
            <input 
                type = "password" 
                value = {confirmPassword}
                className = "margin" 
                onChange = {(e) => setConfirmPassword(e.target.value)}
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