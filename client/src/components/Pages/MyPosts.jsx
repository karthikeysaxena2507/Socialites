/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import Navbar from "../helper/Navbar";
import Post from "../helper/Post";
import trash from "../../images/trash.png";
import edit from "../../images/edit.png";
import Footer from "../helper/Footer";
import CategoryMenu from "../helper/CategoryMenu";
import Heading from "../helper/Heading";
import SearchBar from "../helper/SearchBar";
import Loader from "../helper/Loader";
import music from "../../sounds/button.mp3";
import { Howl } from "howler";
import { checkUser } from "../../api/userApis";
import { getPostsByUser, addReactionToPost, deletePost } from "../../api/postApis";
var sound = new Howl({src: [music]});

let MyPosts = () => {

    let [username, setUsername] = useState("");
    let [posts,setPosts] = useState([]);
    let [loading, setLoading] = useState(true);
    let [unread, setUnread] = useState(0);
    let guest = localStorage.getItem("Guest");

    useEffect(() => {
        let fetch = async() => {
            try {
                if(guest !== "true") {
                    let user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                    let postsData = await getPostsByUser(user.username);
                    setPosts(postsData);
                }
                else setUsername("Guest");
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, username]);

    let MyPost = (props) => {

        let addReaction = async(event, post) => {
            try {
                await addReactionToPost(event.target.name, post.name, post);
                let postsData = await getPostsByUser(post.name);
                setPosts(postsData);
            }
            catch(error) {
                console.log(error);
            }
        }

        let remove = async() => {
            try {
                sound.play();
                await deletePost(props._id, username);
                let postsData = await getPostsByUser(username);
                setPosts(postsData);
            }
            catch(error) {
                console.log(error);
            }
        }

        return (<div className="container" key ={props._id}>
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
                change = {(e, post) => addReaction(e, post)}
                show_comments = {true}
                imageUrl = {props.imageUrl}
                reactions = {props.reacts}
        />
        <div className="post-options text-center">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={edit} onClick={() => {sound.play(); window.location = `/edit/${props._id}`}} className="expand"/>
        </div>
    </div>);
    }

    return (loading) ? <Loader /> :
    <div>
        <Navbar name={username} page = "myposts" unread = {unread}/>
        <Heading />
        <div className="text-center"><h3 className="margin"> My Posts </h3> </div>
        <CategoryMenu category_type = "Select Category" message = "my"/>
        <SearchBar message = "personal" type = "none" />
        {posts.map(MyPost)}
        <Footer />
    </div>
}

export default MyPosts;

