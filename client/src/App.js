import React, {useEffect} from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import Header from "./Components/layout/Header";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Dashboard from "./Components/dashboard";
import Error from "./Components/Error";
import uploadMeme from "./Components/uploadMeme";
import store from "./store/store";
import {setHeaderToken,logout} from "./actions/auth";
import Stars from "./Components/stars/";
import Settings from "./Components/settings";
import EditProfile from "./Components/Profile/EditProfile";
import UserProfile from "./Components/Profile/UserProfile";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
function App() {
  useEffect(() => {
    if (localStorage.token) {
      setHeaderToken(localStorage.token);
      const decoded = jwt_decode(localStorage.token);
      const profile = JSON.parse(localStorage.getItem("user_data"));
      store.dispatch({
        type:"SET_USER",
        payload:profile
      });
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
        <Error />
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/profile/:username" component={UserProfile} />
        <Route exact path="/stars" component={Stars} />
        <PrivateRoute exact path="/upload" component={uploadMeme} />
        <PrivateRoute exact path="/edit" component={EditProfile} />
        <PrivateRoute exact path="/settings" component={Settings} />
      </Router>
    </Provider>
  );
}

export default App;
