import React, {useEffect} from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import Header from "./components/layout/Header";
import Main from "./components/Main";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard";
import uploadMeme from "./components/uploadMeme";
import store from "./store/store";
import {setUser,setHeaderToken,logout} from "./actions/auth";
import Stars from "./components/stars/";
import {currentProfile} from "./actions/profile";
import Settings from "./components/settings";
import EditProfile from "./components/Profile/EditProfile";
import UserProfile from "./components/Profile/UserProfile";
import "./App.css";

function App() {
  useEffect(() => {
    if (localStorage.token) {
      setHeaderToken(localStorage.token);
      const decoded = jwt_decode(localStorage.token);
      store.dispatch(setUser(decoded));
      store.dispatch(currentProfile());
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        store.dispatch(logout());
        window.location.href = '/';
      }
    }
  })

  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/profile/:username" component={UserProfile} />
        <Route exact path="/stars" component={Stars} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/upload" component={uploadMeme} />
        <PrivateRoute exact path="/edit" component={EditProfile} />
        <PrivateRoute exact path="/settings" component={Settings} />
      </Router>
    </Provider>
  );
}

export default App;
