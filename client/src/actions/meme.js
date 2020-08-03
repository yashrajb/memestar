import axios from "axios";
import { setError, clearError } from "../actions/error";

export const upload = (form, history) => dispatch => {
  dispatch(clearError());
  axios
    .post(`/api/meme/`, form)
    .then(result => {
      history.push("/dashboard");
    })
    .catch(err => {
      dispatch(setError(err.response.data));
    });
};

export const getMeme = () => dispatch => {
  dispatch(clearError());
  axios
    .get(`/api/meme/all`)
    .then(result => {
      dispatch(getMemes(result.data));
    })
    .catch(err => {
      dispatch(setError(err.response.data));
    });
};

export const getMemes = meme => {
  return {
    type: "GET_MEMES",
    payload: meme
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
      dispatch(setError(err.response.data));
    });
};

export const getStars = async () => {
  let stars = await axios.get(`/api/meme/stars`);
  return stars.data;
};


export const deleteMeme = (data,index) => dispatch => {
  console.log(index);
  axios.delete(`/api/meme/`,{data}).then((result) => {
    dispatch({
      type:"DELETE_MEME",
      payload:index
    })
  })
}

export const userMeme = (data) => {

return axios.get(`/api/username/${data}`)

}