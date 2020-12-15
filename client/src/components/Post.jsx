/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
import all from "./images/all.png";


function Post(props) {
    function changePost(event) {
        props.change(event, props);
    }        

    function SeeAll() {
        window.location = "/post/" + props.name + "/" + props._id;
    }

    return(<div className="container margin post"> 
        <div className="post-title"> <h2> {props.title} </h2>  by {props.author} </div>
        <div className="post-content"> {props.content} </div>
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
            <span>
                <span onClick={SeeAll} className="expand one all"> All </span> 
            </span>
            <span className="move-right">
             <img 
                src={all} 
                name="arrow" 
                onClick={SeeAll} 
                className="expand"/> 
                <span onClick={SeeAll} > {props.laugh + props.love + props.like} </span>
            </span>
        </div>
    </div>);
}

export default Post;