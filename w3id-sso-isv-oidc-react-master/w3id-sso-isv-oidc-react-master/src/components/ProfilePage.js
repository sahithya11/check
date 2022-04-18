import React from "react";
import { connect } from "react-redux";

import "../css/ProfilePage.css";

const ProfilePage = ({
  profile
}) => {
  const {
    email,
    fullname,
    username,
    uid
  } = profile;

  return (
    <div className="Profile-page">
      <h2>{username}'s ProfilePage</h2>
      <div className="Profile-data">
        <div className="Profile-section">
          <h3>Full Name</h3>
          <p>{fullname}</p>
        </div>

        <div className="Profile-section">
          <h3>Email Address</h3>
          <p>{email}</p>
        </div>

        <div className="Profile-section">
          <h3>Employee ID</h3>
          <p>{uid}</p>
        </div>
      </div>
    </div>
  );
};

//Take the profile from the state instance
const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps
)(ProfilePage);
