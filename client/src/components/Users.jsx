/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import React, { useEffect,useState } from "react";
import Footer from "./Footer";
import Heading from "./Heading";
import search from "./images/search.png";
import Navbar from "./Navbar";
import Fuse from "fuse.js";

const Users = () => {

    var [allUsers, setAllUsers] = useState([]);
    var [users, setUsers] = useState([]);
    var [searchContent,setsearchContent] = useState("");
    var [message, setMessage] = useState("");

    useEffect( () => {
        const fetch = async() => {
            try {
                const response = await axios.get("/users/");
                console.log(response);
                setUsers(response.data);
                setAllUsers(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
        // axios.get("/users/", {
        //     headers: {
        //         "access-token": localStorage.getItem("token")
        // }}).then((res) => {
        //         console.log(res);
        // })
        // .catch((err) => {
        //     console.log(err);
        // });
    },[]);

    const createUser = (props, index) => {

        if(props.username !== undefined) {
            return (<div className="container user" key={index}>
            <li className="profile">
                {props.username} 
            </li>
        </div>);
        } 
        else {
            return (<div className="container user" key={index}>
            <li className="profile">
                {props.item.username} 
            </li>
        </div>);
        }
    }

    const change = (event) => {
        setsearchContent(event.target.value);
    }

    const searchIt = (event) => {
        event.preventDefault();
        if(searchContent === "") {
            setMessage("Showing All Users");
            setUsers(allUsers);
        }
        else {
            setMessage(`Showing Search results for: ${searchContent}` )
            const fuse = new Fuse(allUsers, {
                keys: ["username"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchContent);
            setUsers(result);
        }
    }

    return <div>
    <Navbar page = "allusers"/>
    <Heading />
    <div className="center-text"> <h3 className="margin"> All Users </h3> </div>
    <div className="container margin center-text">
        <input type="text" value={searchContent} onKeyPress={(e) => e.key === "Enter" ? searchIt(e) : null} onChange={change} className="width" placeholder="Search" autoComplete="off"/>
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
