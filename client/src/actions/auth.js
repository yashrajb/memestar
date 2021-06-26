import axios from "axios";
import { setMessage, clearMessage } from "./error";
import jwt_decode from "jwt-decode";
import {getMemes} from "./meme";
export const register = (form, history) => dispatch => {
  dispatch(clearMessage());
  return axios
    .post(`/api/users/register`, form)
    .then(result => {
      history.push("/login");
      dispatch(setMessage({
        message:"Registration successfull. Now you can login",
        type:"success"
      }));
    })
    .catch(err => {
      
      dispatch(setMessage({
        message:err.response?err.response.data.error:"something went wrong",
        type:"error"
      }));
      return err;
    });
};

export const setUser = result => {
  return {
    type: "SET_USER",
    payload: result
  };
};

export const setHeaderToken = token => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const login = (form,history) => dispatch => {
  dispatch(clearMessage());
 return axios
    .post(`/api/users/login`, form)
    .then(result => {
      let { token,profile } = result.data;
      let jwtDecodedToken = jwt_decode(token);
      localStorage.setItem("token", token);
      localStorage.setItem('user_data',JSON.stringify(profile));
      setHeaderToken(token);
      dispatch(setUser(profile))
    })
    .catch(err => {
      dispatch(setMessage({
        message:err.response?err.response.data.error:"something went wrong",
        type:"error"
      }));
      return err;
    });
};

export const logout = () => dispatch => {
  dispatch(clearMessage());
  localStorage.removeItem("token");
  localStorage.removeItem("user_data");
  setHeaderToken(false);
  dispatch(setUser({}));
  dispatch(getMemes([]));
};

export const updateProfileReducer = image => {
  return {
    type: "CHANGED_PROFILE_PICTURE",
    payload: image
  };
};

export const changePassword = passwordObj => dispatch => {
  dispatch(clearMessage());
  axios
    .post(`/api/users/changepassword`, passwordObj)
    .then(result => {
      dispatch(logout());
      dispatch({
        message:"Your Password successfully changed. Please re-login",
        type:"success"
      })
    })
    .catch(err => {
      dispatch(setMessage({
        message:err.response?err.response.data.error:"something went wrong",
        type:"error"
      }));
    });
};

export const deleteAccount = () => dispatch => {
  dispatch(clearMessage());
  axios.post(`/api/profile/deleteaccount`).then((result) => {
    dispatch(logout());
    dispatch({
      message:"Your successfully deleted account.",
      type:"success"
    })
  }).catch(err => {
    dispatch(setMessage({
      message:err.response?err.response.data.error:"something went wrong",
      type:"error"
    }));
  });
}





