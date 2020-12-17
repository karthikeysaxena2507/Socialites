/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";

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
            })
            .catch(function(response) {
                console.log(response);
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
            })
            .catch(function(response) {
                console.log(response);
            });
        }
    });

    function makePost(props, index) {

        return <Post 
                username = {username}
                id = {props._id}
                author = {props.author}
                title = {props.title}
                content = {props.content}
                like = {props.like}
                love = {props.like}
                laugh = {props.laugh}
        />
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

