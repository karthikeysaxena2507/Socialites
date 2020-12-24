/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import search from "./images/search.png";
import CategoryMenu from "./CategoryMenu";
import Heading from "./Heading";

const CategoryPosts = () => {

    let { username,type } = useParams();
    var [searchContent,setsearchContent] = useState("");
    var [posts,setPosts] = useState([]);

    useEffect(() => {
        axios.get("/posts") 
            .then((response) => {
                setPosts(response.data.reverse().filter((post) => {
                    return (post.category === type);
                }));
            })
            .catch((response) => {
                console.log(response);
            });
    });

    const createPost = (props, index) => {

        const changepost = (event, post) => {
            axios.post(`/posts/update/${event.target.name}/${post.name}`, post)
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
                category = {props.category}
                like = {props.like}
                love = {props.love}
                laugh = {props.laugh}
                comment_count = {props.comment_count}
                change = {changepost}
                show_comments={true}
        />
    }

    const change_search_content = (event) => {
        setsearchContent(event.target.value);
    }

    var message = "all";
    const searchIt = () => {
        window.location = `/result/${username}/${searchContent}/${message}/${type}`;
        setsearchContent("");
    }
    
    return <div>
        <Navbar 
            name = {username}
            page = "home"
        />
        <Heading />
        <div className="container center-text margin">
            <h3 className="margin"> All Posts </h3>
            <CategoryMenu
                name = {username}
                category_type = {type}
                message = "all"
            />
            <div className="margin container center-text">
                <input type="search" placeholder="Search" className="width" onChange={change_search_content}/>
                <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
            </div>
        </div>
        {posts.map(createPost)}
        <div className="space"></div>
        <Footer />
    </div>
}

export default CategoryPosts;