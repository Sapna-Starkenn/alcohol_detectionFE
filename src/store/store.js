// store/store.js
import { createStore, combineReducers } from "redux";
import driverReducer from "./actions/reducers/driverReducer";

const rootReducer = combineReducers({
  driver: driverReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
