import axios from "axios";
import React, { useState, useEffect } from "react";
import Heading from "../helper/Heading";
import { Howl } from "howler";
import Loader from "../helper/Loader";
import music from "../../sounds/button.mp3";
import Footer from "../helper/Footer";
import { checkUser } from "../../api/userApis"
var sound = new Howl({src: [music]});

let ForgotPassword = () => {

    let [email, setEmail] = useState("");
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        let check = async() => {
            try {
                let user = await checkUser();
                setLoading(false);
                (user !== "INVALID") && (window.location = `/profile/${user.username}`)
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[]);

    let reset = async() => {
        try {
            sound.play();
            let response = await axios.post("users/forgot", {email});
            alert(response.data);
        }
        catch(error) {
            console.log(error);
        }
    }

    return (loading) ? <Loader /> :
    <div className="container text-center">
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
        <div className="margin">
            <button 
                className="btn btn-lg expand margin" 
                onClick={() => reset()}> 
                Send 
            </button> 
        </div>
        <Footer />
    </div>
}

export default ForgotPassword;