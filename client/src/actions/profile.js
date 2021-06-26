import { setMessage, clearMessage } from "./error";
import axios from "axios";

export function setProfile(profile) {
  return {
    type: "SET_PROFILE",
    payload: profile
  };
}

export const getProfile = (name,skip=0) => dispatch => {
  dispatch(clearMessage());
  return axios
    .get(`/api/profile/${name}`,{params:{
      skip:skip
    }})
    .then(result => {
      return result.data.profile;
    })
    .catch(err => {
      dispatch(setMessage({
        message:err.response?err.response.data.error:"something went wrong",
        type:"error"
      }));
    });
};

export const changeProfile = file => async (dispatch) => {
  dispatch(clearMessage());
  let uploadSignedURL = await axios.post("/api/profile/upload",{
    name:file.name,
    type:file.type,
  });
  let token = axios.defaults.headers.common["Authorization"];
  delete axios.defaults.headers.common["Authorization"]
  await axios.put(uploadSignedURL.data.url, file,{
    headers:{
      'Content-Type':file.type,
      'Access-Control-Allow-Origin': '*'
    }
  })
  axios.defaults.headers.common["Authorization"] = token;
  axios.post(`/api/profile/edit/profilepic`,{image:uploadSignedURL.data.key})
  .then((updated) => {
    dispatch({
      type: "SET_USER",
      payload: updated.data
    });
    localStorage.setItem("user_data",JSON.stringify(updated.data));
    dispatch(setMessage({
      message:"Your profile pic changed successfully",
      type:"success"
    }))
  })
  .catch((err) => {
    dispatch(setMessage({
      message:err.response?err.response.data.error:"something went wrong",
      type:"error"
    }));
  });
}

export const changeDetails = (detail,history) => dispatch => {
  dispatch(clearMessage());
  axios.post(`/api/profile/edit`,detail)
  .then((updated) => {
    dispatch({
      type: "SET_USER",
      payload:updated.data
    });
    localStorage.setItem("user_data",JSON.stringify(updated.data))
    dispatch(setMessage({
      message:"Your details changed successfully",
      type:"success"
    }))
  }).catch((err) => {
    dispatch(setMessage({
      message:err.response?err.response.data.error:"something went wrong",
      type:"error"
    }));
  });
}

export const currentProfile = () => dispatch => {
  dispatch(clearMessage());
  axios.get(`/api/profile/`)
  .then((updated) => {
    dispatch({
      type: "SET_USER",
      payload:updated.data
    });
  }).catch((err) => {
    
    dispatch(setMessage({
      message:err.response?err.response.data.error:"something went wrong",
      type:"error"
    }));
    
  })
}