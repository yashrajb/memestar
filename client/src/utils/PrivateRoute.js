import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {


      if(auth.loading){
        return (
          <div>
            <h1>Loading...</h1>
          </div>
        )
      }else{
        if(auth.isAuthenticated){
          return <Component {...props} />
        }else{
          return <Redirect
          to={{
            pathname: "/"
          }}
        />
        }
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
