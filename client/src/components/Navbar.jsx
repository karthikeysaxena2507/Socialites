/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React from "react";
import { Link,useHistory } from "react-router-dom";
const Navbar = (props) => {

    var history = useHistory();
    var username = localStorage.getItem("username");

    const change = () => {
      const drop = async() => {
        try {
          const response = await axios.post("/logout", props);
          console.log(response);
        }
        catch(error) {
          console.log(error);
        }
      }
      drop();
      localStorage.clear();
      history.push("/");
    }

    return <div className="text-center">
    <nav className="navbar navbar-expand-md navbar-light bg-dark text-white fixed-top" id="bar">
      <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
        <span className="navbar-toggler-icon"> </span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav">
        <Link to="/allposts">
          <span className={"nav-item nav-link active expand " + ((props.page === "home") ? "nav-item-active" : "")}> Home </span>
        </Link>
        <Link to="/about">
          <span className={"nav-item nav-link active expand " + ((props.page === "about") ? "nav-item-active" : "")}> About </span>
        </Link>
        <Link to="/create">
          <span className={"nav-item nav-link active expand " + ((props.page === "create") ? "nav-item-active" : "")}> Create </span>
        </Link>
        <Link to="/myposts">
          <span className={"nav-item nav-link active expand " + ((props.page === "myposts") ? "nav-item-active" : "")}> MyPosts </span>
        </Link>
        <Link to="/allusers">
          <span className={"nav-item nav-link active expand " + ((props.page === "allusers") ? "nav-item-active" : "")}> Chats </span>
        </Link>
          <span onClick={change} className={"nav-item nav-link active expand"}> Logout </span>
        </div>
      </div>
        <span className={"move-right nav-item nav-link active expand profilename " + ((props.page === "profile") ? "nav-item-active" : "")} onClick={() => {history.push(`/profile/${username}`)}}> {username} </span>        
    </nav>
  </div>
}

export default Navbar;