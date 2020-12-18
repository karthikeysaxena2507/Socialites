/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import Navbar from "./Navbar";
import all from "./images/all.png";
import Footer from "./Footer";

function CompletePost() {
    let { username,id } = useParams();

    var [post,setPost] = useState({author:"", title:"", content:"", comments:[], comment_count:0, like:0, love:0, laugh:0});

    useEffect(() => {
        axios.get("/posts/" + id)
            .then((response) => {
                setPost(response.data[0]);
            })
            .catch( (err) => {
                console.log(err);
            })
    });

    function changepost(event, post) {
        axios.post("/posts/update/" + event.target.name + "/" + post.name, post)
            .then((response) => {
                console.log(response.data);
            })
            .catch((response) => {
                console.log(response);
            });
    }

    function createComment(props, index) {
        return <div className="container margin" key={index}>
            <div className="comment-name"> <span className="name"> {props.name} </span>
             <span className="move-right"> 
             <img 
                src={all} 
                name="arrow"  
                className="expand"/> 
                0
             </span> </div>
            <div className="comment-content"> {props.content} </div>            
        </div>
    }

    return (<div className="container">
    <Navbar 
            name = {username}
            page = "complete"
        />
    <div className="upper-margin">
        <Post 
                key = {post._id}
                name = {username}
                _id = {post._id}
                author = {post.author}
                title = {post.title}
                content = {post.content}
                like = {post.like}
                love = {post.love}
                laugh = {post.laugh}
                comment_count = {post.comments.length}
                change = {changepost}
                show_comments = {false}
        />
        <h3 className="margin center-text"> Comments </h3>
        {post.comments.reverse().map(createComment)}
    </div>
    <Footer />
    </div>);
}

export default CompletePost;