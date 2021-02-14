import React, { useEffect, useRef, useState } from 'react'
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import Loader from "../helper/Loader";
import { useParams } from 'react-router-dom';
import { Howl } from "howler";
import button from "../../sounds/button.mp3";
import newMessage from "../../sounds/message.mp3";
import { checkUser } from "../../api/userApis"
import { getRoomById } from "../../api/roomApis";
import { time } from "../../utils/Date";
var buttonSound = new Howl({src: [button]});
var messageSound = new Howl({src: [newMessage]});
const ENDPOINT = "https://socialites-karthikey.herokuapp.com/";
// const ENDPOINT = "http://localhost:5000/";

const Room = () => {

    var socket = useRef(null);
    var { roomId } = useParams();
    var [roomName, setRoomName] = useState("");
    var [creator, setCreator] = useState("");
    var [isGroup, setIsGroup] = useState(false);
    var [username, setUsername] = useState("");
    var [message, setMessage] = useState("");
    var [messages,setMessages] = useState([]);
    var [loading, setLoading] = useState(true);
    var [onlineUsers, setOnlineUsers] = useState([]);
    var [allUsers, setAllUsers] = useState([]);
    var [state, setState] = useState("Show");

    useEffect(() => 
    {
        const fetch = async() => 
        {
            try {
                const user = await checkUser();
                (user === "INVALID") ? window.location = "/login" : setUsername(user.username);
                const room = await getRoomById(roomId);
                setAllUsers(room.users);
                setRoomName(room.roomName);
                setCreator(room.creator);
                setIsGroup(room.isGroup);
                setLoading(false);
                setMessages(room.messages);
                socket.current = io(ENDPOINT);
                socket.current.emit("join", {name: user.username, room: roomId}, () => {});
                socket.current.on("message", (data) => {
                    messageSound.play();
                    setMessages((prev) => {return [...prev, data]});
                });
                socket.current.on("users", (data) => {
                    setOnlineUsers(data.chat);
                });
                return () => {
                    socket.current.emit("disconnect");
                    socket.current.off();
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[roomId]);
    
    const sendMessage = (e) => 
    {
        e.preventDefault();
        if(username === null || username === "Guest") 
        {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else 
        {
            if(message) 
            {
                socket.current.emit("sendmessage", {message, name: username, room: roomId, time: time()}, () => {});
                setMessage("");
            }
        }
    }

    const createMessage = (props, index) => 
    {
        if(props.name === username) {
            return (
            <div key={index}>
                <div className="messageContainer justifyEnd mt-3">
                    <div>
                        <div className="text-right"> {username} </div>
                        <div className="text-right">
                            <div className="messageBox backgroundOrange">
                                <p className="messageText text-white"> {props.content} </p>
                            </div>
                        </div>
                        <div className="text-right"> {props.time} </div>
                    </div>
                </div>
            </div>);
        }
        else {
            return (
            <div key={index}>
                <div className="messageContainer justifyStart mt-3">
                <div>
                    <div> {props.name} </div>
                    <div className="messageBox backgroundLight">
                        <p className="messageText"> {props.content} </p>
                    </div>
                    <div> {props.time} </div>
                </div>
                </div>
            </div>);
        }
    }

    const changeState = () => 
    {
        buttonSound.play();
        if(state === "Show") setState("Hide");
        else setState("Show");
    }

    const renderUsers = (props, index) => 
    {
        const SeeProfile = (e) => 
        {
            buttonSound.play();
            window.location = (`/profile/${e.target.innerText}`);
        }

        const isOnline = () => 
        {
            let flag = false;
            for (let user of onlineUsers) 
            {
                if(user.name === props.name) 
                {
                    flag = true;
                    break;
                }
            }
            return flag;
        }

        return (
        <div className="container user" key={index}>
            <li className="profile" onClick={SeeProfile}> 
                {props.name}
                <span 
                    className="move-right" 
                    style={!isOnline() ? 
                    {
                        display: "none"
                    } : 
                    {
                        backgroundColor: "darkgreen", 
                        color: "white", 
                        padding: "4px 8px", 
                        borderRadius: "5px"
                    }
                }>
                    Online
                </span>
                <span 
                    className="move-right" 
                    style={isOnline() ? 
                    {
                        display: "none"
                    } : 
                    {
                        backgroundColor: "red", 
                        color: "white", 
                        padding: "4px 8px", 
                        borderRadius: "5px"
                    }
                }>
                    Offline
                </span>
            </li>
        </div>
        );
    } 

    if(loading) 
    {
        return <Loader />
    }
    else 
    {
        return (
        <div>
            <Heading />
            <div className="text-center"> 
                <h5 className="mt-1" style={!isGroup ? {display: "none"} : null}> Room ID: {roomId} </h5>
                <h5 className="mt-1" style={!isGroup ? {display: "none"} : null}> Room Name: {roomName} </h5>
                <h5 className="mt-1" style={!isGroup ? {display: "none"} : null}> Room Creator: {creator} </h5>
                <h5 className="mt-1" style={!isGroup ? {display: "none"} : null}> Share the above room id with users whom you want to join <strong> {roomName} </strong> </h5>
                <h5 className="mt-1" style={isGroup ? {display: "none"} : null}> Chat between {roomId} </h5>
                <button className="btn" onClick={changeState} style={!isGroup ? {display: "none"} : null}> {state} All Users in {roomName} </button>
                <button className="btn" onClick={changeState} style={isGroup ? {display: "none"} : null}> {state} Status </button>
            </div>
            <div className="mt-3" style={(state === "Show") ? {display: "none"} : null}>
                {allUsers.map(renderUsers)}
            </div>
            <div className="outerContainer mt-2">
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
            <div className="text-center">
                Note: The messages from the admin are system generated
            </div>
            <div className="space"></div>
            <Footer />
        </div>
        );
    }
}

export default Room;