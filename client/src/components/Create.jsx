/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Heading from "./Heading";

const Create = () => {

    var username = localStorage.getItem("username");
    var history = useHistory();
    var [title, setTitle] = useState("");
    var [content, setContent] = useState("");
    var [category, setCategory] = useState("Select Category");
    var [preview, setPreview] = useState(""); 

    const changeCategory = (e) => {
        setCategory(e.target.innerText);
    }

    const changeTitle = (e) => {
        setTitle(e.target.value);
    } 

    const changeContent = (e) => {
        setContent(e.target.value);
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreview(reader.result);
        }
    }

    const handleSubmitFile = (e) => {
        e.preventDefault();
        uploadImage(preview);
    }

    const uploadImage = async (imageSource) => {
        if(username !== "Guest" && username !== null) {
            try {
                console.log(imageSource);
                await fetch("/posts/add", {
                    method: "POST",
                    body: JSON.stringify({
                        data: imageSource,
                        author: username,
                        title: title,
                        content: content,
                        category: category
                    }),
                    headers: {"Content-type": "application/json"}                
                });
                history.push(`/allposts`);
            }
            catch(error) {
                console.log(error);
            }
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    }

    const removeImage = (e) => {
        setPreview("");
    }

    var previewStyling = (preview) ? {visibility: "visible"} : {visibility: "hidden"};
    var styling = (!preview) ? {visibility: "visible"} : {visibility: "hidden"};

            return (<div className="text-center">
                <Navbar page = "create"/>
                <Heading />
                <div> 
                <h1 className="margin"> Create Your Post Here </h1>
                </div> 
                <div className="dropdown text-center">
                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                        {category}
                    </button>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Art </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Motivational </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Political </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Funny </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Music </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Food </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Fashion </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> General Knowledge </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Lifestyle </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Travel </a>
                        <a className="dropdown-item" href="#" onClick={changeCategory}> Other </a>
                    </div>
                </div>
                <form onSubmit={handleSubmitFile}>
                    <div className="text-center margin">
                        <textarea
                            name="title"
                            value={title}
                            placeholder="Title of your Post"
                            rows="1"
                            cols="50"
                            onChange={changeTitle}
                            required
                        />
                    </div>
                    <div className="text-center margin">
                        <textarea
                            name="content"
                            value={content}
                            placeholder="Content of your Post"
                            rows="9"
                            cols="50"
                            onChange={changeContent}
                            required
                        />
                    </div>
                    <div className="margin">
                    <div className="text-center">
                        <label for="file"> 
                            <span className="btn expand"> 
                                Select Image 
                            </span>
                        </label>
                        <span className="text-center margin">
                            <span className="btn expand" onClick={removeImage}> Remove Image </span> 
                        </span>
                    </div>
                        <input
                            type="file" 
                            name="image" 
                            style={{visibility: "hidden"}}
                            id="file"
                            onChange={handleFileInputChange}
                        />
                    </div>
                    <div className="margin text-center"> Current Image </div>
                    <div className="margin text-center" style={styling}>
                        Image preview will be shown here
                    </div>
                    <div className="text-center">
                    <img 
                        src={preview} 
                        alt="invalid image" 
                        className="preview margin"
                        style={previewStyling} 
                        />
                    </div>
                    <div className="text-center margin">
                        <button className="btn btn-lg expand margin" type="submit"> Create </button> 
                    </div>
                </form>
            <div className="space"></div>
            <Footer />
        </div>);
    
}

export default Create;