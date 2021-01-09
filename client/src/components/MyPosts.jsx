/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";
import trash from "./images/trash.png";
import edit from "./images/edit.png";
import Footer from "./Footer";
import CategoryMenu from "./CategoryMenu";
import Heading from "./Heading";
import SearchBar from "./SearchBar";

const MyPosts = () => {

    var history = useHistory();
    var username = localStorage.getItem("username");
    var [posts,setPosts] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            try {
                const response = await axios.get(`/posts/list/${username}`);
                setPosts(response.data.reverse());
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    });

    const MyPost = (props, index) => {

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

        const remove = () => {
            const del = async() => {
                try {
                    const response = await axios.delete(`/posts/delete/${props._id}`);
                    console.log(response.data.reverse());
                }
                catch(error) {
                    console.log(error);
                }
            }
            del();
            history.push(`/myposts`);
        }

        const update = () => {
            history.push(`/edit/${props._id}`);
        }

        return (<div className="container" key ={index}>
         <Post 
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
                show_comments = {true}
                imageUrl = {props.imageUrl}
        />
        <div className="post-options center-text">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={edit} onClick={update} className="expand"/>
        </div>
    </div>);
    }

    return (<div>
        <Navbar page = "myposts"/>
        <Heading />
        <div className="center-text"><h3 className="margin"> My Posts </h3> </div>
        <CategoryMenu category_type = "Select Category" message = "my"/>
        <SearchBar message = "personal" type = "none" />
        {posts.map(MyPost)}
        <div className="space"></div>
        <Footer />
</div>);
}

export default MyPosts;

