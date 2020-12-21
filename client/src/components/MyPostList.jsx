/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";
import trash from "./images/trash.png";
import edit from "./images/edit.png";
import search from "./images/search.png";
import Footer from "./Footer";

function MyPosts() {

    let { username } = useParams();
    var [searchContent,setsearchContent] = useState("");
    var [posts,setPosts] = useState([]);

    useEffect(function() {
        axios.get("/posts/list/" + username) 
            .then((response) => {
                setPosts(response.data);
            })
            .catch((response) => {
                console.log(response);
            });
    });

    function MyPost(props, index) {

        function changepost(event, post) {
            axios.post("/posts/update/" + event.target.name + "/" + post.name, post)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((response) => {
                    console.log(response);
                });
        }

        function remove() {
            axios.delete("/posts/delete/" + props._id)
                .then((response) => {
                    console.log(response.data.reverse());
                })
                .catch((response) => {
                    console.log(response);
                });
            window.location = "/myposts/" + username;
        }

        function update() {
            window.location = "/edit/" + username + "/" + props._id;
        }

        return (<div className="container" key ={index}>
         <Post 
                name = {username}
                _id = {props._id}
                author = {props.author}
                title = {props.title}
                content = {props.content}
                like = {props.like}
                love = {props.love}
                laugh = {props.laugh}
                comment_count = {props.comment_count}
                change = {changepost}
                show_comments = {true}
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
        <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
            <h2> My Posts </h2>
            <input type="search" placeholder="Search" onChange={change_search_content}/>
            <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
        </div>
        <div>
            {posts.map(MyPost)}
        </div>
        <div className="space"></div>
        <Footer />
</div>);
}

export default MyPosts;

