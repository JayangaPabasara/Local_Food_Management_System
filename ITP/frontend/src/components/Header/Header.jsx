import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="overlay"></div>
      <div className="header-contents">
        <h2>
          Taste the Tradition, Delivered <br />
          to You.
        </h2>
        <p>
          Empower local food businesses while enjoying the freshest dishes.
          Manage your orders effortlessly with our all-in-one platform.
        </p>
        <button>
          <a href="#food-display">
            <b>View Menu</b>
          </a>
        </button>
      </div>
    </div>
  );
};

export default Header;
