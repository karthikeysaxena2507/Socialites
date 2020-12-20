import React from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Profile() {
    let { username } = useParams();
    return (<div>
    <Navbar 
            name = {username}
            page = "profile"
    />
    <div className="center-text upper-margin"> <h1 className="main"> Socialites </h1> </div>
    <div className="container center-text margin">
        Profile of {username}
        <br />
        (page is not yet complete)
        <div className="space"></div>
        <Footer />
    </div>
    </div>);
}

export default Profile;