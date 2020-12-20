import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function About() {

    let { username } = useParams();

    return (<div>
        <Navbar 
            name = {username}
            page = "about"
            />
        <div className="container upper-margin">
            <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
            <h2 className="margin"> About Socialites </h2>
            <div className="margin">
                <h5> Welcome to Socialites - A social media web application made by Karthikey Saxena </h5>
            </div>
        </div>
        <div className="space"></div>
        <Footer />
    </div>);
}

export default About;