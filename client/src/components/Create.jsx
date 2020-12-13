/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from "react";
import axios from "axios";
import { useParams,Link } from "react-router-dom";
import upload from "./images/upload.png";
import Dropzone from "react-dropzone";

function Create() {

    let { username } = useParams();

    const [file, setFile] = useState(null); 
    const [previewSrc, setPreviewSrc] = useState(''); 
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); 
    const dropRef = useRef(); 


    var [post,setPost] = useState({author: username,title:"", content:"", like:0, love:0, laugh:0});

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
          content:"",
          like:0,
          love:0,
          laugh:0

        });
        window.location = "/allposts/" + username;
    }

    function onDrop(files) {
        const [uploadedFile] = files;
        setFile(uploadedFile);
      
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewSrc(fileReader.result);
        };
        fileReader.readAsDataURL(uploadedFile);
        setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
      };

      function enter() {
        dropRef.current.style.border = '2px solid #000';
      };

      function over() {
        dropRef.current.style.border = '2px dashed #e9ebeb';
      }
    
    let link1 = "/allposts/" + username;
    let link2 = "/myposts/" + username;

    return (<div className="center-text">
        <div>
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
        <div className="margin"> <h1> Create Your Post Here </h1> </div> 
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
         <div className="center-text margin">
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
        <div> 
        <div className="margin">
            <div className="container">
                <div className="row">
                        <Dropzone onDrop={onDrop} onDragEnter={enter} onDragLeave={over}>
                            {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                                <input {...getInputProps()} />
                                <p>Drag and drop a file OR click here to select a file <img src={upload} className="expand"/> </p>
                                {file && (
                                <div>
                                    <strong>Selected file:</strong> {file.name}
                                </div>
                                )}
                            </div>
                            )}
                        </Dropzone>
                </div>
                <div className="row preview margin">
                        {previewSrc ? (
                            isPreviewAvailable ? (
                            <div>
                                <img src={previewSrc} className="image-preview margin" alt="Preview" />
                            </div>
                            ) : (
                            <div>
                                <p>No preview available for this file</p>
                            </div>
                            )
                        ) : (
                            <div>
                                <p>Image preview will be shown here after selection</p>
                            </div>
                        )}
                </div>
            </div>
        </div>
    </div>
    <div className="center-text margin">
        <button className="btn btn-dark expand" onClick={addPost}> Post </button> 
    </div>
</div>);
}

export default Create;

