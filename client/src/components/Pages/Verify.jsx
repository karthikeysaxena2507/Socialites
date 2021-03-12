import React from "react";
import Footer from "../helper/Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import Heading from "../helper/Heading";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});

const Verify = () => {

    let { token } = useParams();

    const send = async() => {
        try {
            sound.play();
            const response = await axios.post("https://socialites-karthikey.herokuapp.com/users/send", {token});
            (response.data === "INVALID") ?
            alert("You are not a Registered User, Please go to the site and register yourself")
            : alert("Link sent to email")
        }
        catch(error) {
            console.log(error);
        }
    }
    
    return (<div className="container text-center">
        <Heading />
        <h3 className="margin">A verification link has been sent to your registered Email, please follow that link to verify your email and register your account </h3>
        <h5> To resend the link, <span onClick={() => send()} className="send expand"> click here </span> </h5>
        <Footer />
    </div>);
}

export default Verify;