import React from "react";
import "./SuccessPage.css";

const SuccessPage = () => {
  return (
    <div className="success-container">
      <div className="checkmark">
        <svg
          className="checkmark-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -1 40 80"
        >
          <circle
            className="checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
        </svg>
      </div>
      <h1>Order Placed Successfully!</h1>
      <p>
        Your order has been confirmed. You will receive a confirmation email
        shortly.
      </p>
      <h3>
        <a href="/">Back To Home.</a>
      </h3>
    </div>
  );
};

export default SuccessPage;
