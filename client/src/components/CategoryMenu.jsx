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

    return <div className="dropdown container text-center">
            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {props.category_type}
            </button>
            <div
             className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <span className="dropdown-item" href="#" onClick={changeCategory}> All </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Art </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Motivational </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Political </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Funny </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Music </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Food </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Fashion </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> General Knowledge </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Lifestyle </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Travel </span>
                <span className="dropdown-item" href="#" onClick={changeCategory}> Other </span>
            </div>
        </div>
}

export default CategoryMenu;