import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function Home() {
    return(<div>
        <div className="heading">
        <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
            <h1> Welcome To the Socialites </h1>
            <Link to="/login">
                <div className="margin"> <button className="btn btn-lg expand"> Login </button> </div>
            </Link>
            <Link to="/register">
                <div className="margin"> <button className="btn btn-lg expand"> Register </button> </div>
            </Link>
        </div>
        <div className="space"></div>
        <Footer />
    </div>);
}

export default Home;