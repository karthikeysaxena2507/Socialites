import React from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Heading from "./Heading";

const Profile = () => {
    let { user,username } = useParams();

    

    var profile = (user === username) ? ("profile") : ("null");
    return (<div>
    <Navbar 
            name = {username}
            page = {profile}
    />
    <Heading />
    <div className="container center-text margin">
        Profile of {user}
        <br />
        (page is not yet complete)
        <div className="space"></div>
        <Footer />
    </div>
    </div>);
}

export default Profile;