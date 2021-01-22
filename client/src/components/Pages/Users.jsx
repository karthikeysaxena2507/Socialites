/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import React, { useEffect,useState } from "react";
import { useHistory } from "react-router-dom";
import Footer from "../Footer";
import Heading from "../Heading";
import search from "../images/search.png";
import Navbar from "../Navbar";
import Fuse from "fuse.js";
import { Spinner } from "react-bootstrap";

const Users = () => {

    var [username, setUsername] = useState("");
    var history = useHistory();
    var [allUsers, setAllUsers] = useState([]);
    var [users, setUsers] = useState([]);
    var [searchContent,setsearchContent] = useState("");
    var [message, setMessage] = useState("");
    var [roomId, setRoomId] = useState("");
    var [roomMessage, setRoomMessage] = useState("");
    var [state, setState] = useState("");
    var [loading, setLoading] = useState(false);
    var guest = localStorage.getItem("Guest");

    useEffect(() => {
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
                const response = await axios.get(`/users/get`);
                setUsers(response.data);
                setAllUsers(response.data);
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

    const createUser = (props, index) => {

        const createRoom = () => {
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
                        await axios.post("/rooms/chat",{roomId: room})
                        history.push(`/room/${room}`);
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }
        }

        const SeeProfile = (e) => {
            history.push(`/profile/${e.target.innerText}`);
        }

        if(props.username !== undefined) {
            return (<div className="container user" key={index}>
                <li className="profile">
                    <span onClick={SeeProfile}> {props.username} </span>
                    <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
                </li>
            </div>);
        } 
        else {
            return (<div className="container user" key={index}>
                <li className="profile">
                    <span onClick={SeeProfile}> {props.item.username} </span>
                    <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
                </li>
            </div>);
        }
    }

    const searchIt = (event) => {
        event.preventDefault();
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
        if(username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            const drop = async() => {
                try {
                    const response = await axios.post("/rooms/create", {username});
                    history.push(`/room/${response.data.roomId}`);
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    const joinRoom = () => {
        if(username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            const drop = async() => {
                try {
                    const response = await axios.post("/rooms/join", {roomId, username});
                    if(response.data === "invalid") {
                        setRoomMessage("invalid Room Id");
                    }
                    else {
                        history.push(`/room/${roomId}`);
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
        return (<div className="text-center upper-margin"> 
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> </span>
    </div>)
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
                    <button className="btn expand" onClick={() => {setState("Join"); setRoomId("")}}> Join a room </button>
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
