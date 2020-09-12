import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {

        if(localStorage.getItem("token")){
          return <Component {...props} />
        }else{
          return <Redirect
          to={{
            pathname: "/"
          }}
        />
        }
    }}
  />
);

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};
export default connect(mapStateToProps)(PrivateRoute);
