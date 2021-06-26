const initialState = {
  isAuthenticated: false,
  
  profile: localStorage.getItem("user_data")?JSON.parse(localStorage.getItem("user_data")):{},
  loading:true
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        isAuthenticated: Object.keys(action.payload).length ? true : false,
        profile: action.payload,
        loading:false
      };
    default:
      return state;
  }
}

export default authReducer;
