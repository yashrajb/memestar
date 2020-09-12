import axios from "axios";
import { setError, clearError } from "../actions/error";

export const upload = (form, history) => dispatch => {
  dispatch(clearError());
  axios
    .post(`/api/meme/`, form)
    .then(result => {
      history.push("/");
    })
    .catch(err => {
      dispatch(setError(err.response.data.error));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
    });
};

export const getMeme = ({skip,limit,user_id="",category=""},filter) => dispatch => {
  dispatch(clearError());
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
      dispatch(setError(err.response.data.error));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
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
      dispatch(setError(err.response.data.error));
      setTimeout(() => {
        dispatch(clearError());
      }, 4000);
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
