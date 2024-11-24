import React, { useState, useContext } from "react";
import "./Homepage.css";
import "../../components/FoodDisplay/FoodDisplay.css";
import "../../components/FoodItem/FoodItem.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";
import AppDownload from "../../components/AppDownload/AppDownload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  const [menu, setMenu] = useState("Homepage");
  const { food_list } = useContext(StoreContext);

  const handleAddToCartToast = (itemName) => {
    toast.success(`${itemName} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (!food_list || food_list.length === 0) {
    return <p>No food items to display</p>;
  }

  const favoriteFoods = food_list.slice(3, 11);

  return (
    <div>
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
        </div>
      </div>
      <div className="top_topic">
        <h4>Customer Favorites</h4>
        <h1>Popular Dishes</h1>
      </div>

      <div className="food-display-list">
        {favoriteFoods.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            unit={item.unit}
            quantity={item.quantity}
            onAddToCart={handleAddToCartToast} // Pass the callback for toast notification
          />
        ))}
      </div>

      <div className="View_More_btn">
        <Link to={"/Home"}>
          <button>
            <b>View More</b>
          </button>
        </Link>
      </div>
      <div className="banner">
        <div className="Middle_topic">
          <h1>
            Dive in to Delights of
            <br />
            <div className="color_foods">Delectable Foods</div>
            <br />
            <p style={{ fontSize: "20px" }}>
              Empower local food businesses while enjoying the freshest dishes.
              <br /> Manage your orders effortlessly with our all-in-one
              platform.
            </p>
          </h1>
        </div>
        <div className="bannergirl_image">
          <img src={assets.bannergirl_image} alt="" />
        </div>
      </div>
      <AppDownload />
    </div>
  );
};

export default Homepage;
