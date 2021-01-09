import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Heading from "./Heading";
import InvalidUser from "./InvalidUser";

const About = () => {

    var username = localStorage.getItem("username");
    
    const Check = () => {
        if(username === null) {
            return (
                <InvalidUser />
            )
        }
        else {
            return (<div>
                <Navbar page = "about" />
                <Heading />
                <div className="container about">
                    <div className="margin">
                        <h2 className="margin"> About Socialites </h2>
                    </div>
                    <div className="margin">
                        <p className="margin"> Welcome to Socialites - A social media web application. Here Users can: </p>
                            <ul>
                                <li> Create a Post related to any Category </li>
                                <li> Edit their Post. </li>
                                <li> Delete their Post. </li>
                                <li> View other people posts. </li>
                                <li> Search through all the posts, their own posts based on different categories. </li>
                                <li> React to other posts and see which users reactes on which posts. </li>
                                <li> Comment on their own or other posts, as well react to each comments. </li>
                                <li> View which users commented on any particluar post and which who all users reacted to any 
                                     comment or any post </li>
                                <li> Search for any particular user who has commented and reacted to any post. </li>
                                <li> Users can start by simply registering on the site locally or with google </li>
                            </ul>
                    </div>
                    <div className="margin">
                        <h4 className="margin"> Made By: Karthikey Saxena </h4>
                    </div>
                </div>
                <div className="space"></div>
                <Footer />
            </div>);
        }
    }

    return <Check />;
}

export default About;

