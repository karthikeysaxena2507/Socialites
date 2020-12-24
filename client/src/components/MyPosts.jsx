/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Post from "./Post";
import trash from "./images/trash.png";
import edit from "./images/edit.png";
import search from "./images/search.png";
import Footer from "./Footer";
import CategoryMenu from "./CategoryMenu";
import Heading from "./Heading";

const MyPosts = () => {

    let { username } = useParams();
    var [searchContent,setsearchContent] = useState("");
    var [posts,setPosts] = useState([]);

    useEffect(() => {
        axios.get(`/posts/list/${username}`) 
            .then((response) => {
                setPosts(response.data);
            })
            .catch((response) => {
                console.log(response);
            });
    });

    const MyPost = (props, index) => {

        const changepost = (event, post) => {
            axios.post(`/posts/update/${event.target.name}/${post.name}`, post)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((response) => {
                    console.log(response);
                });
        }

        const remove = () => {
            axios.delete(`/posts/delete/${props._id}`)
                .then((response) => {
                    console.log(response.data.reverse());
                })
                .catch((response) => {
                    console.log(response);
                });
            window.location = `/myposts/${username}`;
        }

        const update = () => {
            window.location = `/edit/${username}/${props._id}`;
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
        />
        <div className="post-options center-text">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={edit} onClick={update} className="expand"/>
        </div>
    </div>);
    }

    const change_search_content = (event) => {
        setsearchContent(event.target.value);
    }

    var message = "personal";
    var type = "none";
    const searchIt = () => {
        window.location = `/result/${username}/${searchContent}/${message}/${type}`;
        setsearchContent("");
    }
    
    return (<div>
        <Navbar 
        name = {username}
        page = "myposts"
        />
        <Heading />
        <div className="center-text">
            <h3 className="margin"> My Posts </h3>
            <CategoryMenu
                name = {username}
                category_type = "Select Category"
                message = "my"
            />
            <input type="search" placeholder="Search" className="width" onChange={change_search_content}/>
            <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
        </div>
        <div>
            {posts.map(MyPost)}
        </div>
        <div className="space"></div>
        <Footer />
</div>);
}

export default MyPosts;

