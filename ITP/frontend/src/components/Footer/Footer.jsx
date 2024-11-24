import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img
            src={assets.logo}
            className="footer-logo"
            alt="Local Helaya Food Logo"
          />
          <p>
            Localහෙළයා Food is committed to bringing you the finest and freshest
            local delicacies right to your doorstep. We take pride in supporting
            local farmers and producers, ensuring that every meal is made from
            the best ingredients our region has to offer. Join us in celebrating
            the rich culinary heritage of our community, one delicious dish at a
            time. © 2024 Localහෙළයා Food. All rights reserved.
          </p>
          <div className="footer-social-icons">
            <a
              href="https://web.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a
              href="https://www.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.linkedin_icon}
                alt="LinkedIn"
                style={{ height: "35px", width: "35px" }}
              />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/about-us">About Us</a>
            </li>
            <li>
              <a href="/delivery">Delivery</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy & Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in Touch</h2>
          <ul>
            <li>041-22233044</li>
            <li>
              <a href="mailto:localhelaya@gmail.com">localhelaya@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © Localහෙළයා.com - All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
