/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";
import Footer from "./Footer";
import Heading from "./Heading";
import Fuse from "fuse.js";

const Result = () => {

    let { username,searchContent,message,type } = useParams();
    var [foundPosts,setfoundPosts] = useState([]);

    useEffect(() => {

        if(message === "all") {
            const fetch = async() => {
                try {
                    const response = await axios.get("/posts");
                    const fuse = new Fuse(response.data, {
                        keys: ['author', 'title', 'content'],
                        includeScore: true,
                        includeMatches: true
                    });
                    const results = fuse.search(searchContent);
                    setfoundPosts(results.reverse());
                    if(type !== "none") {
                        setfoundPosts(results.reverse().filter((post) => {
                            return (post.item.category === type);
                        }));
                    }
                }
                catch(error) {
                    console.log(error);
                }
            }
            fetch();
        }
        else if(message === "personal") {
            const fetch = async() => {
                try {
                    const response = await axios.get(`/posts/list/${username}`);
                    const fuse = new Fuse(response.data, {
                        keys: ['author', 'title', 'content'],
                        includeScore: true,
                        includeMatches: true
                    });
                    const results = fuse.search(searchContent);
                    setfoundPosts(results.reverse());
                    if(type !== "none") {
                        setfoundPosts(results.reverse().filter((post) => {
                            return (post.item.category === type);
                        }));
                    }
                }
                catch(error) {
                    console.log(error);
                }
            }
            fetch();
        }
    });

    const createPost = (props, index) => {

        const changepost = (event, post) => {
            const drop = async() => {
                try {
                    const response = await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                    console.log(response.data);
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }

        return <Post 
                key = {index}
                name = {username}
                _id = {props.item._id}
                author = {props.item.author}
                title = {props.item.title}
                content = {props.item.content}
                category = {props.item.category}
                like = {props.item.like}
                love = {props.item.love}
                laugh = {props.item.laugh}
                comment_count = {props.item.comment_count}
                change = {changepost}
                show_comments = {true}
                imageUrl = {props.item.imageUrl}
            />
    }

    return (<div>
        <Navbar 
            name = {username}
            page = "result"
        />
        <Heading />
        <div className="center-text">
            <h2 className="margin"> Search Results </h2>
        </div>
        {foundPosts.map(createPost)}
        <div className="space"></div>
        <Footer />
</div>);
}

export default Result;

