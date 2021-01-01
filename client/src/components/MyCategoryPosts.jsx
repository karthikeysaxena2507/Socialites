/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import trash from "./images/trash.png";
import edit from "./images/edit.png";
import CategoryMenu from "./CategoryMenu";
import Heading from "./Heading";
import SearchBar from "./SearchBar";

const MyCategoryPosts = () => {

    let { username,type } = useParams();
    var [posts,setPosts] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            try {
                const response = await axios.get(`/posts/list/${username}`);
                setPosts(response.data.reverse().filter((post) => {
                    return (post.category === type);
                }));
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
                imageUrl = {props.imageUrl}
        />
        <div className="post-options center-text">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={edit} onClick={update} className="expand"/>
        </div>
    </div>);
    }

    return (<div>
    <Navbar 
            name = {username}
            page = "myposts"
        />
    <Heading />
    <div className="center-text">
        <h3 className="margin"> My Posts </h3>
    </div>
    <CategoryMenu
        name = {username}
        category_type = {type}
        message = "my"
        />
    <SearchBar 
        name = {username}
        type = {type}
        message = "personal"
    />
    {posts.map(MyPost)}
    <div className="space"></div>
    <Footer />
    </div>);
}

export default MyCategoryPosts;