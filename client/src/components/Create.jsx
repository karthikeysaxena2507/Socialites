/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import upload from "./images/upload.png";
import Dropzone from "react-dropzone";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Heading from "./Heading";

const Create = () => {

    let { username } = useParams();

    const [file, setFile] = useState(null); 
    const [previewSrc, setPreviewSrc] = useState(''); 
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
    var [category, setCategory] = useState("Category"); 
    const dropRef = useRef(); 


    var [post,setPost] = useState({author: username,title:"", content:"", like:0, love:0, laugh:0, comment_count:0, category:""});

    const change = (event) => {
        var {name, value} = event.target;

        setPost((prevPost) => {
        return {
          ...prevPost,
          [name]: value
        };
      });
    }

    const addPost = (event) => {
        event.preventDefault();
        axios.post("/posts/add", post)
          .then(() => { 
            window.location = `/allposts/${username}`;
            })
          .catch((res) => {
            console.log(res);
          })
        setPost({
          author: username,
          title:"", 
          content:"",
          like:0,
          love:0,
          laugh:0,
          comment_count:0
        });
    }

    const onDrop = (files) => {
        const [uploadedFile] = files;
        setFile(uploadedFile);
      
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewSrc(fileReader.result);
        };
        fileReader.readAsDataURL(uploadedFile);
        setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
      };

      const enter = () => {
        dropRef.current.style.border = "2px solid #000";
      };

      const over = () => {
        dropRef.current.style.border = "2px dashed #e9ebeb";
      }
    
    const changeCategory = (event) => {
        setCategory(event.target.innerText);
        setPost({author: username,title:post.title, content:post.content, like:post.like, love:post.love, laugh:post.laugh, comment_count:post.comment_count, category:event.target.innerText});
    }

    return (<div className="center-text">
        <Navbar 
            name = {username}
            page = "create"
        />
        <Heading />
        <div> 
          <h1 className="margin"> Create Your Post Here </h1>
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
         <div className="center-text margin">
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
        <button className="btn btn-lg expand" onClick={addPost}> Post </button> 
    </div>
    <div className="space"></div>
    <Footer />
</div>);
}

export default Create;

