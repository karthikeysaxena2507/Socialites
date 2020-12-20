import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import Footer from "./Footer";

function Edit() {

    let { username,id } = useParams();

    var [post,setPost] = useState({title:"", content:""});

    useEffect(function() {
        axios.get("/posts/edit/" + id)
            .then(function(response) {
                setPost(response.data);
            });
    },[id]);

    function change(event) {
        var {name, value} = event.target;

        setPost((prevPost) => {
        return {
          ...prevPost,
          [name]: value
        };
      });
    }

    function editPost() {
        axios.post("/posts/edit/" + id, post) 
            .then(function(response) {
                console.log(response.data);
            })
            .catch(function(response) {
                console.log(response);
            });
        window.location = "/myposts/" + username;
    }

    return (<div  className="center-text">
        <Navbar 
            name = {username}
            page = "edit"
        />
        <div className="upper-margin"> 
        <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
            <h1 className="margin"> Edit Your Post Here </h1> 
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
                rows="5"
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