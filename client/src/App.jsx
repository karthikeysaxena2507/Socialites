import React from "react";
import  {BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Posts from "./components/Posts";
import Create from "./components/Create";
import Register from "./components/Register";
import Login from "./components/Login";
import MyPosts from "./components/MyPosts";
import Edit from "./components/Edit";
import Profile from "./components/Profile";
import Reactions from "./components/Reactions";
import SearchResult from "./components/SearchResult";
import CompletePost from "./components/CompletePost";
import CompleteComment from "./components/completeComment";
import Verify from "./components/Verify";
import Verified from "./components/Verified";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import CategoryPosts from "./components/CategoryPosts";
import MyCategoryPosts from "./components/MyCategoryPosts";
import Users from "./components/Users";

function App() {
  return (
    <Router>
    <Route path="/" exact component={Home} />
    <Route path="/about/:username" component={About}/>
    <Route path="/allposts/:username" component={Posts} />
    <Route path="/allusers/:username" component={Users} />
    <Route path="/create/:username" component={Create} />
    <Route path="/myposts/:username" component={MyPosts} />
    <Route path="/post/:username/:id" component={Reactions} />
    <Route path="/edit/:username/:id" component={Edit} />
    <Route path="/profile/:user/:username" component={Profile} />
    <Route path="/complete/:username/:id" component={CompletePost} />
    <Route path="/categoryposts/:username/:type" component={CategoryPosts} />
    <Route path="/mycategoryposts/:username/:type" component={MyCategoryPosts} />
    <Route path="/verify/:username" component={Verify} />
    <Route path="/verified/:username" component={Verified} />
    <Route path="/forgot" component={ForgotPassword} />
    <Route path="/reset/:username" component={ResetPassword} />
    <Route path="/comment/:username/:commentId/:id" component={CompleteComment} />
    <Route path="/result/:username/:searchContent/:message/:type" component={SearchResult} />
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
