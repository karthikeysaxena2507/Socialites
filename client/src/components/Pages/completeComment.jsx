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

let CompleteComment = () => {

    let [username, setUsername] = useState("");
    let { commentId,id } = useParams();
    let [comment, setComment] = useState({});
    let [like,setlike] = useState(false);
    let [love,setlove] = useState(false);
    let [laugh,setlaugh] = useState(false);
    let [reactions,setreactions] = useState([]);
    let [allreactions,setallreactions] = useState([]);
    let [loading, setLoading] = useState(true);
    let guest = localStorage.getItem("Guest");
    let [unread, setUnread] = useState(0);
    let guestMessage = useContext(MessageContext);

    useEffect(() => {
        let fetch = async() => {
            try{
                if(guest !== "true") {
                    let user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
                let commentData = await getCommentData(commentId, id);
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

    let changeLike = () => {
        sound.play();
        if(!like) {
            setlike(true);    
            setlove(false);
            setlaugh(false);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "likes");
            }));
        }
    }

    let changeLove = () => {
        sound.play();
        if(!love) {
            setlike(false);    
            setlove(true);
            setlaugh(false);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "loves");
            }));
        }
    }

    let changeLaugh = () => {
        sound.play();
        if(!laugh) {
            setlike(false);    
            setlove(false);
            setlaugh(true);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "laughs");
            }));
        }
    }

    let changeAll = () => {
        sound.play();
        setlike(false);    
        setlove(false);
        setlaugh(false);
        setreactions(allreactions);
    }

    let removeComment = async() => {
        try {
            sound.play();
            await deleteComment(id, comment, username);
            window.location = `/complete/${id}`;        
        }
        catch (error) {
            console.log(error);
        }
    }

    let renderUsers = (props) => {
        return (<User
            key={props._id}
            user1={username}
            user2={props.name}
            unreadCount={-1}
        />);
    } 

    let reactToComment = async(e) => {
        try {
            await addReactionToComment(e.target.name, id, username, comment);
            let commentData = await getCommentData(commentId, id);
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
