/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import trash from "./images/trash.png";
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
// import liked from "./images/laughed.png";
// import loved from "./images/loved.png";
// import laughed from "./images/laughed.png";

function MyPosts() {

    let { username } = useParams();

    var [posts,setPosts] = useState([]);

    useEffect(function() {
        axios.get("/posts/list/" + username) 
            .then(function(response) {
                setPosts(response.data.reverse());
            });
    },[username]);

    function MyPost(props, index) {

        function change() {
        axios.delete("/posts/delete/" + props._id)
            .then(function(response) {
                console.log(response.data.reverse());
            });
            window.location = "/myposts/" + username;
        }
    
        return(<div className="container margin post" key={index}> 
            <div className="post-title"> <h2> {props.title} </h2>  by {props.author} </div>
            <div className="post-content"> {props.content} </div>
            <div className="post-info"> 
                <span className="one"> <img src={like} name="like" className="expand"/>  {props.like.length} </span>
                <span className="one"> <img src={love} name="love" className="expand"/>  {props.love.length} </span>
                <span className="one"> <img src={laugh} name="laugh" className="expand"/>  {props.laugh.length} </span>
                <span> <img src={trash} onClick={change} className="trash expand"/> </span>
            </div>
        </div>);
    }
    

    let link1 = "/posts/" + username;
    let link2 = "/create/" + username;

    return (<div>
        <div className="center-text margin">
            <h2> My Posts </h2>
        </div>
        <div className="center-text">
            <Link to={link1}>
                <button className="btn btn-dark expand margin one" > See All Posts </button> 
            </Link>
            <Link to={link2}>
                <button className="btn btn-dark expand margin one" > Create a Post </button> 
            </Link>
            <Link to="/">
                <button className="btn btn-dark expand margin" > Logout </button> 
            </Link>
        </div>
        <div>
            {posts.map(MyPost)}
        </div>
</div>);
}

export default MyPosts;

