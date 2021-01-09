/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams,useHistory } from "react-router-dom";
import axios from "axios";
import liked from "./images/like.png";
import loved from "./images/love.png";
import laughed from "./images/laugh.png";
import trash from "./images/trash.png";
import Heading from "./Heading";
import InvalidUser from "./InvalidUser";

const CompleteComment = () => {

    var history = useHistory();
    var username = localStorage.getItem("username");
    var { commentId,id } = useParams();
    var [comment, setComment] = useState({});
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [reactions,setreactions] = useState([]);
    var [allreactions,setallreactions] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            try{
                const response = await axios.get(`/posts/getcomment/${commentId}/${id}`);
                console.log(response.data);
                setComment(response.data)
                setallreactions(response.data.reacts.reverse());
                setreactions(response.data.reacts.reverse());
            }
            catch(error) {
                console.log(error);
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


    var styling = (comment.name === username) ? {visibility: "visible"} : {visibility: "hidden"};

    const renderUsers = (props, index) => {
        return (<div className="container user" key={index}>
            <li className="profile"> {props.name} </li>
        </div>);
    }

    const Check = () => {
        if(username === null) {
            return (
                <InvalidUser />
            )
        }
        else {
            return (<div>
                <Navbar page = "comment"/>
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
                    <div className="comment-options center-text" style={styling}>
                        <img src={trash} onClick={remove} className="expand one"/>
                    </div>
                </div>
                    <div className="margin center-text">
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

    return <Check />;

}

export default CompleteComment;
