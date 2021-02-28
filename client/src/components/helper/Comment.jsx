/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import music from "../../sounds/button.mp3";
import { Howl } from "howler";
import like from "../../images/like.png";
import love from "../../images/love.png";
import laugh from "../../images/laugh.png";
import trash from "../../images/trash.png";
import { createChat } from "../../api/roomApis";
var sound = new Howl({src: [music]});

const Comment = (props) => {

    const createRoom = async() => {
        try {
            sound.play();
            let room = (props.username < props.name) ? (props.username + "-" + props.name) : (props.name + "-" + props.username);
            await createChat(room, props.username, props.name);
            window.location = `/room/${room}`;
        }
        catch(error) {
            console.log(error);
        }
    }

    const check = (type) => {
        const reactions = props.reacts;
        for(let reaction of reactions) {
            if(reaction.name === props.username && reaction.type === type) {
                return true;
            }
        }
        return false;
    }

    return (
    <div className="container margin">
        <div className="comment-name">
            <div> 
                <span className="name author" onClick={(e) => {sound.play(); window.location = (`/profile/${e.target.innerText}`)}}> {props.name} </span>
                <button 
                    onClick={() => (props.username !== "Guest") ? createRoom() : alert(props.guestMessage)} 
                    style={(props.name === props.username) ? {display: "none"} : null} 
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
                            onClick={(e) => {sound.play(); props.change(e)}}
                            style={check("likes") ? {backgroundColor: "white", padding: "5px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                            className="expand one"
                        /> 
                        {props.likes}
                    </span>
                    <span className="one">
                        <img 
                            src={love}   
                            onClick={(e) => {sound.play(); props.change(e)}}
                            name = "loves"
                            style={check("loves") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                            className="expand one"
                        /> 
                        {props.loves}
                    </span>
                    <span className="one">
                        <img 
                            src={laugh}   
                            onClick={(e) => {sound.play(); props.change(e)}}
                            name = "laughs"
                            style={check("laughs") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                            className="expand one"
                        /> 
                        {props.laughs}
                    </span>
                    <span className="all">
                        <a onClick={() => {sound.play(); window.location = `/comment/${props._id}/${props.id}`}} className="expand"> All </a> 
                    </span>
                </span> 
            </div>
        </div>
        <div className="comment-content"> {props.content} </div>            
        <div className="comment-options text-center" style={(props.name === props.username) ? {visibility: "visible"} : {visibility: "hidden"}}>
            <img src={trash} onClick={() => {sound.play(); props.remove()}} className="expand one"/>
        </div>
    </div>);
}

export default Comment;