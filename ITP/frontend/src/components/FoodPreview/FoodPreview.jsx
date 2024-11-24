import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./FoodPreview.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodPreview = () => {
  const { food_list, addToCart } = useContext(StoreContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const foodItem = food_list.find((item) => item._id === id);

  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      const newQuantity = Number(value);

      if (newQuantity > foodItem.quantity) {
        setError(`The quantity exceeds the available stock of ${foodItem.quantity}.`);
      } else {
        setError("");
      }

      setQuantity(newQuantity);
    } else {
      setError("Please enter a valid quantity (positive whole numbers only).");
    }
  };

  // Handle increase button click
  const handleIncrease = () => {
    if (quantity < foodItem.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      setError(""); // Clear error if within stock limit
    } else {
      setError(`Only ${foodItem.quantity} left in stock!`);
    }
  };

  // Handle decrease button click
  const handleDecrease = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
    setError(""); // Clear error when decreasing
  };

  // Handle add to cart click
  const handleAddToCart = () => {
    if (quantity > foodItem.quantity) {
      setError(`The quantity exceeds the available stock of ${foodItem.quantity}.`);
    } else if (quantity > 0) {
      addToCart(foodItem._id, quantity); // Pass the quantity to addToCart
      navigate("/cart");
      toast.success(`${foodItem.name} added to cart!`)
    } else {
      setError("Quantity must be greater than 0.");
    }
  };

  return (
    <div className="food-preview-container">
      <img
        src={`http://localhost:4000/images/${foodItem.image}`}
        alt={foodItem.name}
        className="food-preview-image"
      />
      <div className="food-preview-info">
        <h2>{foodItem.name}</h2>
        <p>{foodItem.description}</p>
        <p className="food-preview-price">Price: Rs.{foodItem.price}.00</p>

        <div className="quantity-selector">
          <button onClick={handleDecrease}>-</button>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <button onClick={handleIncrease}>+</button>
        </div>

        {/* Show error message if quantity exceeds stock */}
        {error && <p className="error-message">{error}</p>}

        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={quantity > foodItem.quantity}>
          Add {quantity} to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodPreview;
