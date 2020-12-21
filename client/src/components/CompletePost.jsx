/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import Navbar from "./Navbar";
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
import trash from "./images/trash.png";
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

        function reactToComment(event) {
            axios.post("/posts/comment/" + event.target.name + "/" + id + "/" + username, props)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }

        function remove() {
            axios.post("/posts/remove/" + id, props) 
                .then((response) => {
                    console.log(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        function SeeAll() {
            window.location = "/comment/" + username + "/" + props._id + "/" + id;
        }

        var style1 = (props.name === username) ? {visibility: "visible"} : {visibility: "hidden"}

        return <div className="container margin" key={index}>
        <div className="comment-name">
            <div> 
                <span className="name"> {props.name} </span>
            </div>
            <div>
                <span className="move-right"> 
                    <span className="one">
                        <img 
                            src={like}   
                            name = "likes"
                            onClick={reactToComment}
                            className="expand one"/> 
                            {props.likes}
                    </span>
                    <span className="one">
                        <img 
                            src={love}   
                            onClick={reactToComment}
                            name = "loves"
                            className="expand one"/> 
                            {props.loves}
                    </span>
                    <span className="one">
                        <img 
                            src={laugh}   
                            onClick={reactToComment}
                            name = "laughs"
                            className="expand one"/> 
                            {props.laughs}
                    </span>
                    <span className="all">
                        <a onClick={SeeAll} className="expand"> All </a> 
                    </span>
                </span> 
            </div>
        </div>
        <div className="comment-content"> {props.content} </div>            
        <div className="comment-options center-text" style={style1}>
            <img src={trash} onClick={remove} className="expand one"/>
        </div>
    </div>
    }

    return (<div className="container">
    <Navbar 
            name = {username}
            page = "complete"
        />

    <div className="upper-margin">
        <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
        <Post 
                key = {id}
                name = {username}
                _id = {id}
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
        {post.comments.map(createComment)}
    </div>
    <div className="space"></div>
    <Footer />
    </div>);
}

export default CompletePost;