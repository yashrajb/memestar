const initialState = {
  meme: [],
  loading:true
};

const memeReducer = function(state = initialState, action) {
  switch (action.type) {
    case "GET_MEMES":
      let meme = action.payload;
      return {
        ...state,
        meme,
        loading:false
      };
    case "UPDATE_MEME_LIKE":
    let memes = state.meme.splice(0);
    memes[action.payload]["user_liked"] = !memes[action.payload]["user_liked"];
    if(memes[action.payload]["user_liked"]){
      memes[action.payload]["count"]++;
    }else{
      memes[action.payload]["count"]--;
    }
    return {
      ...state,
      meme:memes,
      loading:false
    };
    case "DELETE_MEME":
      let newMemes = [
        ...state.meme.slice(0,action.payload),
        ...state.meme.slice(action.payload+1)
      ]
      return {
        meme:newMemes,
        loading:false
      }
    default:
      return state;
  }
};

export default memeReducer;
