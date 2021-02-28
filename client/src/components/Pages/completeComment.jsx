/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import { useParams } from "react-router-dom";
import liked from "../../images/like.png";
import loved from "../../images/love.png";
import laughed from "../../images/laugh.png";
import Heading from "../helper/Heading";
import Loader from "../helper/Loader";
import User from "../helper/User";
import Comment from "../helper/Comment";
import music from "../../sounds/button.mp3";
import { Howl } from "howler";
import { checkUser } from "../../api/userApis";
import { MessageContext } from "../../utils/Context";
import { getCommentData, deleteComment, addReactionToComment } from "../../api/postApis";
var sound = new Howl({src: [music]});

const CompleteComment = () => {

    const [username, setUsername] = useState("");
    const { commentId,id } = useParams();
    const [comment, setComment] = useState({});
    const [like,setlike] = useState(false);
    const [love,setlove] = useState(false);
    const [laugh,setlaugh] = useState(false);
    const [reactions,setreactions] = useState([]);
    const [allreactions,setallreactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        const fetch = async() => {
            try{
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
                const commentData = await getCommentData(commentId, id);
                setComment(commentData);
                setallreactions(commentData.reacts.reverse());
                setreactions(commentData.reacts.reverse());
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[commentId, guest, id]);

    const changeLike = () => {
        sound.play();
        if(!like) {
            setlike(true);    
            setlove(false);
            setlaugh(false);
            setreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "likes");
            }));
        }
    }

    const changeLove = () => {
        sound.play();
        if(!love) {
            setlike(false);    
            setlove(true);
            setlaugh(false);
            setreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "loves");
            }));
        }
    }

    const changeLaugh = () => {
        sound.play();
        if(!laugh) {
            setlike(false);    
            setlove(false);
            setlaugh(true);
            setreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "laughs");
            }));
        }
    }

    const changeAll = () => {
        sound.play();
        setlike(false);    
        setlove(false);
        setlaugh(false);
        setreactions(allreactions);
    }

    const removeComment = async() => {
        try {
            sound.play();
            await deleteComment(id, comment);
            window.location = `/complete/${id}`;        
        }
        catch (error) {
            console.log(error);
        }
    }

    const renderUsers = (props) => {
        return (<User
            key={props._id}
            user1={username}
            user2={props.name}
            unreadCount={-1}
        />);
    } 

    const reactToComment = async(e) => {
        try {
            await addReactionToComment(e.target.name, id, username, comment);
            const commentData = await getCommentData(commentId, id);
            setComment(commentData);
            setallreactions(commentData.reacts.reverse());
            setreactions(commentData.reacts.reverse());
        }
        catch(error) {
            console.log(error);
        }
    }

    return (loading) ? <Loader /> :
    <div>
        <Navbar name={username} page = "comment" unread = {unread}/>
        <Heading />
        <div className="container">
            <Comment 
                key = {comment._id}
                _id = {comment._id}
                id = {id}
                username = {username}
                content = {comment.content}
                name = {comment.name}
                reacts = {comment.reacts}
                likes = {comment.likes}
                loves = {comment.loves}
                laughs = {comment.laughs}
                remove = {removeComment}
                guestMessage = {guestMessage}
                change = {(e) => (username !== "Guest") ? reactToComment(e) : alert(guestMessage)}
            />
            <div className="margin text-center">
                <h2> Users who reacted: </h2>
                <button className="expand mb-4 mt-3 mr-3 allbtn" onClick={changeAll} style={(!like && !love && !laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> All </button> 
                <button className="expand mb-4 mt-3 mr-3" onClick={changeLike} style={(like) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={liked} name="like" className="expand"/> </button> 
                <button className="expand mb-4 mt-3 mr-3" onClick={changeLove} style={(love) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={loved} name="love" className="expand"/> </button> 
                <button className="expand mb-4 mt-3 mr-3" onClick={changeLaugh} style={(laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={laughed} name="laugh" className="expand"/> </button> 
            </div>
            <div className="margin">
                {reactions.map(renderUsers)}    
            </div>
        </div>    
        <Footer />
    </div>
}

export default CompleteComment;
