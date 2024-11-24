import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // State to store quantity errors for each item
  const [quantityError, setQuantityError] = useState({});
  
  // State for promo code and discount
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0); // Discount in percentage (e.g., 10 for 10%)

  const isCartEmpty = () => {
    const totalQuantity = food_list.reduce((total, item) => {
      return total + (cartItems[item._id] || 0);
    }, 0);
    return totalQuantity === 0;
  };

  // Handle promo code application
  const handleApplyPromoCode = () => {
    if (promoCode.toLowerCase() === "discount10") {
      setDiscount(10); // Apply 10% discount
      toast.success("Promo code applied! 10% discount added.");
    } else {
      setDiscount(0);
      toast.error("Invalid promo code");
    }
  };

  // Calculate the discounted total
  const getDiscountedTotal = () => {
    const subtotal = getTotalCartAmount();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  // Handle increasing quantity with stock check
  const handleIncrease = (item) => {
    if (cartItems[item._id] < item.quantity) {
      addToCart(item._id); // Add 1 to quantity
      setQuantityError((prevErrors) => ({
        ...prevErrors,
        [item._id]: "", // Clear any previous error
      }));
    } else {
      // If quantity exceeds available stock, show an error
      setQuantityError((prevErrors) => ({
        ...prevErrors,
        [item._id]: `Only ${item.quantity} left in stock!`,
      }));
    }
  };

  // Handle item removal with confirmation
  const handleRemoveItem = (itemId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );
    if (userConfirmed) {
      removeFromCart(itemId, true); // Remove all of this item from the cart
      toast.success("Item removed from cart");
    }
  };

  // Handle decreasing quantity with confirmation when it reaches 0
  const handleDecrease = (item) => {
    if (cartItems[item._id] === 1) {
      const userConfirmed = window.confirm(
        "The quantity will be 0. Do you want to remove this item from your cart?"
      );
      if (userConfirmed) {
        removeFromCart(item._id, true); // Remove the item completely
        toast.success("Item removed from cart");
      }
    } else {
      removeFromCart(item._id); // Decrease quantity by 1
      if (cartItems[item._id] <= item.quantity) {
        setQuantityError((prevErrors) => ({
          ...prevErrors,
          [item._id]: "", // Clear error if within stock limit
        }));
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (isCartEmpty()) {
      toast.error("Your cart is empty");
    } else {
      const discountedTotal = getDiscountedTotal() + 150; // Pass the discounted total + delivery fee
      navigate("/order", { state: { discountedTotal } }); // Pass discounted total via state
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <h2>Your Cart</h2>
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div className="cart-item-card" key={index}>
                <img
                  src={url + "/images/" + item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Rs. {item.price}.00</p>
                  <div className="quantity-control">
                    <img
                      src={assets.remove_icon_red}
                      alt="Decrease"
                      onClick={() => handleDecrease(item)} // Call the separate decrease handler
                      className="quantity-btn"
                    />
                    <p>{cartItems[item._id]}</p>
                    <img
                      src={assets.add_icon_green}
                      alt="Increase"
                      onClick={() => handleIncrease(item)} // Call the separate increase handler
                      className="quantity-btn"
                    />
                  </div>

                  {/* Display error message if quantity exceeds stock */}
                  {quantityError[item._id] && (
                    <p className="error-message">{quantityError[item._id]}</p>
                  )}

                  {/* Show total price for this item */}
                  <p className="cart-item-total">
                    Total: Rs. {item.price * cartItems[item._id]}.00
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item._id)} // Remove all of this item from the cart
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs. {getTotalCartAmount()}.00</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Promo Discount</p>
            <p>- Rs. {(getTotalCartAmount() * discount) / 100}0</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Rs. {getTotalCartAmount() === 0 ? 0 : 150}.00</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>
              Rs. {getTotalCartAmount() === 0
                ? 0
                : getDiscountedTotal() + 150}
              0
            </b>
          </div>
          <div className="cart-promocode">
            <p>If you have a promo code, Enter it here..</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromoCode}>Submit</button>
            </div>
          </div>
          <button onClick={handleProceedToCheckout}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
