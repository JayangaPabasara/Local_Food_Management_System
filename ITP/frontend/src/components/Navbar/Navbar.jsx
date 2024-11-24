import React, { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PromocodePopup from "../PromoCodePopUp/PromoCodePopup.jsx"

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const [showPromocodePopup, setShowPromocodePopup] = useState(false);
  const { getTotalCartAmount, token, setToken, userName, setCartItems } =
    useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:4000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUserName(data.user.name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({}); // Clear cart items on logout
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" onClick={() => setMenu("")}>
        <img
          src={assets.logo}
          alt=""
          className="logo"
          style={{ width: "80px" }}
        />
      </Link>
      <ul className="navbar-menu">
        <Link to="/">
          <li
            onClick={() => setMenu("Home")}
            className={menu === "Home" ? "active" : ""}
          >
            <b>Home</b>
          </li>
        </Link>
        <Link to="/Home">
          <li
            onClick={() => setMenu("Shop")}
            className={menu === "Shop" ? "active" : ""}
          >
            <b>Shop</b>
          </li>
        </Link>
        <Link to="/aboutus">
          <li
            onClick={() => setMenu("About Us")}
            className={menu === "About Us" ? "active" : ""}
          >
            <b>About Us</b>
          </li>
        </Link>
        <Link to="/contactus">
          <li
            onClick={() => setMenu("Contact Us")}
            className={menu === "Contact Us" ? "active" : ""}
          >
            <b>Contact Us</b>
          </li>
        </Link>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" style={{ width: "40px" }} />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <span className="user-name">{userName}</span>
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} alt="" />
                <Link to={"/view/orders"}>
                  <p>Orders</p>
                </Link>
              </li>
              <hr />
              <li className="promo-code-link" onClick={() => setShowPromocodePopup(true)}>
                <p> <img src={assets.voucher} alt="" /> Promocode</p>
              </li>
              <hr />
              <li onClick={logOut}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
      {showPromocodePopup && (
        <PromocodePopup onClose={() => setShowPromocodePopup(false)} />
      )}
    </div>
  );
};

export default Navbar;
