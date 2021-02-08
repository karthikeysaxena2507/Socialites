/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../helper/Navbar";
import Post from "../helper/Post";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import Fuse from "fuse.js";
import Loader from "../helper/Loader";
import { checkUser } from "../../api/userApis";
import { getAllPosts, getPostsByUser } from "../../api/postApis";

const Result = () => {

    var [username, setUsername] = useState("");
    var { searchContent,message,type } = useParams();
    var [foundPosts,setfoundPosts] = useState([]);
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");

    useEffect(() => {
        if(message === "all") {
            const fetch = async() => {
                try {
                    if(guest !== "true") {
                        const user = await checkUser();
                        (user === "INVALID") ? window.location = "/login" : setUsername(user.username);
                    }
                    else {
                        setUsername("Guest");
                    }
                    const postsData = await getAllPosts();
                    setLoading(false);
                    const fuse = new Fuse(postsData, {
                        keys: ['author', 'title', 'content'],
                        includeScore: true,
                        includeMatches: true
                    });
                    const results = fuse.search(searchContent);
                    setfoundPosts(results.reverse());
                    if(type !== "none") {
                        setfoundPosts(results.filter((post) => {
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
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username);
                    const postsData = await getPostsByUser(user.username);
                    setLoading(false);
                    const fuse = new Fuse(postsData, {
                        keys: ['author', 'title', 'content'],
                        includeScore: true,
                        includeMatches: true
                    });
                    const results = fuse.search(searchContent);
                    setfoundPosts(results.reverse());
                    if(type !== "none") {
                        setfoundPosts(results.filter((post) => {
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
    },[guest, message, searchContent, type, username]);

    const createPost = (props, index) => {

        const changepost = (event, post) => {
            if(username !== "Guest") {
                const drop = async() => {
                    try {
                        const res = await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                        console.log(res.data);
                        var response;
                        if(message === "all") {
                            response = await axios.get("/posts");
                        }
                        else if(message === "personal") {
                            response = await axios.get(`/posts/list/${username}`);
                        }
                        const fuse = new Fuse(response.data, {
                            keys: ['author', 'title', 'content'],
                            includeScore: true,
                            includeMatches: true
                        });
                        const results = fuse.search(searchContent);
                        setfoundPosts(results.reverse());
                        if(type !== "none") {
                            setfoundPosts(results.filter((post) => {
                                return (post.item.category === type);
                            }));
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }
            else {
                alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
            }
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

    if(loading) {
        return <Loader />
    }
    else {
        return (<div>
            <Navbar name={username} page = "result"/>
            <Heading />
            <div className="text-center"> <h2 className="margin"> Search Results </h2> </div>
            {foundPosts.reverse().map(createPost)}
            <div className="space"></div>
            <Footer />
    </div>);
    }
}

export default Result;


