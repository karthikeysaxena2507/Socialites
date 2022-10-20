/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});

let CategoryMenu = (props) => {

    let navigate = useNavigate();

    let changeCategory = (event) => {
        sound.play();
        (event.target.innerText === "All" && props.message === "my") && (navigate(`/myposts`));
        (event.target.innerText !== "All" && props.message === "my") && (navigate(`/mycategoryposts/${event.target.innerText}`));
        (event.target.innerText === "All" && props.message === "all") && (navigate(`/allposts`));
        (event.target.innerText !== "All" && props.message === "all") && (navigate(`/categoryposts/${event.target.innerText}`));
    }

    return <div className="dropdown text-center">
            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                {props.category_type}
            </button>
            <div
             className="dropdown-menu">
                <a className="dropdown-item" href="#" onClick={changeCategory}> All </a>
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

}

export default CategoryMenu;