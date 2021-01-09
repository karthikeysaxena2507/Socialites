import React, { useMemo, useState } from "react";
import  {BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Posts from "./components/Posts";
import Create from "./components/Create";
import Register from "./components/Register";
import Login from "./components/Login";
import MyPosts from "./components/MyPosts";
import Edit from "./components/Edit";
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
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/forgot" component={ForgotPassword} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/about" component={About}/>
        <Route exact path="/allposts" component={Posts} />
        <Route exact path="/allusers" component={Users} />
        <Route exact path="/create" component={Create} />
        <Route exact path="/myposts" component={MyPosts} />
        <Route exact path="/post/:id" component={Reactions} />
        <Route exact path="/edit/:id" component={Edit} />
        <Route exact path="/complete/:id" component={CompletePost} />
        <Route exact path="/categoryposts/:type" component={CategoryPosts} />
        <Route exact path="/mycategoryposts/:type" component={MyCategoryPosts} />
        <Route exact path="/verify/:username" component={Verify} />
        <Route exact path="/verified/:username" component={Verified} />
        <Route exact path="/reset/:username" component={ResetPassword} />
        <Route exact path="/comment/:commentId/:id" component={CompleteComment} />
        <Route exact path="/result/:searchContent/:message/:type" component={SearchResult} />
        <Route exact path="*" component={()=> "ERROR 404 PAGE NOT FOUND"} />
      </Switch>
  </Router>
  );
}

export default App;
