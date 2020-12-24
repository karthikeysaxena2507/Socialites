import React from "react";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Heading from "./Heading";

const Verified = () => {

    let { username } = useParams();

    const submit = () => {
        var user = {name: username};
        axios.post("/users/verify/", user)
            .then(() => {
                window.location = "/allposts/" + username;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return <div className="container center-text">
        <Heading />
        <div className="margin"> <button className="btn btn-lg expand" onClick={submit}> Verify Email and Register </button> </div>
        <div className="space"></div>
        <Footer />
    </div>
}

export default Verified;