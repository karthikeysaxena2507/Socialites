import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
    return (<div className="text-center upper-margin"> 
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-4"/> </span>
        <span> </span>
    </div>)
}

export default Loader;