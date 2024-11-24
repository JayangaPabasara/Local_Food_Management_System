import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessPage from "./pages/Success/SuccessPage";
import Order from "./pages/User/Order";
import Homepage from "./pages/Homepage/Homepage.jsx";
import FoodPreview from "./components/FoodPreview/FoodPreview.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import ContactUs from "./pages/ContactUs/ContactUs.jsx";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition:Bounce
        />
        <Navbar
          setShowLogin={setShowLogin}
          handleSearch={(term) => setSearchTerm(term)}
        />
        <Routes>
          <Route path="/" element={<Homepage searchTerm={searchTerm} />} />
          <Route
            path="/Home"
            element={
              <Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/order"
            element={<PlaceOrder setShowLogin={setShowLogin} />}
          />{" "}
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/view/orders" element={<Order />} />
          <Route path="/food/:id" element={<FoodPreview />} />
          <Route path="/aboutus" element={<AboutUs/>} />
          <Route path="/contactus" element={<ContactUs/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
