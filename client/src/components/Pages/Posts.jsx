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
import Loader from "../Loader";

const Posts = () => {

    var [username, setUsername] = useState("");
    var [posts,setPosts] = useState([]);
    var [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");

    useEffect(() => {
        const fetch = async () => {
            try {
                var token = localStorage.getItem("token");
                if(token === null) token = sessionStorage.getItem("token");
                if(guest !== "true") {
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
                const response = await axios.get("/posts/");
                setPosts(response.data.reverse());
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                localStorage.clear();
                sessionStorage.clear();
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
                        await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                        const res = await axios.get("/posts/");
                        setPosts(res.data.reverse());  
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
        return <Loader />
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