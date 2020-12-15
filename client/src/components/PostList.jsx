/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import search from "./images/search.png";
import Post from "./Post";

function PostList() {

    let { username } = useParams();
    var [searchContent,setsearchContent] = useState("");
    var [posts,setPosts] = useState([]);

    useEffect(function() {
        axios.get("/posts") 
            .then(function(response) {
                setPosts(response.data.reverse());
            });
    });

    function createPost(props, index) {

        function changepost(event, post) {
            axios.post("/posts/update/" + event.target.name + "/" + post.name, post)
                .then(function(response) {
                    console.log(response.data);
                });
        }

        return <Post 
                key = {index}
                name = {username}
                _id = {props._id}
                author = {props.author}
                title = {props.title}
                content = {props.content}
                like = {props.like}
                love = {props.love}
                laugh = {props.laugh}
                change = {changepost}
        />
    }

    function change_search_content(event) {
        setsearchContent(event.target.value);
    }

    var message = "all";
    function searchIt() {
        window.location = "/result/" + username + "/" + searchContent + "/" + message;
    }

    return (<div>
        <Navbar 
            name = {username}
            page = "home"
        />
        <div className="center-text upper-margin">
            <h1 className="main"> Socialites </h1>
            <h2 className="margin"> All Posts </h2>
            <input type="search" placeholder="Search" onChange={change_search_content}/>
            <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
        </div>
        {posts.map(createPost)}
</div>);
}

export default PostList;

