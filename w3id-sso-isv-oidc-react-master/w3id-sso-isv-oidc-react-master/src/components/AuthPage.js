import React from "react";
import { connect } from "react-redux";
import {
  Redirect
} from "react-router-dom";
import { parse } from "query-string";
import jwtDecode from "jwt-decode";
import isEmpty from "lodash/isEmpty";
import Loader from "react-loader";
import axios from 'axios'

import { receiveAccessToken, receiveIdToken } from "../actions/tokenActions";
import { receiveProfileData } from "../actions/profileActions";

//This handles all that the callback url would do, takes the access_token and the idToken and adds it to the redux Store
const AuthPage = ({
  location,
  profile,
  receiveProfile,
  receiveTokens
}) => {
  if (isEmpty(profile)) {
    const hash = location.hash;
    const response = parse(hash);
    if (response.error) {
      alert(response.error_description);
      return <Redirect to="/home" />
    } else {
      receiveTokens(response.access_token, response.idToken);
      receiveProfile(jwtDecode(response.id_token));
    }
    // Render loader
    return <Loader />;
  } else {
    return <Redirect to="/profile" /> //If everything goes well we are redirected to the profile
  }
};

//Grabbing what we need for validations
const mapStateToProps = state => ({
  profile: state.profile,
  state: state.token.state,
  nonce: state.token.nonce
});

//Update our store with the data grabbed in the callback
const mapDispatchToProps = dispatch => ({
  receiveProfile: data => dispatch(receiveProfileData(data)),
  receiveTokens: (accessToken, idToken) => {
    dispatch(receiveAccessToken(accessToken));
    dispatch(receiveIdToken(idToken));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
