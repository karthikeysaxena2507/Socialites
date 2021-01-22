import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import Heading from "../Heading";
import { Spinner } from "react-bootstrap";
const countapi = require('countapi-js');


const Home = () => {

    var [visits, setVisits] = useState(0);
    var [loading, setLoading] = useState(true);
    useEffect(() => {
        countapi.visits().then((result) => {
            setVisits(result.value);
            setLoading(false);
        });  
    },[]);

    const guestLogin = () => {
        localStorage.setItem("Guest", true);
    }

    if(loading) {
        return (<div className="text-center upper-margin"> 
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> </span>
    </div>)
    }
    else {
        return(<div>
            <div className="heading">
            <Heading />
                <h1> Welcome To the Socialites </h1>
                <Link to="/login">
                    <div className="mt-1"> <button className="btn btn-lg expand"> Login </button> </div>
                </Link>
                <Link to="/register">
                    <div className="mt-1"> <button className="btn btn-lg expand"> Register </button> </div>
                </Link>
                <h3> OR </h3>
                <Link to="/allposts">
                    <div className="mt-1"> <button className="btn btn-lg expand" onClick={guestLogin}> Login as Guest </button> </div>
                </Link>
                <h4 className="mt-3"> No. of visits: {visits} </h4>
            </div>
            <div className="space"></div>
            <Footer />
        </div>);
    }
}

export default Home;