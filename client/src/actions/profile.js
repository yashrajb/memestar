import { setError, clearError } from "./error";
import axios from "axios";

function setProfile(profile) {
  return {
    type: "SET_PROFILE",
    payload: profile
  };
}

export const getProfile = (name,skip=0) => dispatch => {
  dispatch(clearError());
  return axios
    .get(`/api/profile/${name}`,{params:{
      skip:skip
    }})
    .then(result => {
      return result.data.profile;
    })
    .catch(err => {
      dispatch(setError(err.response.data.error));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
    });
};

export const changeProfile = file => dispatch => {
  dispatch(clearError());
  axios.post(`/api/profile/edit/profilepic`,file)
  .then((updated) => {
    dispatch(setProfile(updated.data));
  })
  .catch((err) => {
    dispatch(setError(err.response.data.error))
    setTimeout(() => {
      dispatch(clearError());
    }, 4000);
  });
}

export const changeDetails = (detail,history) => dispatch => {
  dispatch(clearError());
  axios.post(`/api/profile/edit`,detail)
  .then((updated) => {
    dispatch(setProfile(updated.data));
    history.push(`/edit`);
  }).catch((err) => {
    dispatch(setError(err.response.data.error))
    setTimeout(() => {
      dispatch(clearError());
    }, 4000);
  });
}

export const currentProfile = () => dispatch => {
  dispatch(clearError());
  axios.get(`/api/profile/`)
  .then((updated) => {
   dispatch(setProfile(updated.data));
  }).catch((err) => {
    dispatch(setError(err.response.data.error));
    setTimeout(() => {
      dispatch(clearError());
    }, 4000);
  })
}