import React from "react";
import  { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Pages/Home";
import About from "./components/Pages/About";
import Posts from "./components/Pages/Posts";
import Create from "./components/Pages/Create";
import Register from "./components/Pages/Register";
import Login from "./components/Pages/Login";
import MyPosts from "./components/Pages/MyPosts";
import Edit from "./components/Pages/Edit";
import Reactions from "./components/Pages/Reactions";
import SearchResult from "./components/Pages/SearchResult";
import CompletePost from "./components/Pages/CompletePost";
import CompleteComment from "./components/Pages/completeComment";
import Verify from "./components/Pages/Verify";
import Verified from "./components/Pages/Verified";
import ForgotPassword from "./components/Pages/ForgotPassword";
import ResetPassword from "./components/Pages/ResetPassword";
import CategoryPosts from "./components/Pages/CategoryPosts";
import MyCategoryPosts from "./components/Pages/MyCategoryPosts";
import Users from "./components/Pages/Users";
import Rooms from "./components/Pages/Rooms";
import Profile from "./components/Pages/Profile";
import PageNotFound from "./components/Pages/PageNotFound";
import {MessageContext} from "./utils/Context.js";

import "./App.css";
let guestMessage = "You Logged In as a Guest, Please Register or login with an existing ID to make changes";

function App() {
  return (
    <Router>
    <MessageContext.Provider value = {guestMessage}>
      <Routes>
          <Route exact path = "/" element = {<Home />} />
          <Route exact path = "/forgot" element = {<ForgotPassword />} />
          <Route exact path = "/login" element = {<Login />} />
          <Route exact path = "/register" element = {<Register />} />
          <Route exact path = "/about" element = {<About />}/>
          <Route exact path = "/allposts" element = {<Posts />} />
          <Route exact path = "/profile/:user" element = {<Profile />} />
          <Route exact path = "/room/:roomId" element = {<Rooms />} />
          <Route exact path = "/allusers" element = {<Users />} />
          <Route exact path = "/create" element = {<Create />} />
          <Route exact path = "/myposts" element = {<MyPosts />} />
          <Route exact path = "/post/:id" element = {<Reactions />} />
          <Route exact path = "/edit/:id" element = {<Edit />} />
          <Route exact path = "/complete/:id" element = {<CompletePost />} />
          <Route exact path = "/categoryposts/:type" element = {<CategoryPosts />} />
          <Route exact path = "/mycategoryposts/:type" element = {<MyCategoryPosts />} />
          <Route exact path = "/verify/:token" element = {<Verify />} />
          <Route exact path = "/verified/:token" element = {<Verified />} />
          <Route exact path = "/reset/:token" element = {<ResetPassword />} />
          <Route exact path = "/comment/:commentId/:id" element = {<CompleteComment />} />
          <Route exact path = "/result/:searchContent/:message/:type" element = {<SearchResult />} />
          <Route path = "*" element = {<PageNotFound />} />
      </Routes>
    </MessageContext.Provider>
  </Router>
  );
}

export default App;
