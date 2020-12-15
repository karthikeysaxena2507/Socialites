/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";
import trash from "./images/trash.png";
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

        function changepost(event, post) {
            axios.post("/posts/update/" + event.target.name + "/" + post.name, post)
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

        return (<div className="container">
         <Post 
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
        <div className="post-options center-text">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={edit} onClick={update} className="expand"/>
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

