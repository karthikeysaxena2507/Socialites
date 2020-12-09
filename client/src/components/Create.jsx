import React, { useState } from "react";
import axios from "axios";
import { useParams,Link } from "react-router-dom";

function Create() {

    let { username } = useParams();

    var [post,setPost] = useState({author: username,title:"", content:""});

    function change(event) {
        var {name, value} = event.target;

        setPost((prevPost) => {
        return {
          ...prevPost,
          [name]: value
        };
      });
    }

    function addPost(event) {
        event.preventDefault();
        axios.post("/posts/add", post)
          .then(function(res) { 
            console.log(res.data);
        });
        setPost({
          author: username,
          title:"", 
          content:""
        });
        window.location = "/posts/" + username;
    }
    
    let link1 = "/posts/" + username;
    let link2 = "/myposts/" + username;

    return (<div className="center-text">
        <div className="center-text">
            <Link to={link1}>
                <button className="btn btn-dark expand margin one"> See All Posts </button> 
            </Link>
            <Link to={link2}>
                <button className="btn btn-dark expand margin one"> My Posts </button> 
            </Link>
            <Link to="/">
                <button className="btn btn-dark expand margin"> LogOut </button> 
            </Link>
        </div>
        <div className="upper-margin"> <h1> Create Your Post Here</h1> </div> 
        <div>
            <textarea
                name="title"
                value={post.title}
                className="margin"
                placeholder="Title of your Post"
                rows="1"
                cols="50"
                onChange={change}
                required
            />
         </div>
         <div>
            <textarea
                name="content"
                value={post.content}
                className="margin"
                placeholder="Content of your Post"
                rows="5"
                cols="50"
                onChange={change}
                required
            />
         </div>
        <button className="btn btn-dark expand margin" onClick={addPost}> Post </button> 
        

</div>);
}

export default Create;

