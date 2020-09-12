import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import authReducer from "../reducers/auth";
import errorReducer from "../reducers/error";
import memeReducer from "../reducers/meme";
const rootReducer = combineReducers({auth:authReducer,error:errorReducer,meme:memeReducer});
const store = createStore(rootReducer,applyMiddleware(thunk,logger));
export default store;