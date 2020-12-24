/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

const CategoryMenu = (props) => {

    const changeCategory = (event) => {
        if(event.target.innerText === "All" && props.message === "my") {
            window.location = `/myposts/${props.name}`;
        }
        else if(event.target.innerText !== "All" && props.message === "my") {
            window.location = `/mycategoryposts/${props.name}/${event.target.innerText}`;
        }
        else if(event.target.innerText === "All" && props.message === "all") {
            window.location = `/allposts/${props.name}`;
        }
        else if(event.target.innerText !== "All" && props.message === "all") {
            window.location = `/categoryposts/${props.name}/${event.target.innerText}`;
        }
    }

    return <div className="dropdown container center-text">
            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Select  Category
            </button>
            <div
             className="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
                <a className="dropdown-item" href="#" onClick={changeCategory}> Other </a>
            </div>
        </div>
}

export default CategoryMenu;