import React, { useState, useEffect } from "react";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import Loader from "../helper/Loader";
import { Container} from "react-bootstrap";
import { checkUser } from "../../api/userApis.js";

const About = () => {

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [unread, setUnread] = useState(0);
    const guest = localStorage.getItem("Guest");
    
    useEffect(()=> {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest]);

    return (loading) ? <Loader /> :
    <div>
        <Navbar name={username} page = "about" unread = {unread} />
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
                    <li> Users also have an option to leave chat groups and delete their messages from chats </li>
                    <li> Search option and many filters have been added to provide good user experience. </li>
                    <li> For a quick look, Users can also take a tour of the website by logging in as a guest. </li>
                    <li> They can also check the "remember me" option to login once for 7 days. </li>
                    <li> Users can see which other users are online in a group or a personal chat. </li>
                    <li> Users can see the number of new unread messages in their chats and rooms. </li>
                    <li> Users can see a pie chart based on the different types of reactions and comments on their posts. </li>
                </ul>
        </div>
        <div className="mt-3 text-center">
            <h4> Made By: Karthikey Saxena </h4>
        </div>
        </Container>
        <Footer />
    </div>
}

export default About;

