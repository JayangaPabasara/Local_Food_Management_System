// FoodItem.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodItem = ({ id, name, price, description, image, unit, quantity }) => {
  const { addToCart } = useContext(StoreContext);

  const handleAddToCart = () => {
    if (quantity === 0) {
      // Show toast if item is out of stock
      toast.error(`${name} is out of stock!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      // Add to cart if item is in stock
      addToCart(id);
      toast.success(`${name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleItemClick = (e) => {
    if (quantity === 0) {
      e.preventDefault(); // Prevent navigation if out of stock
      // Optionally show a toast if the item is out of stock when clicked
      toast.error(`${name} is out of stock!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="food-item">
      <Link to={`/food/${id}`} onClick={handleItemClick}>
        <div className="food-item-img-container">
          <img
            className={`food-item-image ${quantity === 0 ? "blurred" : ""}`}
            src={`http://localhost:4000/images/${image}`}
            alt={name}
          />
          {quantity === 0 && (
            <div className="out-of-stock-label">Out of Stock</div>
          )}
        </div>
      </Link>
      <div className="food-item-info">
          <h3 style={{marginBottom:"10px", fontWeight:"600"}}>{name}</h3>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-price-container">
          <div className="food-item-price-info">
            <p className="food-item-price">Rs.{price}.00</p>
            <p className="food-item-include">{unit}</p>
          </div>
          <button
            className={`add-to-cart-btn ${quantity === 0 ? "disabled" : ""}`}
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
