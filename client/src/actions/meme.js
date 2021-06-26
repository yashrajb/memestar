import axios from "axios";
import { setMessage, clearMessage } from "../actions/error";

export const upload = ({meme,category}, history) => async dispatch => {
  
  dispatch(clearMessage());
  let uploadSignedURL = await axios.post("/api/meme/upload",{
    name:meme.name,
    type:meme.type,
  });
  
  let token = axios.defaults.headers.common["Authorization"];
  delete axios.defaults.headers.common["Authorization"]
  await axios.put(uploadSignedURL.data.url, meme,{
    headers:{
      'Content-Type':meme.type,
      'Access-Control-Allow-Origin': '*'
    }
  })
  axios.defaults.headers.common["Authorization"] = token;
  return axios
    .post(`/api/meme/`, {imageURL:uploadSignedURL.data.key,category})
    .then(result => {
      history.push("/")
      return dispatch(setMessage({
        message:"Your meme uploaded successfully",
        type:"success"
      }))
    })
    .catch(err => {
      dispatch(setMessage({
        message:err.response?err.response.data.error:"something went wrong",
        type:"error"
      }));
      return err;
    });
};

export const getMeme = ({skip,limit,user_id="",category=""},filter) => dispatch => {
  dispatch(clearMessage());
  return axios
    .get(`/api/meme/all`,{params:{
      skip,
      limit:2,
      user_id,
      category
    }})
    .then(result => {
      dispatch(getMemes(result.data,filter));
      return result.data;
    })
    .catch(err => {
      dispatch(setMessage({
        message:err.response?err.response.data.error:"something went wrong",
        type:"error"
      }));
    });
};

export const getMemes = (meme,filter) => {
  return {
    type: "GET_MEMES",
    payload: meme,
    filter
  };
};

export const updateLike = memeIndex => {
  return {
    type: "UPDATE_MEME_LIKE",
    payload: memeIndex
  };
};

export const LikeOrUnlikeMeme = (memeIndex, id) => dispatch => {
  axios
    .post(`/api/meme/like/${id}`)
    .then(res => dispatch(updateLike(memeIndex)))
    .catch(err => {
      dispatch(setMessage({
        message:err.response?err.response.data.error:"something went wrong",
        type:"error"
      }));
    });
};

export const getStars = async () => {
  let stars = await axios.get(`/api/meme/stars`);
  return stars.data;
};


export const deleteMeme = (data,index) => dispatch => {
  axios.delete(`/api/meme/`,{data}).then((result) => {
    dispatch({
      type:"DELETE_MEME",
      payload:index
    })
  })
}

