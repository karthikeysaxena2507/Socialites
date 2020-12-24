/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import search from "./images/search.png";

const SearchBar = (props) => {

    var [searchContent,setsearchContent] = useState("");

    const change_search_content = (event) => {
        setsearchContent(event.target.value);
    }

    const searchIt = () => {
        window.location = `/result/${props.name}/${searchContent}/${props.message}/${props.type}`;
        setsearchContent("");
    }

    return (<div>
        <div className="margin container center-text">
            <input type="search" placeholder="Search" className="width" onChange={change_search_content}/>
            <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
        </div>
    </div>);
}

export default SearchBar;