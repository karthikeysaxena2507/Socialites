/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect,useState } from "react";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import search from "../../images/search.png";
import Navbar from "../helper/Navbar";
import Fuse from "fuse.js";
import Loader from "../helper/Loader";
import User from "../helper/User";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser, getAllUsers } from "../../api/userApis"
import { MessageContext } from "../../utils/Context";
import { createChatRoom, joinChatRoom, getRoomsByUser, getChatsByUser } from "../../api/roomApis";
var sound = new Howl({src: [music]});

const Users = () => {

    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [chats, setChats] = useState([]);
    const [allChats, setAllChats] = useState([]);
    const [chatInfo, setChatInfo] = useState("");
    const [roomInfo, setRoomInfo] = useState("");
    const [searchUsers,setSearchUsers] = useState("");
    const [searchRooms, setSearchRooms] = useState("");
    const [searchChats, setSearchChats] = useState("");
    const [message, setMessage] = useState("");
    const [roomId, setRoomId] = useState("");
    const [roomMessage, setRoomMessage] = useState("");
    const [tempMessage, setTempMessage] = useState("");
    const [chatMessage, setChatMessage] = useState("");
    const [state, setState] = useState("");
    const [loading, setLoading] = useState(true);
    const [unread, setUnread] = useState(0);
    const guest = localStorage.getItem("Guest");
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                    const roomsData = await getRoomsByUser(user.username);
                    if(roomsData.rooms.length === 0) setRoomInfo("You currently don't have any chat rooms");
                    setRooms(roomsData.rooms);
                    setAllRooms(roomsData.rooms);
                    const chatsData = await getChatsByUser(user.username);
                    if(chatsData.chats.length === 0) setChatInfo("You currently don't have any chats");
                    setChats(chatsData.chats);
                    setAllChats(chatsData.chats);
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
        if(props.username !== undefined) {
            if(props.username !== "Guest") {
                return <User
                    key={index}
                    user1={username}
                    user2={props.username}
                    unreadCount={-1}
                />
            }
        } 
        else {
            return <User
                key={index}
                user1={username}
                user2={props.item.username}
                unreadCount={-1}
            />
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
            const fuse = new Fuse(allRooms, {
                keys: ["roomName"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchRooms);
            setRooms(result);
        }
    }

    const searchAmongChats = (e) => {
        e.preventDefault();
        sound.play();
        if(searchChats === "") {
            setChatMessage("Showing All Chats");
            setChats(allChats);
        }
        else {
            setChatMessage(`Showing Search results for: ${searchChats}` )
            const fuse = new Fuse(allChats, {
                keys: ["name"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchChats);
            setChats(result);
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
                    const roomData = await createChatRoom(username, roomId);
                    (roomData === "Room Name Already Exists") ? setRoomMessage(roomData) : window.location = `/room/${roomData.roomId}`;
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    const joinRoom = async(roomId, username) => {
        try {
            sound.play();
            const roomData = await joinChatRoom(roomId, username);
            (roomData === "invalid") ? setRoomMessage("invalid Room Id") : window.location = `/room/${roomId}`;
        }
        catch(err) {
            console.log(err);
        }
    }

    const printRooms = (props) => {
        if(props.roomName !== undefined) {
            return (<div className="container user" key={props._id}>
                <li className="profile">
                    <span> {props.roomName} ({props.unreadCount}) </span>
                    <button 
                        onClick={() => (username === "Guest") ? alert(guestMessage) : joinRoom(props.roomId, username)} 
                        className="move-right btn-dark expand"> 
                        Join 
                    </button>
                </li>
            </div>);
        }   
        else {
            return (<div className="container user" key={props.item._id}>
                <li className="profile">
                    <span> {props.item.roomName} ({props.item.unreadCount}) </span>
                    <button 
                        onClick={() => (username === "Guest") ? alert(guestMessage) : joinRoom(props.item.roomId, username)} 
                        className="move-right btn-dark expand"> 
                        Join 
                    </button>
                </li>
        </div>);
        }
    }

    const printChats = (props) => {
        if(props.name !== undefined) {
            return (
            <User
                key={props._id}
                user1={username}
                user2={props.name}
                unreadCount={props.unreadCount}
            />)
        }
        else {
            return (
            <User
                key={props.item._id}
                user1={username}
                user2={props.item.name}
                unreadCount={props.item.unreadCount}
            />)
        }
    }

    if(loading) {
        return <Loader />
    }
    else {
        return (<div>
            <Navbar name={username} page = "allusers" unread = {unread}/>
            <Heading />
            <div className="container margin text-center">
                <div>
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
                        <button 
                            className="btn expand" 
                            onClick={() => (username === "Guest") ? alert(guestMessage) : joinRoom(roomId, username)} > 
                            {state} 
                        </button>
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
                    <p className="mt-1"> {roomMessage} </p>
                </div>
                <div>
                    <h3> All Users </h3>
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
                    <div className="mt-4"> {users.map(createUser)} </div>
                </div>
                <div className="mt-4">
                    <h3> My Chats </h3>
                    <input 
                        type="text" 
                        value={searchChats} 
                        onKeyPress={(e) => e.key === "Enter" ? searchAmongChats(e) : null} onChange={(e) => {setSearchChats(e.target.value)}} 
                        className="width" 
                        placeholder="Search Chats" 
                        autoComplete="off"
                    />
                    <button className="btn expand" onClick={searchAmongChats}> <img src={search} /> </button>
                    <p className="mt-1"> {chatMessage} </p>
                    <p className="mt-1"> {chatInfo} </p>
                    <div className="mt-4"> {chats.map(printChats)} </div>
                </div>
                <div className="mt-4">
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
                    <p className="mt-2"> {roomInfo} </p>
                    <div className="mt-3"> {rooms.map(printRooms)} </div>
                </div>
            </div>
            <div className="space"></div>
            <Footer />
        </div>);
    }
}

export default Users;
