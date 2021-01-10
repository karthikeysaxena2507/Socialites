/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
import all from "./images/all.png";
import axios from "axios";
import { useHistory } from "react-router-dom";

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

    const addComment = (event) => {
        if(comment.content !== "") {
            const drop = async() => {
                try {
                    const response = await axios.post(`/posts/add/${props._id}`, comment);
                    console.log(response.data);
                    history.push(`/complete/${props._id}`);
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    const changePost = (event) => {
        props.change(event, props);
    }        

    const SeeAll = () => {
        history.push(`/post/${props._id}`);
    }

    const SeeComplete = () => {
        history.push(`/complete/${props._id}`);
    }

    var visibility = (props.show_comments) ? {visibility: "visible"}:{visibility: "hidden"};

    var image = (props.imageUrl === "") ? {visibility: "hidden"} : {visibility: "visible"};
    
    return(<div className="container margin post"> 
        <div className="post-title"> 
            <h2> {props.title} </h2>
            <span> by </span>
            <span className="author expand"> {props.author} </span>
            <span className="move-right"> <i> #{props.category} </i> </span>
        </div>
        <div className="post-content">
            {props.content}
            <div className="margin text-center">
                <img src={props.imageUrl} style={image} className="post-image" alt="image not found"/>
            </div>
        </div>
        <div className="post-info"> 
            <span className="one">
             <img
                src={like} 
                name="like" 
                onClick={changePost} 
                className="expand one"/>
                <span onClick={SeeAll} > {props.like} </span>
            </span>
            <span className="one">
             <img 
                src={love} 
                name="love" 
                onClick={changePost} 
                className="expand one"/>
                <span onClick={SeeAll} > {props.love} </span>
            </span>
            <span className="one">
             <img 
                src={laugh} 
                name="laugh" 
                onClick={changePost} 
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
                <a onClick={SeeComplete} style={visibility} className="expand"> {props.comment_count} comments </a>
                <button onClick={addComment} className="move-right btn-dark expand"> Add Comment </button>
            </div>
        </div>
    </div>);
}

export default Post;