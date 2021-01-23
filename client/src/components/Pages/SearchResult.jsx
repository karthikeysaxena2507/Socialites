/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Post from "../Post";
import Footer from "../Footer";
import Heading from "../Heading";
import Fuse from "fuse.js";
import { Spinner } from "react-bootstrap";

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
                        var token = localStorage.getItem("token");
                        if(token === null) token = sessionStorage.getItem("token");
                        const user = await axios.get("/users/auth",{
                            headers: {
                                "Content-Type": "application/json",
                                "x-auth-token": token
                            }
                        });
                        setUsername(user.data.username);
                    }
                    else {
                        setUsername("Guest");
                    }
                    const response = await axios.get("/posts");
                    setLoading(false);
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
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location = "/login";
                }
            }
            fetch();
        }
        else if(message === "personal") {
            const fetch = async() => {
                try {
                    var token = localStorage.getItem("token");
                    if(token === null) token = sessionStorage.getItem("token");
                    const user = await axios.get("/users/auth",{
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": token
                        }
                    });
                    setUsername(user.data.username);
                    const response = await axios.get(`/posts/list/${username}`);
                    setLoading(false);
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
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location = "/login";
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
        return (<div className="text-center upper-margin"> 
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> </span>
    </div>)
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


