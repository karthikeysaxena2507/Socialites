/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Heading from "./Heading";
import search from "./images/search.png";
import Navbar from "./Navbar";

const Users = () => {

    let { username } = useParams();

    var [allUsers, setAllUsers] = useState([]);
    var [users, setUsers] = useState([]);
    var [searchContent,setsearchContent] = useState("");
    var [message, setMessage] = useState("");

    useEffect( () => {
        const fetch = async() => {
            try {
                const response = await axios.get("/users/");
                setUsers(response.data);
                setAllUsers(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[]);

    const createUser = (props, index) => {

        const SeeProfile = (e) => {
            window.location = `/profile/${e.target.innerText}/${username}`;
        }

        return (<div className="container user" key={index}>
            <li onClick={SeeProfile} className="profile">
                {props.username} 
            </li>
        </div>);
    }

    const change = (event) => {
        setsearchContent(event.target.value);
    }

    const searchIt = (event) => {
        event.preventDefault();
        if(searchContent === "") setMessage("Showing All Users");
        else setMessage(`Showing Search results for: ${searchContent}` );
        setUsers(allUsers.filter(function(user) {
            return (user.username.indexOf(searchContent) !== -1);
        }));
    }

    return <div>
    <Navbar 
        name = {username}
        page = "allusers"
    />
    <Heading />
    <div className="center-text">
        <h3 className="margin"> All Users </h3>
    </div>
    <div className="container margin center-text">
        <input type="text" value={searchContent} onChange={change} className="width" placeholder="Search" autoComplete="off"/>
        <button className="btn expand" onClick={searchIt}> <img src={search} /> </button>
    </div>
    <div className="margin center-text">
        <p className="margin"> {message} </p>
    </div>
    <div className="margin">
        {users.map(createUser)}
    </div>
    <div className="space"></div>
    <Footer />
</div>
}

export default Users;