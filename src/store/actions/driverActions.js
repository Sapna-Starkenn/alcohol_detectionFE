// store/actions/driverActions.js
import {
  SET_ALCOHOL_STATUS,
  SET_SPEED,
  SET_DRIVER_IMAGE,
  SET_IS_PLAYING,
} from "./types";

export const setAlcoholStatus = (status) => ({
  type: SET_ALCOHOL_STATUS,
  payload: status,
});

export const setSpeed = (speed) => ({
  type: SET_SPEED,
  payload: speed,
});

export const setDriverImage = (imageUrl) => ({
  type: SET_DRIVER_IMAGE,
  payload: imageUrl,
});

export const setIsPlaying = (isPlaying) => ({
  type: SET_IS_PLAYING,
  payload: isPlaying,
});
