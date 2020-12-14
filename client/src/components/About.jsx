import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";


function About() {

    let { username } = useParams();

    return (<div>
        <Navbar 
            name = {username}
            page = "about"
            />

        <div className="container">
            <h1 className="upper-margin"> About Socialites </h1>
            <div className="margin">
                <h5> Welcome to Socialites - A social media web application made by Karthikey Saxena </h5>
            </div>
        </div>
    </div>);
}

export default About;