/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useParams,useHistory } from "react-router-dom";
import axios from "axios";
import liked from "../images/like.png";
import loved from "../images/love.png";
import laughed from "../images/laugh.png";
import trash from "../images/trash.png";
import Heading from "../Heading";
import { Spinner } from "react-bootstrap";

const CompleteComment = () => {

    var history = useHistory();
    var [username, setUsername] = useState("");
    var { commentId,id } = useParams();
    var [comment, setComment] = useState({});
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [reactions,setreactions] = useState([]);
    var [allreactions,setallreactions] = useState([]);
    var [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async() => {
            try{
                const user = await axios.get("/users/auth",{
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token")
                    }
                });
                setUsername(user.data.username);
                const response = await axios.get(`/posts/getcomment/${commentId}/${id}`);
                console.log(response.data);
                setComment(response.data)
                setallreactions(response.data.reacts.reverse());
                setreactions(response.data.reacts.reverse());
                setLoading(false);
            }
            catch(error) {
                console.log(error);
                localStorage.clear();
                window.location = "/login";
            }
        }
        fetch();
    },[commentId, id]);

    const changeLike = () => {
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
        setlike(false);    
        setlove(false);
        setlaugh(false);
        setreactions(allreactions);
    }

    var style1 = (like) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style2 = (love) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style3 = (laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style4 = (!like && !love && !laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"} 

    const remove = () => {
        if(username !== "Guest") {
            const drop = async() => {
                try {
                    const response = await axios.post(`/posts/remove/${id}`, comment);
                    console.log(response.data);
                    history.push(`/comment/${comment._id}/${id}`);        
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


    var styling = (comment.name === username) ? {visibility: "visible"} : {visibility: "hidden"};

    const renderUsers = (props, index) => {

        const createRoom = () => {
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

        return (<div className="container user" key={index}>
            <li className="profile"> {props.name} 
            <button onClick={createRoom} className="move-right btn-dark expand"> Chat </button>
            </li>
        </div>);
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
        return (<div>
                <Navbar name={username} page = "comment"/>
                <Heading />
                <div className="container">
                    <div className="container margin">
                    <div className="comment-name">
                        <div> 
                            <span className="name author"> {comment.name} </span>
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
                    <div className="comment-options text-center" style={styling}>
                        <img src={trash} onClick={remove} className="expand one"/>
                    </div>
                    </div>
                    <div className="margin text-center">
                        <h2> Users who reacted: </h2>
                        <button className="btn expand margin one allbtn" onClick={changeAll} style={style4}> All </button> 
                        <button className="btn expand margin one" onClick={changeLike} style={style1}> <img src={liked} name="like" className="expand"/> </button> 
                        <button className="btn expand margin one" onClick={changeLove} style={style2}> <img src={loved} name="love" className="expand"/> </button> 
                        <button className="btn expand margin one" onClick={changeLaugh} style={style3}> <img src={laughed} name="laugh" className="expand"/> </button> 
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
