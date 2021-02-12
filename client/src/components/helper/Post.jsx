/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import like from "../../images/like.png";
import love from "../../images/love.png";
import laugh from "../../images/laugh.png";
import all from "../../images/all.png";
import { useHistory } from "react-router-dom";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { addCommentToPost } from "../../api/postApis";
var sound = new Howl({src: [music]});

const Post = (props) => {

    var history = useHistory();
    var [comment, setComment] = useState({name:props.name, content:"", likes:0, loves:0, laughs:0, reacts:[]});

    const change = (event) => {
        var {name, value} = event.target;

        setComment((prevPost) => {
        return {
          ...prevPost,
          [name]: value
        };
      });
    }

    const addComment = () => {
        sound.play();
        if(props.name !== "Guest") {
            if(comment.content !== "") {
                const drop = async() => {
                    try {
                        await addCommentToPost(props._id, comment);
                        window.location = `/complete/${props._id}`;
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }
            else {
                alert("comment cannot be empty");
            }
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    }

    const changePost = (e) => {
        sound.play();
        props.change(e, props);
    }        

    const check = (type) => {
        const reactions = props.reactions;
        let flag = false;
        for(let reaction of reactions) {
            if(reaction.name === props.name && reaction.type === type) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    const SeeAll = () => {
        sound.play();
        history.push(`/post/${props._id}`);
    }

    const SeeComplete = () => {
        sound.play();
        history.push(`/complete/${props._id}`);
    }

    const SeeProfile = (e) => {
        sound.play();
        history.push(`/profile/${e.target.innerText}`);
    }
    
    return(<div className="container margin post"> 
        <div className="post-title"> 
            <h2> {props.title} </h2>
            <span> by </span>
            <span className="author expand" onClick={SeeProfile}> {props.author} </span>
            <span className="move-right"> <i> #{props.category} </i> </span>
        </div>
        <div className="post-content">
            {props.content}
            <div className="margin text-center">
                <img src={props.imageUrl} style={(props.imageUrl === "") ? {visibility: "hidden"} : {visibility: "visible"}} className="post-image" alt="image not found"/>
            </div>
        </div>
        <div className="post-info"> 
            <span className="one">
             <img
                src={like} 
                name="like" 
                onClick={changePost} 
                style={check("like") ? {backgroundColor: "white", padding: "5px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                className="expand one"/>
                <span onClick={SeeAll} > {props.like} </span>
            </span>
            <span className="one">
             <img 
                src={love} 
                name="love" 
                onClick={changePost} 
                style={check("love") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                className="expand one"/>
                <span onClick={SeeAll} > {props.love} </span>
            </span>
            <span className="one">
             <img 
                src={laugh} 
                name="laugh" 
                onClick={changePost} 
                style={check("laugh") ? {backgroundColor: "white", padding: "2px 5px", borderRadius: "5px", border: "2px solid brown"} : null}
                className="expand one"/>
                <span onClick={SeeAll} > {props.laugh} </span>
            </span>
            <span className="all">
                <a onClick={SeeAll} className="expand"> All </a> 
            </span>
            <span className="move-right">
             <img 
                src={all} 
                name="arrow" 
                onClick={SeeAll} 
                className="expand"/> 
                <span onClick={SeeAll} > {props.laugh + props.love + props.like} </span>
            </span>
            <div className="margin">
                <input type="text" onChange={change} name="content" value={comment.content} placeholder="Add a Comment" required/>
            </div>
            <div className="comment">
                <a onClick={SeeComplete} style={(props.show_comments) ? {visibility: "visible"}:{visibility: "hidden"}} className="expand"> {props.comment_count} comments </a>
                <button onClick={addComment} className="move-right btn-dark expand"> Add Comment </button>
            </div>
        </div>
    </div>);
}

export default Post;