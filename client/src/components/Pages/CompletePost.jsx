/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from "react";
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
import { MessageContext } from "../../utils/Context";
import { getPostById, addReactionToPost, addReactionToComment, deleteComment } from "../../api/postApis";
import { createChat } from "../../api/roomApis.js";
var sound = new Howl({src: [music]});

const CompletePost = () => {
    
    const [username, setUsername] = useState("");
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");
    const [post,setPost] = useState({});
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
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

    const addReaction = async(e, post) => {
        try {
            await addReactionToPost(e.target.name, post.name, post);
            const postData = await getPostById(id);
            setPost(postData);
        }
        catch(error) {
            console.log(error);
        }
    }

    const createComment = (props) => {

        const reactToComment = async(e) => {
            try {
                await addReactionToComment(e.target.name, id, username, props);
                const postData = await getPostById(id);
                setPost(postData);
            }
            catch(error) {
                console.log(error);
            }
        }

        const remove = async() => {
            try {
                await deleteComment(id, props);
                window.location = `/complete/${id}`;
            }
            catch(error) {
                console.log(error);
            }
        }

        const createRoom = async() => {
            try {
                var room = (username < props.name) ? (username + "-" + props.name) : (props.name + "-" + username);
                await createChat(room, username, props.name);
                window.location = `/room/${room}`;
            }
            catch(error) {
                console.log(error);
            }
        }

        const check = (type) => {
            const reactions = props.reacts;
            for(let reaction of reactions) {
                if(reaction.name === username && reaction.type === type) {
                    return true;
                }
            }
            return false;
        }

        return <div className="container margin" key={props._id}>
        <div className="comment-name">
            <div> 
                <span className="name author" onClick={(e) => {sound.play(); window.location = (`/profile/${e.target.innerText}`)}}> {props.name} </span>
                <button 
                    onClick={() => (username !== "Guest") ? (sound.play(), createRoom()) : (sound.play(), alert(guestMessage))} 
                    style={(props.name === username) ? {display: "none"} : null} 
                    className="move-right btn-dark expand"> 
                    Message {props.name} 
                </button>
            </div>
            <div>
                <span className="move-right"> 
                    <span className="one">
                        <img 
                            src={like}   
                            name = "likes"
                            onClick={(e) => (username !== "Guest") ? (sound.play(), reactToComment(e)) : (sound.play(), alert(guestMessage))}
                            style={check("likes") ? {backgroundColor: "white", padding: "5px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                            className="expand one"
                        /> 
                        {props.likes}
                    </span>
                    <span className="one">
                        <img 
                            src={love}   
                            onClick={(e) => (username !== "Guest") ? (sound.play(), reactToComment(e)) : (sound.play(), alert(guestMessage))}
                            name = "loves"
                            style={check("loves") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                            className="expand one"
                        /> 
                        {props.loves}
                    </span>
                    <span className="one">
                        <img 
                            src={laugh}   
                            onClick={(e) => (username !== "Guest") ? (sound.play(), reactToComment(e)) : (sound.play(), alert(guestMessage))}
                            name = "laughs"
                            style={check("laughs") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                            className="expand one"
                        /> 
                        {props.laughs}
                    </span>
                    <span className="all">
                        <a onClick={() => {sound.play(); window.location = `/comment/${props._id}/${id}`}} className="expand"> All </a> 
                    </span>
                </span> 
            </div>
        </div>
        <div className="comment-content"> {props.content} </div>            
        <div className="comment-options text-center" style={(props.name === username) ? {visibility: "visible"} : {visibility: "hidden"}}>
            <img src={trash} onClick={() => (username !== "Guest") ? remove() : (sound.play(), alert(guestMessage))} className="expand one"/>
        </div>
    </div>
    }

    return (loading) ? <Loader /> :
    <div className="container">
        <Navbar name={username} page = "complete" unread = {unread}/>
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
                    change = {(e, post) => (username !== "Guest") ? addReaction(e, post) : alert(guestMessage)}
                    show_comments = {false}
                    imageUrl = {post.imageUrl}
                    reactions = {post.reacts}
            />
            <h3 className="margin text-center"> Comments </h3>
            {post.comments.map(createComment)}
        </div>
        <Footer />
    </div>
}

export default CompletePost;