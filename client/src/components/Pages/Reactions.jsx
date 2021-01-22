/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Navbar from "../Navbar"; 
import liked from "../images/like.png"
import loved from "../images/love.png";
import laughed from "../images/laugh.png";
import axios from "axios";
import search from "../images/search.png";
import Footer from "../Footer";
import Post from "../Post";
import Heading from "../Heading";
import Fuse from "fuse.js";
import { Spinner } from "react-bootstrap";

const Reactions = () => {

    var [username, setUsername] = useState("");
    var history = useHistory();
    var { id } = useParams();
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [searchContent,setsearchContent] = useState("");
    var [reactions,setreactions] = useState([]);
    var [allreactions,setallreactions] = useState([]);
    var [tempreactions,settempreactions] = useState([]);
    var [message, setMessage] = useState("");
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    var [post,setPost] = useState({author:"", title:"", content:"", comments:[], comment_count:0, like:0, love:0, laugh:0, imageUrl:""});

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
                const response = await axios.get(`/posts/${id}`);
                console.log(response.data[0].reacts.reverse());
                setallreactions(response.data[0].reacts.reverse());
                setreactions(response.data[0].reacts.reverse());
                settempreactions(response.data[0].reacts.reverse());
                setPost(response.data[0]);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
                localStorage.clear();
                window.location = "/login";
            }
        }
        fetch();
    },[guest, id]);

    const changeLike = () => {
        if(!like) {
            setlike(true);    
            setlove(false);
            setlaugh(false);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "like");
            }));
            settempreactions(allreactions.filter((reaction) => {
                return (reaction.type === "like");
            }));
            setMessage("Showing All Users Who Liked");
        }
    }
    const changeLove = () => {
        if(!love) {
            setlike(false);    
            setlove(true);
            setlaugh(false);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "love");
            }));
            settempreactions(allreactions.filter((reaction) => {
                return (reaction.type === "love");
            }));
            setMessage("Showing All Users Who Loved");
        }
    }
    const changeLaugh = () => {
        if(!laugh) {
            setlike(false);    
            setlove(false);
            setlaugh(true);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "laugh");
            }));
            settempreactions(allreactions.filter((reaction) => {
                return (reaction.type === "laugh");
            }));
            setMessage("Showing All Users Who Laughed");
        }
    }

    const changeAll = () => {
        setlike(false);    
        setlove(false);
        setlaugh(false);
        setreactions(allreactions);
        settempreactions(allreactions);
        setMessage("Showing All Users Who Reacted");
    }

    const change = (event) => {
        setsearchContent(event.target.value);
    }

    const renderUsers = (props, index) => {

        if(props.name !== undefined) {
            const createRoom = () => {
                if(username === "Guest") {
                    alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
                }
                else {
                    const drop = async() => {
                        try {
                            var room = (username < props.name) ? (username + "-" + props.name) : (props.name + "-" + username);
                            const response = await axios.post("/rooms/chat",{roomId: room})
                            history.push(`/room/${room}`);
                            console.log(response.data);
                        }
                        catch(error) {
                            console.log(error);
                        }
                    }
                    drop();
                }
            }
            return (<div className="container user" key={index}>
            <li className="profile"> 
                {props.name}
                <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
            </li>
        </div>);
        }
        else {
            const createRoom = () => {
                if(username === "Guest") {
                    alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
                }
                else {
                    const drop = async() => {
                        try {
                            var room = (username < props.name) ? (username + "-" + props.name) : (props.name + "-" + username);
                            const response = await axios.post("/rooms/chat",{roomId: room})
                            localStorage.setItem("roomId", room);
                            history.push(`/room`);
                            console.log(response.data);
                        }
                        catch(error) {
                            console.log(error);
                        }
                    }
                    drop();
                }
            }
            return (<div className="container user" key={index}>
            <li className="profile"> 
                {props.item.name} 
                <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
            </li>
        </div>);
        }
    }

    const searchIt = (event) => {
        event.preventDefault();
        if(searchContent === "") {
            setMessage("Showing All Users in this Category");
            setreactions(tempreactions);
        }
        else {
            setMessage(`Showing Search results for: ${searchContent}` )
            const fuse = new Fuse(tempreactions, {
                keys: ["name"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchContent);
            setreactions(result);
        }
    }

    const changepost = (event, post) => {
        if(username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            const drop = async() => {
                try {
                    const res = await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                    console.log(res.data);
                    const response = await axios.get(`/posts/${id}`);
                    console.log(response.data[0].reacts.reverse());
                    setallreactions(response.data[0].reacts.reverse());
                    setreactions(response.data[0].reacts.reverse());
                    settempreactions(response.data[0].reacts.reverse());
                    setPost(response.data[0]);
                    setlike(false);
                    setlove(false);
                    setlaugh(false);
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
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> </span>
    </div>)
    }
    else {
        return(<div>
            <Navbar name={username} page="reactions"/>
            <Heading />
            <div className="container">
                <Post 
                        key = {post._id}
                        name = {username}
                        _id = {post._id}
                        author = {post.author}
                        title = {post.title}
                        content = {post.content}
                        category = {post.category}
                        like = {post.like}
                        love = {post.love}
                        laugh = {post.laugh}
                        comment_count = {post.comments.length}
                        change = {changepost}
                        show_comments = {true}
                        imageUrl = {post.imageUrl}
                />
                <div className="text-center">
                    <h2 className="margin"> Users who Reacted: </h2>
                    <div>
                        <button className="btn expand margin one allbtn" onClick={changeAll} style={(!like && !love && !laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> All </button> 
                        <button className="btn expand margin one" onClick={changeLike} style={(like) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={liked} name="like" className="expand"/> </button> 
                        <button className="btn expand margin one" onClick={changeLove} style={(love) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={loved} name="love" className="expand"/> </button> 
                        <button className="btn expand margin one" onClick={changeLaugh} style={(laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={laughed} name="laugh" className="expand"/> </button> 
                    </div>
                    <div>
                        <input type="text" value={searchContent} onKeyPress={(e) => e.key === "Enter" ? searchIt(e) : null} onChange={change} className="width" placeholder="Search" autoComplete="off"/>
                        <button className="btn expand" onClick={searchIt}> <img src={search} /> </button>
                    </div>
                </div>    
            </div>
            <div className="margin text-center">
                <p className="margin"> {message} </p>
            </div>
            <div className="margin">
                {reactions.map(renderUsers)}    
            </div>
            <div className="space"></div>
            <Footer />
        </div>);
    }
}

export default Reactions;
