/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from 'react'
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import Loader from "../helper/Loader";
import User from "../helper/ChatRoomUser";
import SentMessage from "../helper/SentMessage";
import ReceivedMessage from "../helper/ReceivedMessage";
import RoomData from "../helper/roomData";
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

const Rooms = () => {

    const socket = useRef(null);
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [creator, setCreator] = useState("");
    const [isGroup, setIsGroup] = useState(false);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages,setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [state, setState] = useState("Show");

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
                socket.current.on("updatemessages", (data) => {
                    setMessages(data.messages);
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
        if(message) 
        {
            socket.current.emit("sendmessage", {message, name: username, room: roomId, time: time()}, () => {});
            setMessage("");
        }
        console.log(messages);
    }

    const printMessages = (props) => 
    {

        const deleteMessage = (messageId) => 
        {
            buttonSound.play();
            socket.current.emit("deletemessage", {room: roomId, messageId});
        }

        return (props.name === username) ?
        <SentMessage 
            key = {props._id}
            _id = {props._id}
            username = {username}
            content = {props.content}
            time = {props.time}
            delete = {(messageId) => deleteMessage(messageId)}  
        />
        :
        <ReceivedMessage 
            key = {props._id}
            _id = {props._id}
            name = {props.name}
            content = {props.content}
            time = {props.time}
        />
    }

    const changeState = () => 
    {
        buttonSound.play();
        (state === "Show") ? setState("Hide") : setState("Show")
    }

    const printUsers = (props) => 
    {
        return (<User
            key={props._id}
            name={props.name}
            onlineUsers={onlineUsers}
        />);
    } 

    return (loading) ? <Loader /> :
    <div>
        <Heading />
        <RoomData 
            isGroup = {isGroup}
            roomId = {roomId}
            creator = {creator}
            state = {state}
            roomName = {roomName}
            change = {changeState}
        />
        <div className="mt-3" style={(state === "Show") ? {display: "none"} : null}>
            {allUsers.map(printUsers)}
        </div>
        <div className="outerContainer mt-2">
            <div className="innerContainer">
            <ScrollToBottom className="messages">
                {messages.map(printMessages)}
            </ScrollToBottom>
            <form className="form">
                <input
                    className="input"
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => {setMessage(e.target.value)}}
                    onKeyPress={event => (event.key === "Enter") ? sendMessage(event) : null}
                />
                <button type="submit" className="sendButton" onClick={e => sendMessage(e)}> SEND </button>
            </form>
            </div>
        </div>
        <div className="text-center">
            Note: The messages from the admin are system generated
        </div>
        <Footer />
    </div>
}

export default Rooms;