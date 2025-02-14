import {
  SET_ALCOHOL_STATUS,
  SET_DRIVER_IMAGE,
  SET_IS_PLAYING,
  SET_SPEED,
} from "../types";

const initialState = {
  alcoholStatus: 3, // Default value
  speed: 0,
  driverImage: null,
  isPlaying: false,
};

const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALCOHOL_STATUS:
      return {
        ...state,
        alcoholStatus: action.payload,
      };
    case SET_SPEED:
      return {
        ...state,
        speed: action.payload,
      };
    case SET_DRIVER_IMAGE:
      return {
        ...state,
        driverImage: action.payload,
      };
    case SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload,
      };
    default:
      return state;
  }
};

export default driverReducer;
