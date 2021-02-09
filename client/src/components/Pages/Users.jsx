/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect,useState } from "react";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import search from "../../images/search.png";
import Navbar from "../helper/Navbar";
import Fuse from "fuse.js";
import Loader from "../helper/Loader";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser, getAllUsers } from "../../api/userApis"
import { createChat, createChatRoom, joinChatRoom } from "../../api/roomApis";
var sound = new Howl({src: [music]});

const Users = () => {

    var [username, setUsername] = useState("");
    var [allUsers, setAllUsers] = useState([]);
    var [users, setUsers] = useState([]);
    var [searchContent,setsearchContent] = useState("");
    var [message, setMessage] = useState("");
    var [roomId, setRoomId] = useState("");
    var [roomMessage, setRoomMessage] = useState("");
    var [state, setState] = useState("");
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username);
                }
                else {
                    setUsername("Guest");
                }
                const response = await getAllUsers();
                setUsers(response);
                setAllUsers(response);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest]);

    const createUser = (props, index) => {

        const createRoom = () => {
            sound.play();
            var room;
            if(props.username !== undefined) {
                room = (username < props.username) ? (username + "-" + props.username) : (props.username + "-" + username);
            }
            else {
                room = (username < props.item.username) ? (username + "-" + props.item.username) : (props.item.username + "-" + username);
            }
            if(username === "Guest") {
                alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
            }
            else {
                const drop = async() => {
                    try {
                        await createChat(room);
                        window.location = `/room/${room}`;
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }
        }

        const SeeProfile = (e) => {
            sound.play();
            window.location = `/profile/${e.target.innerText}`;
        }

        if(props.username !== undefined) {
            if(props.username !== "Guest") {
                return (<div className="container user" key={index}>
                <li className="profile">
                    <span onClick={SeeProfile}> {props.username} </span>
                    <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
                </li>
            </div>);
            }
        } 
        else {
            if(props.item.username !== "Guest") {
                return (<div className="container user" key={index}>
                <li className="profile">
                    <span onClick={SeeProfile}> {props.item.username} </span>
                    <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
                </li>
            </div>);
            }
        }
    }

    const searchIt = (event) => {
        event.preventDefault();
        sound.play();
        if(searchContent === "") {
            setMessage("Showing All Users");
            setUsers(allUsers);
        }
        else {
            setMessage(`Showing Search results for: ${searchContent}` )
            const fuse = new Fuse(allUsers, {
                keys: ["username"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchContent);
            setUsers(result);
        }
    }

    const createRoom = () => {
        sound.play();
        if(username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            const drop = async() => {
                try {
                    const roomData = await createChatRoom(username);
                    window.location = `/room/${roomData.roomId}`;
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    const joinRoom = () => {
        sound.play();
        if(username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            const drop = async() => {
                try {
                    const roomData = await joinChatRoom(roomId, username);
                    if(roomData === "invalid") {
                        setRoomMessage("invalid Room Id");
                    }
                    else {
                        window.location = `/room/${roomId}`;
                    }
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    if(loading) {
        return <Loader />
    }
    else {
        return (<div>
            <Navbar name={username} page = "allusers"/>
            <Heading />
            <div className="container margin text-center">
                <h3 className="margin"> All Users </h3>
                <input type="text" value={searchContent} onKeyPress={(e) => e.key === "Enter" ? searchIt(e) : null} onChange={(e) => {setsearchContent(e.target.value)}} className="width" placeholder="Search Users" autoComplete="off"/>
                <button className="btn expand" onClick={searchIt}> <img src={search} /> </button>
                <div>
                    <button className="btn expand" onClick={createRoom}> Create a room </button>
                    <button className="btn expand" onClick={() => {setState("Join"); setRoomId(""); sound.play()}}> Join a room </button>
                </div>
                <div style={(state==="") ? {visibility: "hidden"} : null}>
                    <input type="text" value={roomId} onChange={(e) => (setRoomId(e.target.value))} className="width" placeholder="Enter Room Id" autoComplete="off"/>
                    <button className="btn expand" onClick={joinRoom}> {state} </button>
                </div>
                <p className="margin"> {roomMessage} </p>
                <p className="margin"> {message} </p>
            </div>
            <div className="margin">
                {users.map(createUser)}
            </div>
            <div className="space"></div>
            <Footer />
        </div>);
    }
}

export default Users;
