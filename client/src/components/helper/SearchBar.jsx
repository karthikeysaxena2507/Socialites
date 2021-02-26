/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import search from "../../images/search.png";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
var sound = new Howl({src: [music]});

const SearchBar = (props) => {

    const [searchContent,setsearchContent] = useState("");

    const searchIt = () => {
        sound.play();
        setsearchContent("");
        window.location = `/result/${searchContent}/${props.message}/${props.type}`;
    }

    return (<div>
        <div className="margin container text-center">
            <input 
                type="search" 
                placeholder="Search" 
                className="width" 
                onKeyPress={(e) => e.key === "Enter" ? searchIt() : null} 
                onChange={(e) => setsearchContent(e.target.value)}
            />
            <button 
                className="btn expand" 
                onClick={searchIt}> 
                <img 
                    src={search} 
                    className="expand"
                />
            </button>
        </div>
    </div>);
}

export default SearchBar;