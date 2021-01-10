import React from "react";
import Heading from "./Heading";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const InvalidUser = () => {
        return <div className="container text-center">
        <Heading />
        <div className="margin">
            <h2> You Are Not logged In </h2>
            <Link to="/login"> <button className="btn margin btn-lg expand"> Login </button> </Link>
        </div>
        <div className="space"></div>
        <Footer />
    </div>
}

export default InvalidUser;