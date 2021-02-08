/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import search from "../../images/search.png";
import { useHistory } from "react-router-dom";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});

const SearchBar = (props) => {

    var history = useHistory();
    var [searchContent,setsearchContent] = useState("");

    const change_search_content = (event) => {
        setsearchContent(event.target.value);
    }

    const searchIt = () => {
        sound.play();
        history.push(`/result/${searchContent}/${props.message}/${props.type}`);
        setsearchContent("");
    }

    return (<div>
        <div className="margin container text-center">
            <input type="search" placeholder="Search" className="width" onKeyPress={(e) => e.key === "Enter" ? searchIt() : null} onChange={change_search_content}/>
            <button className="btn expand" onClick={searchIt}> <img src={search} className="expand"/> </button>
        </div>
    </div>);
}

export default SearchBar;