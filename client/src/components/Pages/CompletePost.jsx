/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Post from "../Post";
import Navbar from "../Navbar";
import like from "../../images/like.png";
import love from "../../images/love.png";
import laugh from "../../images/laugh.png";
import trash from "../../images/trash.png";
import Footer from "../Footer";
import Heading from "../Heading";
import Loader from "../Loader";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});

const CompletePost = () => {
    
    var history = useHistory();
    var [username, setUsername] = useState("");
    var { id } = useParams();
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    var [post,setPost] = useState({author:"", title:"", content:"", comments:[], comment_count:0, like:0, love:0, laugh:0, imageUrl:""});

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    var token = localStorage.getItem("token");
                    if(token === null) token = sessionStorage.getItem("token");
                    const user = await axios.get("/users/auth",{
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": token
                        }
                    });
                    setUsername(user.data.username);
                }
                else {
                    setUsername("Guest");
                }
                const response = await axios.get(`/posts/${id}`);
                setPost(response.data[0]);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                localStorage.clear();
                sessionStorage.clear();
                window.location = "/login";
            }
        }
        fetch();
    },[guest, id]);

    const changepost = (event, post) => {
        if(username !== "Guest") {
            const drop = async() => {
                try {
                    await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                    const response = await axios.get(`/posts/${id}`);
                    setPost(response.data[0]);
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    }

    const createComment = (props, index) => {

        const reactToComment = (event) => {
            sound.play();
            if(username !== "Guest") {
                const drop = async() => {
                    try {
                        await axios.post(`/posts/comment/${event.target.name}/${id}/${username}`, props);
                        const response = await axios.get(`/posts/${id}`);
                        setPost(response.data[0]);
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }
            else {
                alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
            }
        }

        const remove = () => {
            sound.play();
            if(username !== "Guest") {
                const drop = async() => {
                    try {
                        await axios.post(`/posts/remove/${id}`, props);
                        window.location = `/complete/${id}`;
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }
            else {
                alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
            }
        }

        const SeeAll = () => {
            sound.play();
            history.push(`/comment/${props._id}/${id}`);
        }

        const createRoom = () => {
            sound.play();
            if(username === "Guest") {
                alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
            }
            else {
                const drop = async() => {
                    try {
                        var room = (username < props.name) ? (username + "-" + props.name) : (props.name + "-" + username);
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
            sound.play();
            history.push(`/profile/${e.target.innerText}`);
        }

        var style1 = (props.name === username) ? {visibility: "visible"} : {visibility: "hidden"}

        return <div className="container margin" key={index}>
        <div className="comment-name">
            <div> 
                <span className="name author" onClick={SeeProfile}> {props.name} </span>
                <button onClick={createRoom} className="move-right btn-dark expand"> Message {props.name} </button>
            </div>
            <div>
                <span className="move-right"> 
                    <span className="one">
                        <img 
                            src={like}   
                            name = "likes"
                            onClick={reactToComment}
                            className="expand one"/> 
                            {props.likes}
                    </span>
                    <span className="one">
                        <img 
                            src={love}   
                            onClick={reactToComment}
                            name = "loves"
                            className="expand one"/> 
                            {props.loves}
                    </span>
                    <span className="one">
                        <img 
                            src={laugh}   
                            onClick={reactToComment}
                            name = "laughs"
                            className="expand one"/> 
                            {props.laughs}
                    </span>
                    <span className="all">
                        <a onClick={SeeAll} className="expand"> All </a> 
                    </span>
                </span> 
            </div>
        </div>
        <div className="comment-content"> {props.content} </div>            
        <div className="comment-options text-center" style={style1}>
            <img src={trash} onClick={remove} className="expand one"/>
        </div>
    </div>
    }

    if(loading) {
        return <Loader />
    }
    else {
        return (<div className="container">
        <Navbar name={username} page = "complete" />
        <Heading />
        <div>
            <Post 
                    key = {id}
                    name = {username}
                    _id = {id}
                    author = {post.author}
                    title = {post.title}
                    content = {post.content}
                    category = {post.category}
                    like = {post.like}
                    love = {post.love}
                    laugh = {post.laugh}
                    comment_count = {post.comments.length}
                    change = {changepost}
                    show_comments = {false}
                    imageUrl = {post.imageUrl}
            />
            <h3 className="margin text-center"> Comments </h3>
            {post.comments.map(createComment)}
        </div>
        <div className="space"></div>
        <Footer />
        </div>);
    }
}

export default CompletePost;