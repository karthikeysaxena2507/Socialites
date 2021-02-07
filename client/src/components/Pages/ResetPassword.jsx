import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Heading from "../Heading";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import Loader from "../Loader";
var sound = new Howl({src: [music]});

const ResetPassword = () => {

    var { token } = useParams();
    var [newPassword, setNewPassword] = useState("");
    var [confirmPassword, setConfirmPassword] = useState("");
    var [message, setMessage] = useState(" ");
    var [correct, setCorrect] = useState(false);
    var [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async() => {
            try {
                const response = await axios.get("/users/auth");
                if(response.data !== "INVALID") {
                    setLoading(false);
                    window.location = `/profile/${response.data.username}`;
                }
                setLoading(false);
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[]);

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
        sound.play();
        if(newPassword === confirmPassword && newPassword.length >= 8) {
            const drop = async() => {
                try {
                    const response = await axios.post("/users/reset", {token, newPassword});
                    if(response.data === "INVALID") {
                        alert("You are not a Registered User, Please go to the site and register yourself. Or it is possible that the link to reset password has expired");
                    }
                    else {
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

    if(loading) {
        return <Loader />
    }
    else {
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
}

export default ResetPassword;