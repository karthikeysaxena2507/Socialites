import React from "react";
import {BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import PostList from "./components/PostList";
import Create from "./components/Create";
import Register from "./components/Register";
import Login from "./components/Login";
import MyPostList from "./components/MyPostList";
import Edit from "./components/Edit";
import Profile from "./components/Profile";
import Reactions from "./components/Reactions";
import Result from "./components/Result";
import CompletePost from "./components/CompletePost";
import CompleteComment from "./components/completeComment";

function App() {
  return (
    <Router>
    <Route path="/" exact component={Home} />
    <Route path="/about/:username" component={About}/>
    <Route path="/allposts/:username" component={PostList} />
    <Route path="/create/:username" component={Create} />
    <Route path="/myposts/:username" component={MyPostList} />
    <Route path="/post/:username/:id" component={Reactions} />
    <Route path="/edit/:username/:id" component={Edit} />
    <Route path="/profile/:username" component={Profile} />
    <Route path="/complete/:username/:id" component={CompletePost} />
    <Route path="/comment/:username/:commentId/:id" component={CompleteComment} />
    <Route path="/result/:username/:searchContent/:message" component={Result} />
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
