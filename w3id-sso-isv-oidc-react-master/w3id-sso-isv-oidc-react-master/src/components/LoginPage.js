import React from "react";
import { connect } from "react-redux";
import Loader from "react-loader";

import * as sso from "../sso/oidcConfiguration.js";
import { generateStateAndNonce } from "../actions/tokenActions";

import "../css/LoginPage.css";

//Usually we already have the state and nonce variables, in case we don't check the generateparams function
const LoginPage = ({ state, nonce, generateParams }) => {
  if (state === null || nonce === null) {
    generateParams();
  } else {
    sso.beginAuth({ state, nonce });
  }

  return (
    <Loader />
  );
};

//We get the information from the store that we need.
const mapStateToProps = state => ({
  state: state.token.state,
  nonce: state.token.nonce
});

//We use the generateStateAndNonce from our tokenReducer file.
const mapDispatchToProps = dispatch => ({
  generateParams: () => dispatch(generateStateAndNonce())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
