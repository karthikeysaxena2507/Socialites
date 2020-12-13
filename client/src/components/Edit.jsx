import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

    function editPost(event) {
        axios.post("/posts/edit/" + id, post) 
            .then(function(response) {
                console.log(response.data);
            });
        window.location = "/myposts/" + username;
    }

    return (<div  className="center-text upper-margin">
        <div className="margin"> 
            <h1> Edit Your Post Here </h1> 
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
    </div>);
}

export default Edit;