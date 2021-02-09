/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});
const Navbar = (props) => {

    var username = props.name;

    const change = () => {
      sound.play();
      const drop = async() => {
        try {
          const response = await axios.post("/users/logout", props);
          console.log(response);
        }
        catch(error) {
          console.log(error);
        }
      }
      drop();
      localStorage.clear();
      sessionStorage.clear();
      window.location = "/";
    }

    const SeeProfile = (e) => {
      sound.play();
      window.location = `/profile/${username}`;
    }

    return <div className="text-center">
    <nav className="navbar navbar-expand-md navbar-light bg-dark text-white fixed-top" id="bar">
      <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
        <span className="navbar-toggler-icon"> </span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav">
        <Link to="/allposts" onClick={() => sound.play()}>
          <span className={"nav-item nav-link active expand " + ((props.page === "home") ? "nav-item-active" : "")}> Home </span>
        </Link>
        <Link to="/about" onClick={() => sound.play()}>
          <span className={"nav-item nav-link active expand " + ((props.page === "about") ? "nav-item-active" : "")}> About </span>
        </Link>
        <Link to="/create" onClick={() => sound.play()}>
          <span className={"nav-item nav-link active expand " + ((props.page === "create") ? "nav-item-active" : "")}> Create </span>
        </Link>
        <Link to="/myposts" onClick={() => sound.play()}>
          <span className={"nav-item nav-link active expand " + ((props.page === "myposts") ? "nav-item-active" : "")}> MyPosts </span>
        </Link>
        <Link to="/allusers" onClick={() => sound.play()}>
          <span className={"nav-item nav-link active expand " + ((props.page === "allusers") ? "nav-item-active" : "")}> Chats </span>
        </Link>
          <span onClick={change} className={"nav-item nav-link active expand"}> Logout </span>
        </div>
      </div>
        <span className={"move-right nav-item nav-link active expand profilename" + ((props.page === "profile") ? "nav-item-active" : "")} onClick={SeeProfile}> {username} </span>        
    </nav>
  </div>
}

export default Navbar;