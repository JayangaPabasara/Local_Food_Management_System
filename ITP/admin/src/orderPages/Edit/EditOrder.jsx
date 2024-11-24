import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditOrder.css";
import { toast } from "react-toastify";

const EditOrder = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/order/${id}`
        );
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError("Order not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Something went wrong while fetching order");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/order/update/${id}`, order);
      navigate("/order");
      toast.success("Order updated");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Order update error");
    }
  };

  if (loading) {
    return <div>Loading order...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit-order-container">
      <h2 style={{ color: "black" }}>Edit Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ color: "black" }}>Status:</label>
          <select
            style={{ marginTop: "10px" }}
            value={order.status}
            onChange={(e) => setOrder({ ...order, status: e.target.value })}
          >
            <option value="Order Processing">Order Processing</option>
            <option value="Order Completed">Order Completed</option>
          </select>
        </div>
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
};

export default EditOrder;
