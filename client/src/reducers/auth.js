const initialState = {
  isAuthenticated: false,
  user: {},
  profile: {},
  loading:true
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        isAuthenticated: Object.keys(action.payload).length ? true : false,
        user: action.payload,
        loading:false
      };
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,
        loading:false
      };
    default:
      return state;
  }
}

export default authReducer;
