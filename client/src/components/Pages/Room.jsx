import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Navbar from "../Navbar";
import Footer from "../Footer";
import Heading from "../Heading";
import ReactEmoji from 'react-emoji';
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import { Spinner } from "react-bootstrap";
import { useParams } from 'react-router-dom';
const ENDPOINT = "https://socialites-karthikey.herokuapp.com/";

const Room = () => {

    var socket = useRef(null);
    var { roomId } = useParams();
    var [username, setUsername] = useState("");
    var [message, setMessage] = useState("");
    var [messages,setMessages] = useState([]);
    var [loading, setLoading] = useState(true);
    // var [state, setState] = useState("Show");
    // var [users, setUsers] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            try {
                const user = await axios.get("/users/auth",{
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token")
                    }
                });
                setUsername(user.data.username);
                const response = await axios.get(`/rooms/get/${roomId}`);
                setLoading(false);
                setMessages(response.data.messages);
                socket.current = io(ENDPOINT);
                socket.current.emit("join", {name: user.data.username, room: roomId}, () => {});
                socket.current.on("message", (data) => {
                    setMessages((prev) => {return [...prev, data]});
                });
                socket.current.on("users", (data) => {
                    console.log(data);
                })
                return () => {
                    socket.current.emit("disconnect");
                    socket.current.off();
                }
            }
            catch(error) {
                console.log(error);
                localStorage.clear();
                window.location = "/login";
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
            if(message) {
                socket.current.emit("sendmessage", {message, name: username, room: roomId}, () => {});
                setMessage("");
            }
        }
    }

    const createMessage = (props, index) => {
        if(props.name === username) {
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
                    <p className="sentText pl-10">{props.name}</p>
                </div>
            </div>);
        }
    }

    // const changeState = () => {
    //     if(state === "Show") setState("Hide");
    //     else setState("Show");
    // }

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
            <Navbar name={username} page = "allusers"/>
            <Heading />
            <div className="text-center"> 
                <h5 className="margin"> Room ID: {roomId} </h5>
                {/* <button className="btn" onClick={changeState}> {state} Users in Room </button> */}
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
        </div>);
    }
}

export default Room;