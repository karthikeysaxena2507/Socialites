import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Heading from "../Heading";
import axios from "axios";
import { Container} from "react-bootstrap";
import Loader from "../Loader";

const About = () => {

    var [username, setUsername] = useState("");
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    
    useEffect(()=> {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await axios.get("/users/auth");
                    if(user.data === "INVALID") {
                        window.location = "/login";
                    }
                    else {
                        setUsername(user.data.username);
                    }
                }
                else {
                    setUsername("Guest");
                }
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest]);

    if(loading) {
        return <Loader />
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
                            <p > Welcome to Socialites - A social media website. </p>
                                <ul>
                                    <li> Users first have to register themselves to the site using their email and verify that email or they can quickly login using Google. </li>
                                    <li> Users can create a post with/without an image related to any category. </li>
                                    <li> Users can also edit and delete their posts. </li>
                                    <li> Users can comment and react on posts. </li>
                                    <li> Users can see which users commented and reacted on which posts. </li>
                                    <li> The posts can be filtered based on category or any content searched by the user. </li>
                                    <li> Users can customize their profile page as they want by adding a profile picture and writing a suitable Bio. </li>
                                    <li> Users can also chat with other users in real time, either personally or by creating a room and sharing that roomID. </li>
                                    <li> Search option and many filters have been added to provide good user experience. </li>
                                    <li> For a quick look, Users can also take a tour of the website by logging in as a guest. They can also check the "remember me" option to login once for 10 days. </li>
                                </ul>
                        </div>
                        <div className="mt-3 text-center">
                            <h4> Made By: Karthikey Saxena </h4>
                        </div>
                    </Container>
                <div className="space"></div>
                <Footer />
            </div>);
    }
}

export default About;

