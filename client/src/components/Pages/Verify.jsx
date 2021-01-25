import React from "react";
import Footer from "../Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import Heading from "../Heading";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});

const Verify = () => {

    let { token } = useParams();

    const send = () => {
        sound.play();
        const drop = async() => {
            try {
                const response = await axios.post("/users/send", {token});
                if(response.data === "INVALID") {
                    alert("You are not a Registered User, Please go to the site and register yourself");
                }
                else {
                    console.log(response.data);
                    alert("Link sent to email");
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
        alert("Link sent to email");
    }
    
    return (<div className="container text-center">
        <Heading />
        <h3 className="margin">A verification link has been sent to your registered Email, please follow that link to verify your email and register your account </h3>
        <h5> To resend the link, <span onClick={send} className="send expand"> click here </span> </h5>
        <div className="space"></div>
        <Footer />
    </div>);
}

export default Verify;