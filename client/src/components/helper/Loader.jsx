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

// const Loader = () => {
//     var style = {
//         width: '150px',
//         height: '100px',
//         borderRadius: '4p',
//         animation: 'move 1.2s ease-in-out infinite',
//     }
//     return (
//         <div style={style}>
//         <style>{`
//             @keyframes move {
//                 0%   {background-color: #ecf0f1;}
//                 50%  {background-color: #e0e5e9;}
//                 100% {background-color: #ecf0f1;}
//             }
//         `}</style>
//         </div>
//     )
// }

// export default Loader