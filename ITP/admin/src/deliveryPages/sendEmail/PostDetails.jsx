import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import emailjs from "@emailjs/browser";
import "./PostDetail.css";

const PostDetails = () => {
  const { id } = useParams(); // Extract the ID from the URL
  const [delivery, setDelivery] = useState(null); // State to store delivery details
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/delivery/delivery/${id}`
        );
        if (response.data.success) {
          setDelivery(response.data.delivery); // Store the delivery details in state
        } else {
          setError("Post not found or data missing.");
        }
      } catch (error) {
        setError("Error fetching post: " + error.message);
      }
    };

    const confirmDelivery = async () => {
      try {
        const response = await axios.put(confirmUrl);
        if (response.data.message === "Delivery confirmed successfully") {
          // Update delivery state and show success toast
          setDelivery({ ...delivery, status: "complete" });
          toast.success("Delivery confirmed successfully!");
        } else {
          console.error("Delivery confirmation failed:", response.data.message);
          toast.error("Failed to confirm delivery.");
        }
      } catch (error) {
        console.error("Error confirming delivery:", error);
        toast.error("Failed to confirm delivery.");
      }
    };

    fetchDelivery();
  }, [id]);
  const sendEmail = () => {
    const confirmUrl = `http://localhost:4000/api/delivery/confirm/${delivery.DeliveryId}`;

    const templateParams = {
      from_name: "LOCAL HELAYA TEAM.",
      to_name: delivery.DeliveryPerson,
      message: DOMPurify.sanitize(`
          <h1>Delivery Details</h1>
          <p><strong>Delivery ID:</strong> ${delivery.DeliveryId}</p>
          <p><strong>Delivery Person:</strong> ${delivery.DeliveryPerson}</p>
          <p><strong>Location:</strong> ${delivery.Locaton}</p>
          <p><strong>Date:</strong> ${delivery.Date}</p>
          <br />
          <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: green; text-decoration: none; border-radius: 5px;">Confirm Delivery</a>
        `),
      to_email: "it22291714@my.sliit.lk",
    };

    emailjs
      .send(
        "service_rgey76c",
        "template_so6g5y3",
        templateParams,
        "nd2CvGdPzv4XeX8YM"
      )
      .then(
        (response) => {
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          );
          alert("Email sent successfully!");
        },
        (err) => {
          console.error("Failed to send email.", err);
          alert("Failed to send email. Please try again.");
        }
      );
  };

  if (error) {
    return <p>{error}</p>; // Display error if any
  }

  if (!delivery) {
    return <p>Loading...</p>; // Show loading state while data is being fetched
  }

  // Once data is loaded, display delivery details
  return (
    <div className="delivery-details">
      <h1 className="delivery-title">Delivery Details</h1>
      <p className="delivery-info">
        <strong>Delivery ID:</strong> {delivery.DeliveryId}
      </p>
      <p className="delivery-info">
        <strong>Delivery Person:</strong> {delivery.DeliveryPerson}
      </p>
      <p className="delivery-info">
        <strong>Location:</strong> {delivery.Locaton}
      </p>
      <p className="delivery-info">
        <strong>Date:</strong> {delivery.Date}
      </p>
      <button className="send-email-btn" onClick={sendEmail}>
        Send Email
      </button>
    </div>
  );
};

export default PostDetails;
