import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Heading from "../Heading";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";

const About = () => {

    var [username, setUsername] = useState("");
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    
    useEffect(()=> {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await axios.get("/users/auth",{
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": localStorage.getItem("token")
                        }
                    });
                    setUsername(user.data.username);
                }
                else {
                    setUsername("Guest");
                }
                setLoading(false);
            }
            catch(error) {
                console.log(error);
                localStorage.clear();
                window.location = "/login";
            }
        }
        fetch();
    },[guest]);

    if(loading) {
        return (<div className="text-center upper-margin"> 
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> </span>
    </div>)
    }
    else {
        return (
            <div>
                <Navbar name={username} page = "about" />
                    <Heading />
                    <Container className="about">
                        <div className="mt-3">
                            <h2> About Socialites </h2>
                        </div>
                        <div className="mt-3">
                            <p > Welcome to Socialites - A social media web application. Here Users can: </p>
                                <ul>
                                    <li> Create a Post related to any Category </li>
                                    <li> Edit their Post. </li>
                                    <li> Delete their Post. </li>
                                    <li> View other people posts. </li>
                                    <li> Search through all the posts, their own posts based on different categories. </li>
                                    <li> React to other posts and see which users reacted on which posts. </li>
                                    <li> Comment on their own or other posts, as well react to each comments. </li>
                                    <li> View which users commented on any particluar post and who reacted to any 
                                         comment or any post </li>
                                    <li> Users can also chat with other users, either on a personal chat or in a group chat by 
                                         creating a room </li>
                                    <li> Search for any particular user who has commented and reacted to any post. </li>
                                    <li> Users can start by simply registering on the site locally or with google </li>
                            </ul>
                        </div>
                        <div className="mt-3">
                            <h4> Made By: Karthikey Saxena </h4>
                        </div>
                    </Container>
                <div className="space"></div>
                <Footer />
            </div>);
    }
}

export default About;

