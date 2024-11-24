import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditPayment.css";
import { toast } from "react-toastify";

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState({
    orderID: "",
    name: "",
    email: "",
    amount: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/payment/get/${id}`
        );
        if (response.data.success) {
          setPaymentData(response.data.payment);
        } else {
          setError("Payment not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment:", error);
        setError("Something went wrong while fetching payment");
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/payment/update/${id}`,
        paymentData
      );
      navigate("/list-payment");
      toast.success('Payment updated')
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  if (loading) {
    return <div>Loading payment...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit-payment-container">
      <h2 style={{color:"black"}}>Edit Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{color:"black"}}>Status:</label>
          <select
            name="status"
            value={paymentData.status}
            onChange={handleChange}
            style={{marginTop:"10px"}}
            required
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="refund processing">Refund Processing</option>
            <option value="refund approved">Refund Approved</option>
          </select>
        </div>
        <button type="submit">Update Payment</button>
      </form>
    </div>
  );
};

export default EditPayment;
