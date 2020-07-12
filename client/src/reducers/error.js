const initialState = {
  errors: {}
};

export default function errorReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_ERROR":
      return {
        errors: action.payload
      };
    case "CLEAR_ERROR":
    return {
      errors:{}
    }
    default:
      return state;
  }
}
