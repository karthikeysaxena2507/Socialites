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
import User from "../helper/User";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis";
import { getCommentData, deleteComment, addReactionToComment } from "../../api/postApis";
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
    var [unread, setUnread] = useState(0);

    useEffect(() => {
        const fetch = async() => {
            try{
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
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
        return (<User
            key={index}
            user1={username}
            user2={props.name}
            unreadCount={-1}
        />);
    }
    
    const SeeProfile = (e) => {
        sound.play();
        window.location = (`/profile/${e.target.innerText}`);
    }

    if(loading) {
        return <Loader />
    }
    else {

        const check = (type) => {
            const reactions = comment.reacts;
            let flag = false;
            for(let reaction of reactions) {
                if(reaction.name === username && reaction.type === type) {
                    flag = true;
                    break;
                }
            }
            return flag;
        } 

        const reactToComment = (event) => {
            sound.play();
            if(username !== "Guest") {
                const drop = async() => {
                    try {
                        await addReactionToComment(event.target.name, id, username, comment);
                        const commentData = await getCommentData(commentId, id);
                        setComment(commentData);
                        setallreactions(commentData.reacts.reverse());
                        setreactions(commentData.reacts.reverse());
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

        return (<div>
                <Navbar name={username} page = "comment" unread = {unread}/>
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
                                    <img 
                                        src={liked} 
                                        name="likes"
                                        onClick={reactToComment}
                                        className="expand one" 
                                        style={check("likes") ? {backgroundColor: "white", padding: "5px 5px", borderRadius: "5px", border: "2px solid brown"} : null}                                        
                                    /> 
                                    {comment.likes}
                                </span>
                                <span className="one">
                                    <img 
                                        src={loved} 
                                        name="loves"
                                        onClick={reactToComment}
                                        className="expand one" 
                                        style={check("loves") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                                    />
                                    {comment.loves}
                                </span>
                                <span className="one">
                                    <img 
                                        src={laughed}
                                        name="laughs" 
                                        onClick={reactToComment}
                                        className="expand one" 
                                        style={check("laughs") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}                                        
                                    />
                                    {comment.laughs}
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
