import { RECEIVE_PROFILE_DATA } from "../utils/actionTypes";

export const receiveProfileData = profile => ({
  type: RECEIVE_PROFILE_DATA,
  payload: { profile }
});
