import React, { useEffect,useState } from "react";
import axios from "axios";
import Heading from "./Heading";
import Navbar from "./Navbar";
import ScrollToBottom from 'react-scroll-to-bottom';
import Footer from "./Footer";

const Chat = () => {

    var user1 = localStorage.getItem("username");
    var user2 = localStorage.getItem("otheruser");
    var [message, setMessage] = useState("");
    var [messages,setMessages] = useState([]);
    var room = (user1 < user2) ? (user1+user2) : (user2+user1);

    useEffect(() => {
        const fetch = async() => {
            try {
                const response = await axios.get(`/chats/get/${room}`);
                console.log(response);
                setMessages(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    });

    const changeMessage = (e) => {
        setMessage(e.target.value);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if(user1 === null || user1 === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            console.log(e);
            const drop = async() => {
                const response = await axios.post(`/chats/add/${room}`, {
                    username: user1,
                    content: message
                });
                setMessages(response.data);
            }
            drop();
            setMessage("");
        }
    }

    const createMessage = (props, index) => {
        if(props.username === user1) {
            return (
            <div key={index}>
                <div className="messageContainer justifyEnd">
                    <div className="sentText pr-10">{user1}</div>
                    <div className="messageBox backgroundBlue">
                        <p className="messageText colorWhite"> {props.content} </p>
                    </div>
                </div>
            </div>);
        }
        else {
            return (
            <div key={index}>
                <div className="messageContainer justifyStart">
                    <div className="messageBox backgroundLight">
                        <p className="messageText colorLight">{props.content}</p>
                    </div>
                    <p className="sentText pl-10 ">{user2}</p>
                </div>
            </div>);
        }
    }

    return (<div>
        <Navbar page = "chats"/>
        <Heading />
        <h4 className="margin text-center"> Hello {user1} </h4>
        <div className="text-center"> <h5 className="margin"> Chat with {user2} </h5> </div>
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
                    onChange={changeMessage}
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

export default Chat;
