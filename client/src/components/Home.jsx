import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return(<div>
        <div className="heading">
            <h1> Welcome To the Socialites </h1>
            <Link to="/login">
                <div className="margin"> <button className="btn btn-lg expand"> Login </button> </div>
            </Link>
            <Link to="/register">
                <div className="margin"> <button className="btn btn-lg expand"> Register </button> </div>
            </Link>
        </div>
    </div>);
}

export default Home;