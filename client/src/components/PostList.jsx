/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
import all from "./images/all.png";
import arrow from "./images/arrow.png";

function PostList() {

    let { username } = useParams();

    var [posts,setPosts] = useState([]);

    useEffect(function() {
        axios.get("/posts") 
            .then(function(response) {
                setPosts(response.data.reverse());
            });
    });

    function createPost(props, index) {

        function change(event) {
            axios.post("/posts/update/" + event.target.name + "/" + username, props)
                .then(function(response) {
                    console.log(response.data);
                });
        }        

        function SeeAll() {
            window.location = "/post/" + props._id;
        }

        return(<div className="container margin post" key={index}> 
            <div className="post-title"> <h2> {props.title} </h2>  by {props.author} </div>
            <div className="post-content"> {props.content} </div>
            <div className="post-info"> 
                <span className="one">
                 <img
                    src={like} 
                    name="like" 
                    onClick={change} 
                    className="expand one"/>
                    <span onClick={SeeAll} > {props.like} </span>
                </span>
                <span className="one">
                 <img 
                    src={love} 
                    name="love" 
                    onClick={change} 
                    className="expand one"/>
                    <span onClick={SeeAll} > {props.love} </span>
                </span>
                <span className="one">
                 <img 
                    src={laugh} 
                    name="laugh" 
                    onClick={change} 
                    className="expand one"/>
                    <span onClick={SeeAll} > {props.laugh} </span>
                </span>
                <span className="one">
                 <img 
                    src={arrow} 
                    name="laugh" 
                    onClick={SeeAll} 
                    className="expand one"/>
                </span>
                <span className="one move-right">
                 <img 
                    src={all} 
                    name="arrow" 
                    onClick={SeeAll} 
                    className="expand one"/> 
                    <span onClick={SeeAll} > {props.laugh + props.love + props.like} </span>
                </span>
            </div>
        </div>);
    }
    const link1 = "/myposts/" + username;;
    const link2 = "/create/" + username;;

    return (<div>
        <div className="center-text margin">
            <h2> All Posts </h2>
        </div>
        <div className="center-text">
            <Link to={link1}>
                <button className="btn btn-dark expand margin one" > My Posts </button> 
            </Link>
            <Link to={link2}>
                <button className="btn btn-dark expand margin one" > Create a Post </button> 
            </Link>
            <Link to="/">
                <button className="btn btn-dark expand margin one"> LogOut </button> 
            </Link>
        </div>
        {posts.map(createPost)}
</div>);
}

export default PostList;

