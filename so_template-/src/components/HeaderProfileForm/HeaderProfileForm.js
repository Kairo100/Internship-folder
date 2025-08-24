import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderProfileForm = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
    closeProfile();
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <div className="header-profile-form-wrapper">
      <button className="profile-toggle-btn" onClick={toggleProfile}>
        <Link
          onClick={ClickHandler}
          to="https://dashboard.sokaab.com/login/"
          style={{
            backgroundColor: "#2C3E50",
            color: "#fff",
            borderRadius: "5px",
            padding: "15px",
            marginLeft: "2px",
          }}
        >
          Login
        </Link>
      </button>
    </div>
  );
};

export default HeaderProfileForm;
