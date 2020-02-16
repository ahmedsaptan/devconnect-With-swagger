import rootReducer from "./reducers";
import thunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";

const initalState = {};
const middleware = [thunk];

const store = createStore(rootReducer, initalState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;