/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

function Navbar(props) {

    var home_link = "/allposts/" + props.name;
    var about_link = "/about/" + props.name;
    var create_link = "/create/" + props.name;
    var myposts_link = "/myposts/" + props.name;

    var current_page = props.page;

    return <nav className="navbar navbar-expand-md navbar-light bg-dark text-white fixed-top" id="bar">
      <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
        <span className="navbar-toggler-icon"> </span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav">
          <a href={home_link} className={"nav-item nav-link active " + ((current_page === "home") ? "nav-item-active" : "")}> Home </a>
          <a href={about_link} className={"nav-item nav-link active " + ((current_page === "about") ? "nav-item-active" : "")}> About </a>
          <a href={create_link} className={"nav-item nav-link active " + ((current_page === "create") ? "nav-item-active" : "")}> Create </a>
          <a href={myposts_link} className={"nav-item nav-link active " + ((current_page === "myposts") ? "nav-item-active" : "")}> MyPosts </a>
          <a href="/" className={"nav-item nav-link active"}> Logout </a>
        </div>
      </div>
    </nav>
}

export default Navbar;