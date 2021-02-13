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
import { createChat, createChatRoom, joinChatRoom, getRoomsByUser } from "../../api/roomApis";
var sound = new Howl({src: [music]});

const Users = () => {

    var [username, setUsername] = useState("");
    var [allUsers, setAllUsers] = useState([]);
    var [users, setUsers] = useState([]);
    var [searchUsers,setSearchUsers] = useState("");
    var [searchRooms, setSearchRooms] = useState("");
    var [message, setMessage] = useState("");
    var [roomId, setRoomId] = useState("");
    var [rooms, setRooms] = useState([]);
    var [allRooms, setAllRooms] = useState([]);
    var [roomMessage, setRoomMessage] = useState("");
    var [tempMessage, setTempMessage] = useState("");
    var [state, setState] = useState("");
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username);
                    const roomsData = await getRoomsByUser(user.username);
                    setRooms(roomsData);
                    setAllRooms(roomsData);
                }
                else {
                    setUsername("Guest");
                }
                const usersData = await getAllUsers();
                setUsers(usersData);
                setAllUsers(usersData);
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
                        await createChat(room, username, props.username);
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
                    <button onClick={createRoom} style={props.username === username ? {visibility: "hidden"} : null} className="move-right btn-dark expand"> Chat </button>
                </li>
            </div>);
            }
        } 
        else {
            if(props.item.username !== "Guest") {
                return (<div className="container user" key={index}>
                <li className="profile">
                    <span onClick={SeeProfile}> {props.item.username} </span>
                    <button onClick={createRoom} style={props.item.username === username ? {visibility: "hidden"} : null} className="move-right btn-dark expand"> Chat </button>
                </li>
            </div>);
            }
        }
    }

    const searchAmongUsers = (e) => {
        e.preventDefault();
        sound.play();
        if(searchUsers === "") {
            setMessage("Showing All Users");
            setUsers(allUsers);
        }
        else {
            setMessage(`Showing Search results for: ${searchUsers}` )
            const fuse = new Fuse(allUsers, {
                keys: ["username"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchUsers);
            setUsers(result);
        }
    }

    const searchAmongRooms = (e) => {
        e.preventDefault();
        sound.play();
        if(searchRooms === "") {
            setTempMessage("Showing All Rooms");
            setRooms(allRooms);
        }
        else {
            setTempMessage(`Showing Search results for: ${searchRooms}` )
            const fuse = new Fuse(rooms, {
                keys: ["roomName"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchRooms);
            setRooms(result);
        }
    }

    const createRoom = () => {
        sound.play();
        console.log(roomId);
        if(username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            const drop = async() => {
                try {
                    const roomData = await createChatRoom(username, roomId);
                    if(roomData === "Room Name Already Exists") {
                        setRoomMessage(roomData);
                    }
                    else {
                        window.location = `/room/${roomData.roomId}`;
                    }
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

    const printRooms = (props, index) => {

        if(props.roomName !== undefined) {

            const join = async() => {
                const drop = async() => {
                    try {
                        const roomData = await joinChatRoom(props.roomId, username);
                        if(roomData === "invalid") {
                            setRoomMessage("invalid Room Id");
                        }
                        else {
                            window.location = `/room/${props.roomId}`;
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }

            return (<div className="container user" key={index}>
                <li className="profile">
                    <span> {props.roomName} </span>
                    <button onClick={join} className="move-right btn-dark expand"> Join </button>
                </li>
            </div>);
        }   
        else {
            const join = async() => {
                const drop = async() => {
                    try {
                        const roomData = await joinChatRoom(props.item.roomId, username);
                        if(roomData === "invalid") {
                            setRoomMessage("invalid Room Id");
                        }
                        else {
                            window.location = `/room/${props.item.roomId}`;
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }

            return (<div className="container user" key={index}>
            <li className="profile">
                <span> {props.item.roomName} </span>
                <button onClick={join} className="move-right btn-dark expand"> Join </button>
            </li>
        </div>);
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
                <h3 className="margin"> Chats </h3>
                <div>
                    <button className="btn expand" onClick={() => {setState("Create"); setRoomId(""); sound.play()}}> Create a room </button>
                    <button className="btn expand" onClick={() => {setState("Join"); setRoomId(""); sound.play()}}> Join a room </button>
                </div>
                <div style={(state !== "Join") ? {display: "none"} : null}>
                    <input 
                        type="text" 
                        value={roomId} 
                        onChange={(e) => (setRoomId(e.target.value))} 
                        className="width" 
                        placeholder="Enter Room Id" 
                        autoComplete="off"
                    />
                    <button className="btn expand" onClick={joinRoom}> {state} </button>
                </div>
                <div style={(state !== "Create") ? {display: "none"} : null}>
                    <input 
                        type="text" 
                        value={roomId} 
                        onChange={(e) => (setRoomId(e.target.value))} 
                        className="width" 
                        placeholder="Enter Room Name" 
                        autoComplete="off"
                    />
                    <button className="btn expand" onClick={createRoom}> {state} </button>
                </div>
                <div>
                    <p className="mt-1"> {roomMessage} </p>
                    <input 
                        type="text" 
                        value={searchUsers} 
                        onKeyPress={(e) => e.key === "Enter" ? searchAmongUsers(e) : null} onChange={(e) => {setSearchUsers(e.target.value)}} 
                        className="width" 
                        placeholder="Search Users" 
                        autoComplete="off"
                    />
                    <button className="btn expand" onClick={searchAmongUsers}> <img src={search} /> </button>
                    <p className="mt-1"> {message} </p>
                    <div className="mt-4">
                        {users.map(createUser)}
                    </div>
                    <h3 className="mt-5"> My Chat Rooms </h3>
                    <input 
                        type="text" 
                        value={searchRooms} 
                        onKeyPress={(e) => e.key === "Enter" ? searchAmongRooms(e) : null} onChange={(e) => {setSearchRooms(e.target.value)}} 
                        className="width mt-4" 
                        placeholder="Search Chat Rooms" 
                        autoComplete="off"
                    />
                    <button className="btn expand" onClick={searchAmongRooms}> <img src={search} /> </button>
                    <p className="mt-1"> {tempMessage} </p>
                </div>
                <div className="mt-3"> 
                    {rooms.map(printRooms)} 
                </div>
            </div>
            <div className="space"></div>
            <Footer />
        </div>);
    }
}

export default Users;
