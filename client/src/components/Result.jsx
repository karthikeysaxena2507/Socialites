/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
import all from "./images/all.png";
import arrow from "./images/arrow.png";

function Result() {

    let { username,searchContent,message } = useParams();
    var [foundPosts,setfoundPosts] = useState([]);

    useEffect(function() {
        if(message === "all") {
            axios.get("/posts") 
            .then(function(response) {
                setfoundPosts(response.data.reverse().filter(function(post) {
                    return ((post.title.indexOf(searchContent) !== -1) || 
                    (post.author.indexOf(searchContent) !== -1) ||
                    (post.content.indexOf(searchContent) !== -1)
                    )
                }));
            });    
        }
        else {
            axios.get("/posts/list/" + username) 
            .then(function(response) {
                setfoundPosts(response.data.reverse().filter(function(post) {
                    return ((post.title.indexOf(searchContent) !== -1) || 
                    (post.author.indexOf(searchContent) !== -1) ||
                    (post.content.indexOf(searchContent) !== -1)
                    )
                }));
            });
        }
    });

    function makePost(props, index) {

        function change(event) {
            axios.post("/posts/update/" + event.target.name + "/" + username, props)
                .then(function(response) {
                    console.log(response.data);
                });
        }        

        function SeeAll() {
            window.location = "/post/" + username + "/" + props._id;
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

    return (<div>
        <Navbar 
            name = {username}
            page = "result"
        />
        <div className="center-text upper-margin">
            <h2 className="margin"> Search Results </h2>
        </div>
        {foundPosts.map(makePost)}
</div>);
}

export default Result;

