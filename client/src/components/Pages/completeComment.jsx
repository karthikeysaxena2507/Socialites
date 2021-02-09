/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import { useParams } from "react-router-dom";
import liked from "../../images/like.png";
import loved from "../../images/love.png";
import laughed from "../../images/laugh.png";
import trash from "../../images/trash.png";
import Heading from "../helper/Heading";
import Loader from "../helper/Loader";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis";
import { getCommentData, deleteComment } from "../../api/postApis";
import { createChat } from "../../api/roomApis";
var sound = new Howl({src: [music]});

const CompleteComment = () => {

    var [username, setUsername] = useState("");
    var { commentId,id } = useParams();
    var [comment, setComment] = useState({});
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [reactions,setreactions] = useState([]);
    var [allreactions,setallreactions] = useState([]);
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");

    useEffect(() => {
        const fetch = async() => {
            try{
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username);
                }
                else {
                    setUsername("Guest");
                }
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

    const remove = () => {
        sound.play();
        if(username !== "Guest") {
            const drop = async() => {
                try {
                    await deleteComment(id, comment);
                    window.location = `/complete/${id}`;        
                }
                catch (error) {
                    console.log(error);
                }
            }
            drop();
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    }

    const renderUsers = (props, index) => {

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

        return (<div className="container user" key={index}>
            <li className="profile"> <span onClick={SeeProfile}> {props.name} </span>
            <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
            </li>
        </div>);
    }

    const SeeProfile = (e) => {
        sound.play();
        window.location = (`/profile/${e.target.innerText}`);
    }

    if(loading) {
        return <Loader />
    }
    else {
        return (<div>
                <Navbar name={username} page = "comment"/>
                <Heading />
                <div className="container">
                    <div className="container margin">
                    <div className="comment-name">
                        <div> 
                            <span className="name author" onClick={SeeProfile}> {comment.name} </span>
                        </div>
                        <div>
                            <span className="move-right"> 
                                <span className="one">
                                    <img src={liked} className="one"/> {comment.likes}
                                </span>
                                <span className="one">
                                    <img src={loved} className="one"/> {comment.loves}
                                </span>
                                <span className="one">
                                    <img src={laughed} className="one"/> {comment.laughs}
                                </span>
                            </span> 
                        </div>
                    </div>
                    <div className="comment-content"> {comment.content} </div>            
                    <div className="comment-options text-center" style={(comment.name === username) ? {visibility: "visible"} : {visibility: "hidden"}}>
                        <img src={trash} onClick={remove} className="expand mr-3"/>
                    </div>
                    </div>
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
                <div className="space"></div>
                <Footer />
        </div>);
    }
}

export default CompleteComment;
