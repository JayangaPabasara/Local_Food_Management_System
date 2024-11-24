import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <h1 className="contact-us-heading">Get in Touch</h1>
      <p className="contact-us-intro">
        We’d love to hear from you! Reach out to us for any inquiries or support.
      </p>

      <div className="contact-details-form">
        {/* Left Section: Contact Details */}
        <div className="contact-details">
          <h2>Contact Information</h2>
          <p>📍 No. 123, Kumarathunga Street, Colombo, Sri Lanka</p>
          <p>📞 <a href="tel:+94726370884">+94 72-637-0884</a></p>
          <p>📧 <a href="mailto:localhelaya@gmail.com">localhelaya@gmail.com</a></p>
          <p>🕒 Monday to Friday: 9 AM - 5 PM</p>
        </div>

        {/* Right Section: Contact Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <input
              type="text"
              placeholder="Your Name"
              className="form-input"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className="form-input"
              required
            />
            <textarea
              placeholder="Your Message"
              className="form-textarea"
              required
            ></textarea>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
