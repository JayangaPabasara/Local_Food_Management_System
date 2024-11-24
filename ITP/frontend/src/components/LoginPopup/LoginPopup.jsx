import React, { useContext, useState } from "react"; 
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    address1: "",
    address2: "",
    hometown: "",
    phone: "",
    username: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
  
    try {
      const response = await axios.post(newUrl, data);
  
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
        toast.success("Login Successful!", { autoClose: 3000 });
      } else {
        toast.error(response.data.massage || "An error occurred. Please try again.", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { autoClose: 3000 });
    }
  };
  
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => {
              setShowLogin(false);
            }}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your Name"
                required
              />
              <input
                name="address1"
                onChange={onChangeHandler}
                value={data.address1}
                type="text"
                placeholder="Address Line 1"
                required
              />
              <input
                name="username"
                onChange={onChangeHandler}
                value={data.username}
                type="text"
                placeholder="User Name"
                required
              />
              
              <input
                name="address2"
                onChange={onChangeHandler}
                value={data.address2}
                type="text"
                placeholder="Address Line 2"
              />
              <input
                name="phone"
                onChange={onChangeHandler}
                value={data.phone}
                type="tel"
                placeholder="Phone Number"
                pattern="[0-9]{10}"  // 10-digit phone number validation
                required
              />
              <input
                name="hometown"
                onChange={onChangeHandler}
                value={data.hometown}
                type="text"
                placeholder="Home Town"
                required
              />
            </>
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your Email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condtion">
          <input type="checkbox" required />
          <p>By Continue, I Agree to terms.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already Have an Account?
            <span onClick={() => setCurrState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
