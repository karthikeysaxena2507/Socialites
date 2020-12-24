/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Heading from "./Heading";

const Edit = () => {

    let { username,id } = useParams();

    var [post,setPost] = useState({title:"", content:"", category:""});
    var [category, setCategory] = useState("Category");

    useEffect(() => {
        axios.get(`/posts/edit/${id}`)
            .then(function(response) {
                setPost(response.data);
                setCategory(response.data.category);
            });
    },[id]);

    const change = (event) => {
        var {name, value} = event.target;

        setPost((prevPost) => {
        return {
          ...prevPost,
          [name]: value
        };
      });
    }

    const editPost = () => {
        axios.post(`/posts/editpost/${id}`, post) 
            .then(function(response) {
                console.log(response.data);
            })
            .catch(function(response) {
                console.log(response);
            });
        window.location = `/myposts/${username}`;
    }

    const changeCategory = (event) => {
        setCategory(event.target.innerText);
        setPost({title:post.title, content:post.content, category:event.target.innerText});
    }

    return (<div  className="center-text">
        <Navbar 
            name = {username}
            page = "edit"
        />
        <Heading />
        <div> 
            <h1 className="margin"> Edit Your Post Here </h1> 
        </div> 
        <div className="dropdown container center-text">
            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {category}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="#" onClick={changeCategory}> Art </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Motivational </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Political </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Funny </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Music </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Food </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Fashion </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> General Knowledge </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Lifestyle </a>
                <a className="dropdown-item" href="#" onClick={changeCategory}> Other </a>
            </div>
        </div>
        <div className="margin">
            <textarea
                name="title"
                value={post.title}
                placeholder="Title of your Post"
                rows="1"
                cols="50"
                onChange={change}
                required
            />
         </div>
         <div className="margin">
            <textarea
                name="content"
                value={post.content}
                placeholder="Content of your Post"
                rows="9"
                cols="50"
                onChange={change}
                required
            />
         </div>
        <div className="margin">
            <button className="btn btn-dark expand" onClick={editPost}> Edit </button> 
        </div>
        <div className="space"></div>
        <Footer />
    </div>);
}

export default Edit;