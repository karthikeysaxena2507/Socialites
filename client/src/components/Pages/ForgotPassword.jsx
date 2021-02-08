import axios from "axios";
import React, { useState, useEffect } from "react";
import Heading from "../helper/Heading";
import { Howl } from "howler";
import Loader from "../helper/Loader";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis"
var sound = new Howl({src: [music]});

const ForgotPassword = () => {

    var [email, setEmail] = useState("");
    var [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async() => {
            try {
                const user = await checkUser();
                setLoading(false);
                if(user !== "INVALID") {
                    window.location = `/profile/${user.username}`;
                }
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[]);

    const reset = () => {
        sound.play();
        const drop = async() => {
            try {
                const response = await axios.post("/users/forgot", {email});
                alert(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
    }

    if(loading) {
        return <Loader />
    }
    else {
        return (<div className="container text-center">
        <Heading />
        <h5 className="margin"> Enter your registered email to reset password </h5>
        <input 
                    type="email" 
                    value={email}
                    className="margin" 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email" 
                    autoComplete="off" 
                    required 
                />
        <div className="margin"><button className="btn btn-lg expand margin" onClick={reset}> Send </button> </div>
    </div>);
    }
}

export default ForgotPassword;