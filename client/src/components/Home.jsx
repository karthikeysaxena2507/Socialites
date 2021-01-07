import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Heading from "./Heading";
const countapi = require('countapi-js');

const Home = () => {

    var [visits, setVisits] = useState(0);
    useEffect(() => {
        countapi.visits().then((result) => {
            setVisits(result.value);
        });  
    },[]);

    return(<div>
        <div className="heading">
        <Heading />
            <h1> Welcome To the Socialites </h1>
            <Link to="/login">
                <div className="margin"> <button className="btn btn-lg expand"> Login </button> </div>
            </Link>
            <Link to="/register">
                <div className="margin"> <button className="btn btn-lg expand"> Register </button> </div>
            </Link>
            <h4 className="margin"> No. of visits: {visits} </h4>
        </div>
        <div className="space"></div>
        <Footer />
    </div>);
}

export default Home;