import React from "react";
import Footer from "./Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import Heading from "./Heading";

const Verify = () => {

    let { username } = useParams();

    const send = () => {
        var user = {name: username};
        axios.post("/users/send", user)
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
            alert("Link sent to email");
    }

    return <div className="container center-text">
        <Heading />
        <h3 className="margin">A verification link has been sent to your registered Email, please follow that link to verify your email and register your account </h3>
        <h5> To resend the link, <span onClick={send} className="send expand"> click here </span> </h5>
        <div className="space"></div>
        <Footer />
    </div>
}

export default Verify;