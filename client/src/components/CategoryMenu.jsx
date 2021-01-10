/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom";

const CategoryMenu = (props) => {

    let history = useHistory();

    const changeCategory = (event) => {
        if(event.target.innerText === "All" && props.message === "my") {
            history.push(`/myposts`);
        }
        else if(event.target.innerText !== "All" && props.message === "my") {
            history.push(`/mycategoryposts/${event.target.innerText}`);
        }
        else if(event.target.innerText === "All" && props.message === "all") {
            history.push(`/allposts`);
        }
        else if(event.target.innerText !== "All" && props.message === "all") {
            history.push(`/categoryposts/${event.target.innerText}`);
        }
    }

    return <div className="dropdown text-center">
            <button className="btn dropdown-toggle" type="button" data-toggle="dropdown">
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