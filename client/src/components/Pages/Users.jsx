/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useState } from "react";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import search from "../../images/search.png";
import Navbar from "../helper/Navbar";
import Fuse from "fuse.js";
import Loader from "../helper/Loader";
import User from "../helper/User";
import Room from "../helper/Room";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser, getAllUsers } from "../../api/userApis"
import { MessageContext } from "../../utils/Context";
import { createChatRoom, joinChatRoom, getRoomsByUser, getChatsByUser, deleteRoom } from "../../api/roomApis";
var sound = new Howl({src: [music]});

let Users = () => {

    let [username, setUsername] = useState("");
    let [users, setUsers] = useState([]);
    let [allUsers, setAllUsers] = useState([]);
    let [rooms, setRooms] = useState([]);
    let [allRooms, setAllRooms] = useState([]);
    let [chats, setChats] = useState([]);
    let [allChats, setAllChats] = useState([]);
    let [chatInfo, setChatInfo] = useState("");
    let [roomInfo, setRoomInfo] = useState("");
    let [searchUsers,setSearchUsers] = useState("");
    let [searchRooms, setSearchRooms] = useState("");
    let [searchChats, setSearchChats] = useState("");
    let [message, setMessage] = useState("");
    let [roomId, setRoomId] = useState("");
    let [roomMessage, setRoomMessage] = useState("");
    let [tempMessage, setTempMessage] = useState("");
    let [chatMessage, setChatMessage] = useState("");
    let [state, setState] = useState("");
    let [loading, setLoading] = useState(true);
    let [unread, setUnread] = useState(0);
    let guest = localStorage.getItem("Guest");
    let guestMessage = useContext(MessageContext);

    useEffect(() => {
        let fetch = async() => {
            try {
                if(guest !== "true") {
                    let user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                    let roomsData = await getRoomsByUser(user.username);
                    if(roomsData.rooms.length === 0) setRoomInfo("You currently don't have any chat rooms");
                    setRooms(roomsData.rooms);
                    setAllRooms(roomsData.rooms);
                    let chatsData = await getChatsByUser(user.username);
                    if(chatsData.chats.length === 0) setChatInfo("You currently don't have any chats");
                    setChats(chatsData.chats);
                    setAllChats(chatsData.chats);
                }
                else setUsername("Guest");
                let usersData = await getAllUsers();
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

    let searchAmongUsers = (e) => {
        e.preventDefault();
        sound.play();
        if(searchUsers === "") {
            setMessage("Showing All Users");
            setUsers(allUsers);
        }
        else {
            setMessage(`Showing Search results for: ${searchUsers}` )
            let fuse = new Fuse(allUsers, {
                keys: ["username"],
                includeScore: true,
                includeMatches: true
            });
            let result = fuse.search(searchUsers);
            setUsers(result);
        }
    }

    let searchAmongRooms = (e) => {
        e.preventDefault();
        sound.play();
        if(searchRooms === "") {
            setTempMessage("Showing All Rooms");
            setRooms(allRooms);
        }
        else {
            setTempMessage(`Showing Search results for: ${searchRooms}` )
            let fuse = new Fuse(allRooms, {
                keys: ["roomName"],
                includeScore: true,
                includeMatches: true
            });
            let result = fuse.search(searchRooms);
            setRooms(result);
        }
    }

    let searchAmongChats = (e) => {
        e.preventDefault();
        sound.play();
        if(searchChats === "") 
        {
            setChatMessage("Showing All Chats");
            setChats(allChats);
        }
        else 
        {
            setChatMessage(`Showing Search results for: ${searchChats}` )
            let fuse = new Fuse(allChats, {
                keys: ["name"],
                includeScore: true,
                includeMatches: true
            });
            let result = fuse.search(searchChats);
            setChats(result);
        }
    }

    let createRoom = async() => {
        try {
            let roomData = await createChatRoom(username, roomId);
            (roomData === "Room Name Already Exists") ? setRoomMessage(roomData) : window.location = `/room/${roomData.roomId}`;
        }
        catch(error) {
            console.log(error);
        }
    }

    let joinRoom = async(roomId, username) => {
        try {
            sound.play();
            let roomData = await joinChatRoom(roomId, username);
            (roomData === "invalid") ? setRoomMessage("invalid Room Id") : window.location = `/room/${roomId}`;
        }
        catch(err) {
            console.log(err);
        }
    }

    let deleteUserRoom = async(id, roomId, username) => {
        try {
            sound.play();
            let rooms = await deleteRoom(id, roomId, username);
            setAllRooms(rooms)
            setRooms(rooms);
        }
        catch(error) {
            console.log(error);
        }
    }

    let printRooms = (props) => {
        return (props.roomName !== undefined) ?
        <Room
            key={props._id}
            roomName={props.roomName}
            unreadCount={props.unreadCount}
            joinRoom={() => joinRoom(props.roomId, username)}
            remove={() => deleteUserRoom(props._id, props.roomId, username)}
        /> :
        <Room
            key={props.item._id}
            roomName={props.item.roomName}
            unreadCount={props.item.unreadCount}
            joinRoom={() => joinRoom(props.item.roomId, username)}
            remove={() => deleteUserRoom(props.item._id, props.item.roomId, username)}
        />
    } 

    let printUsers = (props) => {
        if(props.username !== undefined) {
            if(props.username !== "Guest") {
                return <User
                    key={props._id}
                    user1={username}
                    user2={props.username}
                    unreadCount={-1}
                />
            }
        } 
        else {
            return <User
                key={props.item._id}
                user1={username}
                user2={props.item.username}
                unreadCount={-1}
            />
        }
    }

    let printChats = (props) => {
        return (props.name !== undefined) ?
        <User
            key={props._id}
            user1={username}
            user2={props.name}
            unreadCount={props.unreadCount}
        /> :
        <User
            key={props.item._id}
            user1={username}
            user2={props.item.name}
            unreadCount={props.item.unreadCount}
        />
    }

    return (loading) ? <Loader /> :
    <div>
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
                    <button 
                        className="btn expand" 
                        onClick={() => (username === "Guest") ? (sound.play(), alert(guestMessage)) : (sound.play(), createRoom())}> 
                        {state} 
                    </button>
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
                <div className="mt-4"> {users.map(printUsers)} </div>
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
        <Footer />
    </div>
}

export default Users;
