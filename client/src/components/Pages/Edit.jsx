/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useParams, useHistory } from "react-router-dom";
import Footer from "../Footer";
import Heading from "../Heading";
import { Spinner } from "react-bootstrap";

const Edit = () => {

    var { id } = useParams();
    var history = useHistory();
    var [username, setUsername] = useState("");
    var [title, setTitle] = useState("");
    var [content, setContent] = useState("");
    var [category, setCategory] = useState("Select Category");
    var [preview, setPreview] = useState(""); 
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    var token = localStorage.getItem("token");
                    if(token === null) token = sessionStorage.getItem("token");
                    const user = await axios.get("/users/auth",{
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": token
                        }
                    });
                    setUsername(user.data.username);
                }
                else {
                    setUsername("Guest");
                }
                const response = await axios.get(`/posts/edit/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
                setCategory(response.data.category);
                setPreview(response.data.imageUrl);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
                localStorage.clear();
                sessionStorage.clear();
                window.location = "/login";
            }
        }
        fetch();
    },[guest, id]);

    const changeCategory = (e) => {
        setCategory(e.target.innerText);
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
        if(username !== "Guest") {
            try {
                console.log(imageSource);
                await fetch(`/posts/edit/${id}`, {
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
            }
            catch(error) {
                console.log(error);
            }
            history.push(`/myposts`);
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    }

    const removeImage = (e) => {
        e.preventDefault();
        setPreview("");
    }

    var previewStyling = (preview) ? {visibility: "visible"} : {visibility: "hidden"};
    var styling = (!preview) ? {visibility: "visible"} : {visibility: "hidden"};

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
                <Navbar 
                    name = {username}
                    page = "edit"
                />
                <Heading />
                <div className="text-center"> 
                    <h1 className="margin"> Edit Your Post Here </h1> 
                </div> 
                <div className="dropdown container text-center">
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
                            onChange={(e) => setTitle(e.target.value)}
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
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="margin">
                    <div className="text-center">
                        <label for="file"> 
                            <span className="btn expand"> Select Image </span>
                        </label>
                        <span className="center-text margin">
                            <button className="btn expand" onClick={removeImage}> Remove Image </button> 
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
                        <button className="btn btn-lg expand margin" type="submit"> Edit </button> 
                    </div>
                </form>
            <div className="space"></div>
            <Footer />
        </div>);
    }
}

export default Edit;