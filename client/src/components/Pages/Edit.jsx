/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "../helper/Navbar";
import { useParams } from "react-router-dom";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import Loader from "../helper/Loader";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis";
import { getPostForEdit, editPost } from "../../api/postApis";
var sound = new Howl({src: [music]});

const Edit = () => {

    var { id } = useParams();
    var [username, setUsername] = useState("");
    var [title, setTitle] = useState("");
    var [content, setContent] = useState("");
    var [category, setCategory] = useState("Select Category");
    var [preview, setPreview] = useState(""); 
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    var [unread, setUnread] = useState(0);

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else {
                    setUsername("Guest");
                }
                const post = await getPostForEdit(id);
                setTitle(post.title);
                setContent(post.content);
                setCategory(post.category);
                setPreview(post.imageUrl);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, id]);

    const changeCategory = (e) => {
        sound.play();
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
        sound.play();
        uploadImage(preview);
    }

    const uploadImage = async (imageSource) => {
        if(username !== "Guest") {
            try {
                let value;
                if(category === "Select Category") {
                    value = "Other";
                }
                else {
                    value = category;
                }
                const body = JSON.stringify({
                    data: imageSource,
                    author: username,
                    title, content, category: value
                });
                await editPost(body, id);
            }
            catch(error) {
                console.log(error);
            }
            window.location = "/myposts";
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    }

    const removeImage = (e) => {
        e.preventDefault();
        sound.play();
        setPreview("");
    }

    var previewStyling = (preview) ? {visibility: "visible"} : {visibility: "hidden"};
    var styling = (!preview) ? {visibility: "visible"} : {visibility: "hidden"};

    if(loading) {
        return <Loader />
    }
    else {
        return (<div>
                <Navbar 
                    name = {username}
                    page = "edit"
                    unread = {unread}
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