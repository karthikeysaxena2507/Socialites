/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";
import Footer from "./Footer";

function Result() {

    let { username,searchContent,message } = useParams();
    var [foundPosts,setfoundPosts] = useState([]);

    useEffect(() => {
        if(message === "all") {
            axios.get("/posts") 
            .then((response) => {
                setfoundPosts(response.data.reverse().filter(function(post) {
                    return ((post.title.indexOf(searchContent) !== -1) || 
                    (post.author.indexOf(searchContent) !== -1) ||
                    (post.content.indexOf(searchContent) !== -1)
                    )
                }));
            })
            .catch((response) => {
                console.log(response);
            });
        }
        else {
            axios.get("/posts/list/" + username) 
            .then((response) => {
                setfoundPosts(response.data.reverse().filter(function(post) {
                    return ((post.title.indexOf(searchContent) !== -1) || 
                    (post.author.indexOf(searchContent) !== -1) ||
                    (post.content.indexOf(searchContent) !== -1)
                    )
                }));
            })
            .catch((response) => {
                console.log(response);
            });
        }
    });

    function makePost(props, index) {

        function changepost(event, post) {
            axios.post("/posts/update/" + event.target.name + "/" + post.name, post)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((response) => {
                    console.log(response);
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
                comment_count = {props.comment_count}
                change = {changepost}
                show_comments={true}
        />
    }

    return (<div>
        <Navbar 
            name = {username}
            page = "result"
        />
        <div className="center-text upper-margin">
        <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
            <h2 className="margin"> Search Results </h2>
        </div>
        {foundPosts.map(makePost)}
        <div className="space"></div>
        <Footer />
</div>);
}

export default Result;

