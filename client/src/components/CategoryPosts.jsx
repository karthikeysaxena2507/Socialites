/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import CategoryMenu from "./CategoryMenu";
import Heading from "./Heading";
import SearchBar from "./SearchBar";
import InvalidUser from "./InvalidUser";

const CategoryPosts = () => {

    var username = localStorage.getItem("username");
    var { type } = useParams();
    var [posts,setPosts] = useState([]);

    useEffect(() => {
        const fetch = async() => {
            try{
                const response = await axios.get("/posts");
                setPosts(response.data.reverse().filter((post) => {
                    return (post.category === type);
                }));
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[type]);

    const createPost = (props, index) => {

        const changepost = (event, post) => {
            if(username !== "Guest") {
                const drop = async() => {
                    try{
                        const response = await axios.post(`/posts/update/${event.target.name}/${post.name}`, post)
                        const res = await axios.get("/posts");
                        setPosts(res.data.reverse().filter((post) => {
                            return (post.category === type);
                        }));
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

    const Check = () => {
        if(username === null) {
            return (
                <InvalidUser />
            )
        }
        else {
            return (
            <div>
                <Navbar page = "home"/>
                <Heading />
                <h4 className="margin text-center"> Hello {username} </h4>
                <div className="container text-center mt-3"> <h3 className="margin"> All Posts </h3> </div>
                <CategoryMenu category_type = {type} message = "all" />
                <SearchBar type = {type} message = "all" />
                {posts.map(createPost)}
                <div className="space"></div>
                <Footer />
        </div>)
        }
    }

    return <Check />;
}

export default CategoryPosts;