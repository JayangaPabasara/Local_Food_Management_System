import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddSupplierPayment.css";
import "../paymentStyle/paymentform.css";

const AddSupplierPayment = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    orderID: "",
    supplierEmail: "",
    totalAmount: "",
    orderDate: new Date(),
  });

  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({
    supplierEmail: "",
    totalAmount: "",
    orderDate: "",
  });

  const navigate = useNavigate();

  // Fetch suppliers who have placed orders
  useEffect(() => {
    const fetchSuppliersWithOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/supplier-orders/suppliers-with-orders"
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers with orders", error);
      }
    };

    fetchSuppliersWithOrders();
  }, []);

  // Fetch the selected supplier's order details
  const fetchSupplierOrderDetails = async (supplierId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/supplier-orders/by-supplier/${supplierId}`
      );

      if (response.data.length > 0) {
        const { _id, supplier, total, orderDate } = response.data[0];
        setFormData((prevData) => ({
          ...prevData,
          supplierName: supplier.name,
          orderID: _id,
          supplierEmail: supplier.email,
          totalAmount: total,
          orderDate: orderDate ? new Date(orderDate) : new Date(),
        }));
      } else {
        toast.error("No orders found for the selected supplier");
      }
    } catch (error) {
      console.error("Error fetching supplier order details", error);
      toast.error("Failed to fetch order details");
    }
  };

  const validateForm = () => {
    const newErrors = { supplierEmail: "", totalAmount: "", orderDate: "" };
    let isValid = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.supplierEmail)) {
      newErrors.supplierEmail = "Please enter a valid email address.";
      isValid = false;
    }

    if (Number(formData.totalAmount) < 0) {
      newErrors.totalAmount = "Total amount cannot be negative.";
      isValid = false;
    }

    const today = new Date();
    if (formData.orderDate < today.setHours(0, 0, 0, 0)) {
      newErrors.orderDate = "Order date cannot be a past date.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:4000/api/expenses/create", formData);
        toast.success("Payment added");
        navigate("/list-payment");
      } catch (error) {
        toast.error("Failed to add payment");
      }
    }
  };

  return (
    <div className="supplier-payment-container">
      <h2 className="supplier-payment-heading">Add Supplier Payment</h2>
      <form onSubmit={handleSubmit} className="supplier-payment-form">
        <label className="supplier-payment-label">Supplier Name:</label>
        <select
          value={selectedSupplierId}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedName =
              suppliers.find((supplier) => supplier._id === selectedId)?.name ||
              "";
            setSelectedSupplierId(selectedId);
            setSelectedSupplierName(selectedName);
            setFormData({ ...formData, supplierName: selectedName });
            fetchSupplierOrderDetails(selectedId); // Fetch order details on supplier selection
          }}
          required
          className="supplier-payment-select"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name}
            </option>
          ))}
        </select>

        <label className="supplier-payment-label">Order ID:</label>
        <input
          type="text"
          value={formData.orderID}
          readOnly
          className="supplier-payment-input"
        />

        <label className="supplier-payment-label">Supplier Email:</label>
        <input
          type="email"
          value={formData.supplierEmail}
          readOnly
          className="supplier-payment-input"
        />

        <label className="supplier-payment-label">Total Amount:</label>
        <input
          type="number"
          value={formData.totalAmount}
          readOnly
          className="supplier-payment-input"
        />

        <label className="supplier-payment-label">Order Date:</label>
        <DatePicker
          selected={formData.orderDate ? formData.orderDate : null}
          readOnly
          className="supplier-payment-input"
        />

        {errors.orderDate && <p className="error-text">{errors.orderDate}</p>}

        <button type="submit" className="supplier-payment-button">
          Add Payment
        </button>
      </form>
    </div>
  );
};

export default AddSupplierPayment;
