import axios from "axios";
import { setError, clearError } from "./error";
import jwt_decode from "jwt-decode";
import { currentProfile } from "./profile";
import {getMemes} from "./meme";
export const register = (form, history) => dispatch => {
  dispatch(clearError());
  return axios
    .post(`/api/users/register`, form)
    .then(result => {
      history.push("/login");
    })
    .catch(err => {
      dispatch(setError(err.response.data.error));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
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
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const login = form => dispatch => {
  dispatch(clearError());
 return axios
    .post(`/api/users/login`, form)
    .then(result => {
      let { token } = result.data;
      localStorage.setItem("token", token);
      let jwtDecodedToken = jwt_decode(token);
      setHeaderToken(token);
      dispatch(setUser(jwtDecodedToken));
      dispatch(currentProfile());
    })
    .catch(err => {
      if(err.response.data){
        dispatch(setError(err.response.data.error));
        setTimeout(() => {
          dispatch(clearError());
        }, 4000);
      }
      return err;
    });
};

export const logout = () => dispatch => {
  dispatch(clearError());
  localStorage.removeItem("token");
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
  dispatch(clearError());
  axios
    .post(`/api/users/changepassword`, passwordObj)
    .then(result => {
      dispatch(logout());
    })
    .catch(err => {
      dispatch(setError(err.response.data.error));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
    });
};

export const deleteAccount = () => dispatch => {
  dispatch(clearError());
  axios.post(`/api/profile/deleteaccount`).then((result) => {
    dispatch(logout());
  }).catch(err => {
    dispatch(setError(err.response.data.error));
    setTimeout(() => {
      dispatch(clearError());
    }, 4000);
  });
}





