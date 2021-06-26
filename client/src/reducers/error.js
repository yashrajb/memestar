const initialState = {
  message:'',
  type:"error"
};

export default function errorReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_MESSAGE":
      let {message,type} = action.payload;
      return {
        message,
        type
      };
    case "CLEAR_MESSAGE":
    return {
          message:'',
          type:'error'
    };
    default:
      return state;
  }
}
