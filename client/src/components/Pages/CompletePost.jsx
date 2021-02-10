/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../helper/Post";
import Navbar from "../helper/Navbar";
import like from "../../images/like.png";
import love from "../../images/love.png";
import laugh from "../../images/laugh.png";
import trash from "../../images/trash.png";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import Loader from "../helper/Loader";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis";
import { getPostById, addReactionToPost, addReactionToComment, deleteComment } from "../../api/postApis";
import { createChat } from "../../api/roomApis.js";

var sound = new Howl({src: [music]});

const CompletePost = () => {
    
    var [username, setUsername] = useState("");
    var { id } = useParams();
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    var [post,setPost] = useState({author:"", title:"", content:"", comments:[], comment_count:0, like:0, love:0, laugh:0, imageUrl:""});

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
                const postData = await getPostById(id);
                setPost(postData);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, id]);

    const changepost = (event, post) => {
        if(username !== "Guest") {
            const drop = async() => {
                try {
                    await addReactionToPost(event.target.name, post.name, post);
                    const postData = await getPostById(id);
                    setPost(postData);
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
                        await addReactionToComment(event.target.name, id, username, props);
                        const postData = await getPostById(id);
                        setPost(postData);
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
                        await deleteComment(id, props);
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
            window.location = `/comment/${props._id}/${id}`;
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