// src/components/NavBar.jsx
import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ adminName, setAdminName }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if there's an admin name in local storage on load
    const storedAdminName = localStorage.getItem("adminName");
    if (storedAdminName) {
      setAdminName(storedAdminName);
    }
  }, [setAdminName]);

  const handleLogout = () => {
    // Clear the admin data from local storage
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");

    // Clear the admin state
    setAdminName("");

    // Redirect to the login page
    navigate("/admin/login");
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="Logo" />
      <div
        className="profile-section"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        {adminName && (
          <>
            <span className="admin-name">{adminName}<br />Admin</span>
            <img className="profile" src={assets.profile_image} alt="Profile" />
            {showDropdown && (
              <div className="dropdown">
                <Link onClick={handleLogout} className="logout-btn">
                  Logout{" "}
                  <img
                    src={assets.log_out_icon}
                    alt="Logout"
                    className="logout-icon"
                  />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
