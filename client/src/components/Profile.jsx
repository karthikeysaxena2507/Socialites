import React from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Heading from "./Heading";

const Profile = () => {
    let { username } = useParams();
    return (<div>
    <Navbar 
            name = {username}
            page = "profile"
    />
    <Heading />
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