/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import search from "./images/search.png";
import { useHistory } from "react-router-dom";

const SearchBar = (props) => {

    var history = useHistory();
    var [searchContent,setsearchContent] = useState("");

    const change_search_content = (event) => {
        setsearchContent(event.target.value);
    }

    const searchIt = () => {
        history.push(`/result/${searchContent}/${props.message}/${props.type}`);
        setsearchContent("");
    }

    return (<div>
        <div className="margin container center-text">
            <input type="search" placeholder="Search" className="width" onKeyPress={(e) => e.key === "Enter" ? searchIt() : null} onChange={change_search_content}/>
            <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
        </div>
    </div>);
}

export default SearchBar;