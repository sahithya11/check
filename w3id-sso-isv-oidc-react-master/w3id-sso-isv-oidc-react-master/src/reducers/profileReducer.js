import { RECEIVE_PROFILE_DATA, CLEAR_ALL } from "../utils/actionTypes";

const profileReducer = (state = null, { type, payload }) => {
  switch (type) {
    case RECEIVE_PROFILE_DATA:
      return {
        email: payload.profile.sub,
        fullname: payload.profile.name,
        username: payload.profile.preferred_username,
        uid: payload.profile.uid
      };
    case CLEAR_ALL:
      return null;
    default:
      return state;
  }
};

export default profileReducer;
