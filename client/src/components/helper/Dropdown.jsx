/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

let Dropdown = (props) => {
    return (
    <div className="dropdown-menu">
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Art </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Motivational </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Political </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Funny </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Music </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Food </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Fashion </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> General Knowledge </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Lifestyle </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Travel </a>
        <a className="dropdown-item" href="#" onClick={(e)=> props.change(e)}> Other </a>
    </div>);
}

export default Dropdown