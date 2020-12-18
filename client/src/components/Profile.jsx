import React from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import Footer from "./Footer";

function Profile() {
    let { username } = useParams();
    return (<div>
        Profile of {username}
        (page is not yet complete)
        <Footer />
    </div>);
}

export default Profile;