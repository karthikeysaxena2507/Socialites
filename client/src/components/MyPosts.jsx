/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import trash from "./images/trash.png";
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
import edit from "./images/edit.png";
import search from "./images/search.png";

function MyPosts() {

    let { username } = useParams();
    var [searchContent,setsearchContent] = useState("");
    var [posts,setPosts] = useState([]);

    useEffect(function() {
        axios.get("/posts/list/" + username) 
            .then(function(response) {
                setPosts(response.data.reverse());
            });
    });

    function MyPost(props, index) {

        function change(event) {
            axios.post("/posts/update/" + event.target.name + "/" + username, props)
                .then(function(response) {
                    console.log(response.data);
                });
        }

        function remove() {
            axios.delete("/posts/delete/" + props._id)
                .then(function(response) {
                    console.log(response.data.reverse());
                });
            window.location = "/myposts/" + username;
        }

        function update() {
            window.location = "/edit/" + username + "/" + props._id;
        }
    
        return(<div className="container margin post" key={index}> 
            <div className="post-title"> <h2> {props.title} </h2>  by {props.author} </div>
            <div className="post-content"> {props.content} </div>
            <div className="post-info"> 
                <span className="one"> <img src={like} name="like" onClick={change} className="expand"/>  {props.like} </span>
                <span className="one"> <img src={love} name="love" onClick={change} className="expand"/>  {props.love} </span>
                <span className="one"> <img src={laugh} name="laugh" onClick={change} className="expand"/>  {props.laugh} </span>
                <span> <img src={trash} onClick={remove} className="move-right expand one"/> </span>
                <span> <img src={edit} onClick={update} className="move-right expand one"/> </span>
            </div>
        </div>);
    }

    function change_search_content(event) {
        setsearchContent(event.target.value);
    }

    var message = "personal";
    function searchIt() {
        window.location = "/result/" + username + "/" + searchContent + "/" + message;
    }

    return (<div>
        <Navbar 
        name = {username}
        page = "myposts"
        />
        <div className="center-text upper-margin">
            <h2> My Posts </h2>
            <input type="search" placeholder="Search" onChange={change_search_content}/>
            <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
        </div>
        <div>
            {posts.map(MyPost)}
        </div>
</div>);
}

export default MyPosts;

