/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import Post from "../Post";
import Footer from "../Footer";
import CategoryMenu from "../CategoryMenu";
import Heading from "../Heading";
import SearchBar from "../SearchBar";
import { Spinner } from "react-bootstrap";

const Posts = () => {

    var [username, setUsername] = useState("");
    var [posts,setPosts] = useState([]);
    var [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");

    // useEffect(() => {
    //     if(username === null) {
    //         const getGoogleUser = async() => {
    //             try {
    //                 const response = await axios.get("/auth");
    //                 if(response.data !== "") {
    //                     localStorage.setItem("username", response.data);
    //                 }
    //                 setLoading(false);
    //             }
    //             catch(error) {
    //                 console.log(error);
    //             }
    //         }
    //         getGoogleUser();
    //     }
    // },[username]);

    useEffect(() => {
        const fetch = async () => {
            try {
                if(guest !== "true") {
                    const user = await axios.get("/users/auth",{
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": localStorage.getItem("token")
                        }
                    });
                    setUsername(user.data.username);
                }
                else {
                    setUsername("Guest");
                }
                const response = await axios.get("/posts/");
                setPosts(response.data.reverse());
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                localStorage.clear();
                window.location = "/login";
            }
        };
        fetch(); 
    },[guest]);

    const createPost = (props, index) => {

        const changepost = (event, post) => {
            if(username !== "Guest") {
                const drop = async() => {
                    try {
                        const response = await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                        const res = await axios.get("/posts/");
                        setPosts(res.data);  
                        console.log(response.data);
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
                _id = {props._id}
                author = {props.author}
                title = {props.title}
                content = {props.content}
                category = {props.category}
                like = {props.like}
                love = {props.love}
                laugh = {props.laugh}
                comment_count = {props.comment_count}
                change = {changepost}
                show_comments={true}
                imageUrl = {props.imageUrl}
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
            <Navbar name={username} page = "home"/>
            <Heading />
            <div className="text-center"> <h3 className="margin"> All Posts </h3> </div>
            <CategoryMenu category_type = "Select Category" message = "all" />
            <SearchBar message = "all" type = "none" />
            {posts.map(createPost)}
            <div className="space"></div>
            <Footer />
    </div>);
    }
}

export default Posts;