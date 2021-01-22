/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Navbar";
import Post from "../Post";
import trash from "../images/trash.png";
import edit from "../images/edit.png";
import Footer from "../Footer";
import CategoryMenu from "../CategoryMenu";
import Heading from "../Heading";
import SearchBar from "../SearchBar";
import { Spinner } from "react-bootstrap";

const MyPosts = () => {

    var history = useHistory();
    var [username, setUsername] = useState("");
    var [posts,setPosts] = useState([]);
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await axios.get("/users/auth",{
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": localStorage.getItem("token")
                        }
                    });
                    setUsername(user.data.username);
                    const response = await axios.get(`/posts/list/${user.data.username}`);
                    setPosts(response.data.reverse());
                }
                else {
                    setUsername("Guest");
                }
                setLoading(false);
            }
            catch(error) {
                console.log(error);
                localStorage.clear();
                window.location = "/login";
            }
        }
        fetch();
    },[guest, username]);

    const MyPost = (props, index) => {

        const changepost = (event, post) => {
            const drop = async() => {
                try {
                    await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                    const response = await axios.get(`/posts/list/${username}`);
                    setPosts(response.data.reverse());
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
                    await axios.delete(`/posts/delete/${props._id}`);
                    history.push(`/myposts`);
                }
                catch(error) {
                    console.log(error);
                }
            }
            del();
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
        <div className="post-options text-center">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={edit} onClick={update} className="expand"/>
        </div>
    </div>);
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
            <Navbar name={username} page = "myposts"/>
            <Heading />
            <div className="text-center"><h3 className="margin"> My Posts </h3> </div>
            <CategoryMenu category_type = "Select Category" message = "my"/>
            <SearchBar message = "personal" type = "none" />
            {posts.map(MyPost)}
            <div className="space"></div>
            <Footer />
    </div>);
    }
}

export default MyPosts;

