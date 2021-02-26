import React from "react";
import Footer from "../helper/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Heading from "../helper/Heading";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});

const Verified = () => {

    var { token } = useParams();

    const submit = async() => {
        try {
            sound.play();
            const response = await axios.post("/users/verify/", {token});
            (response.data === "INVALID") ?
            alert("You are not a Registered User, Please go to the site and register yourself Or the Email Verification link has expired")
            : window.location = "/login";
        }
        catch(error) {
            console.log(error);
        }
    }

    return <div className="container text-center">
        <Heading />
        <div className="margin"> <button className="btn btn-lg expand" onClick={() => submit()}> Verify Email and Register </button> </div>
        <Footer />
    </div>
}

export default Verified;