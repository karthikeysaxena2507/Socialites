import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import Footer from "./Footer";
import Heading from "./Heading";
import ReactEmoji from 'react-emoji';
import ScrollToBottom from "react-scroll-to-bottom";

const Room = () => {

    const username = localStorage.getItem("username");
    const roomId = localStorage.getItem("roomId");
    var [creator, setCreator] = useState("");
    var [message, setMessage] = useState("");
    var [messages,setMessages] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            try {
                const response = await axios.get(`/rooms/get/${roomId}`);
                setMessages(response.data.messages);
                setCreator(response.data.users[0].name);
                console.log(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[roomId]);
    
    const sendMessage = (e) => {
        e.preventDefault();
        if(username === null || username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            console.log(message);
            const drop = async() => {
                try {
                    const response = await axios.post("/rooms/add", {roomId, username, message});
                    console.log(response.data); 
                    setMessages(response.data.messages);
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
            setMessage("");
        }
    }

    const createMessage = (props, index) => {
        if(props.username === username) {
            return (
            <div key={index}>
                <div className="messageContainer justifyEnd">
                    <div className="sentText pr-10">{username}</div>
                    <div className="messageBox backgroundBlue">
                        <p className="messageText colorWhite"> {ReactEmoji.emojify(props.content)} </p>
                    </div>
                </div>
            </div>);
        }
        else {
            return (
            <div key={index}>
                <div className="messageContainer justifyStart">
                    <div className="messageBox backgroundLight">
                        <p className="messageText colorLight"> {ReactEmoji.emojify(props.content)} </p>
                    </div>
                    <p className="sentText pl-10">{props.username}</p>
                </div>
            </div>);
        }
    }

    return (
    <div>
        <Navbar page = "allusers"/>
        <Heading />
        <div className="text-center"> 
            <h5 className="margin"> Room ID: {roomId} </h5>
            <h5 className="margin"> Room Creator: {creator} </h5> 
        </div>
        <div className="outerContainer">
            <div className="innerContainer">
            <ScrollToBottom className="messages">
                {messages.map(createMessage)}
            </ScrollToBottom>
            <form className="form">
                <input
                    className="input"
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => {setMessage(e.target.value)}}
                    onKeyPress={event => event.key === "Enter" ? sendMessage(event) : null}
                />
                <button type="submit" className="sendButton" onClick={e => sendMessage(e)}> SEND </button>
            </form>
            </div>
        </div>
        <div className="space"></div>
        <Footer />
    </div>
    )
}

export default Room;