import React from "react";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import axios from "axios";

function Verified() {

    let { username } = useParams();

    function submit() {
        var user = {name: username};
        axios.post("/users/verify/", user)
            .then(() => {
                window.location = "/allposts/" + username;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return <div className="upper-margin container center-text">
        <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
        <div className="margin"> <button className="btn btn-lg expand" onClick={submit}> Verify Email and Register </button> </div>
        <div className="space"></div>
        <Footer />
    </div>
}

export default Verified;