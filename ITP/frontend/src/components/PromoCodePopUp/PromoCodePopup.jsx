import React from "react";
import "./PromocodePopup.css"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const PromocodePopup = ({ onClose }) => {
  const promocode = "discount10"; 

  // Function to copy the promocode to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(promocode)
      .then(() => {
        toast.success("Promocode copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Failed to copy promocode");
        console.error("Copy failed", error);
      });
  };

  return (
    <div className="promocode-popup-overlay">
      <div className="promocode-popup">
        <h2> <img className="promo-icon" src={assets.voucher} alt="" /> Promocode</h2>
        <Link className="promo-close-btn" onClick={onClose}>X</Link>
        <p>Use the promocode below to get a discount on your order:</p>
        <div className="promocode-container">
          <span className="promocode">{promocode}</span>
          <Link onClick={copyToClipboard}>
            <img src={assets.copy_icon} className="copy-icon" alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromocodePopup;
