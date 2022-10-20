/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../helper/Navbar";
import Post from "../helper/Post";
import Footer from "../helper/Footer";
import CategoryMenu from "../helper/CategoryMenu";
import Heading from "../helper/Heading";
import SearchBar from "../helper/SearchBar";
import Loader from "../helper/Loader";
import { checkUser } from "../../api/userApis"
import { MessageContext } from "../../utils/Context";
import { getAllPosts, addReactionToPost,  } from "../../api/postApis";

let Posts = () => {

    let [username, setUsername] = useState("");
    let [posts,setPosts] = useState([]);
    let [loading, setLoading] = useState(true);
    let guest = localStorage.getItem("Guest");
    let [unread, setUnread] = useState(0);
    let guestMessage = useContext(MessageContext);

    useEffect(() => {
        let fetch = async () => {
            try {
                if(guest !== "true") {
                    let user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
                let postsData = await getAllPosts();
                setPosts(postsData);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetch(); 
    },[guest]);

    let createPost = (props) => {

        let addReaction = async(event, post) => {
            try {
                await addReactionToPost(event.target.name, post.name, post);
                let postsData = await getAllPosts();
                setPosts(postsData);
            }
            catch(error) {
                console.log(error);
            }
        }

        return <Post 
            key = {props._id}
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
            change = {(e, post) => (username !== "Guest") ? addReaction(e, post) : alert(guestMessage)}
            show_comments={true}
            imageUrl = {props.imageUrl}
            reactions = {props.reacts}
        />
    }

    return (loading) ? <Loader /> :
    <div>
        <Navbar name={username} page = "home" unread = {unread}/>
        <Heading />
        <div className="text-center"> <h3 className="margin"> All Posts </h3> </div>
        <CategoryMenu category_type = "Select Category" message = "all" />
        <SearchBar message = "all" type = "none" />
        {posts.map(createPost)}
        <Footer />
    </div>
}

export default Posts;