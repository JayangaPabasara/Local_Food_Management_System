import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditExpense = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    orderID: "",
    supplierEmail: "",
    totalAmount: "",
    orderDate: new Date(),
  });

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [errors, setErrors] = useState({
    supplierEmail: "",
    totalAmount: "",
    orderDate: "",
  });

  const { id } = useParams(); // Get the expense ID
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

  // Fetch the existing expense data
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/expenses/${id}`
        );
        const expense = response.data;

        setFormData({
          supplierName: expense.supplierName || "",
          orderID: expense.orderID || "",
          supplierEmail: expense.supplierEmail || "",
          totalAmount: expense.totalAmount || "",
          orderDate: expense.orderDate
            ? new Date(expense.orderDate)
            : new Date(),
        });
      } catch (error) {
        toast.error("Failed to fetch expense details");
        console.error("Error fetching expense:", error);
      }
    };

    fetchExpense(); // Fetch expense details on component mount
  }, [id]);

  const validateForm = () => {
    let formErrors = { supplierEmail: "", totalAmount: "", orderDate: "" };
    let isValid = true;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.supplierEmail)) {
      formErrors.supplierEmail = "Please enter a valid email address.";
      isValid = false;
    }

    // Total amount validation
    if (Number(formData.totalAmount) < 0) {
      formErrors.totalAmount = "Total amount cannot be negative.";
      isValid = false;
    }

    // Order date validation
    const today = new Date();
    if (formData.orderDate < today.setHours(0, 0, 0, 0)) {
      formErrors.orderDate = "Order date cannot be a past date.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:4000/api/expenses/update/${id}`,
        formData
      );
      toast.success("Expense updated");
      navigate("/list-payment");
    } catch (error) {
      toast.error("Failed to update expense");
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="supplier-payment-container">
      <h2 className="supplier-payment-heading">Edit Expense</h2>
      <form onSubmit={handleSubmit} className="supplier-payment-form">
        <label>Supplier Name:</label>
        <select
          value={selectedSupplierId}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedName = suppliers.find(
              (supplier) => supplier._id === selectedId
            )?.name;
            setSelectedSupplierId(selectedId);
            setFormData({ ...formData, supplierName: selectedName });
            fetchSupplierOrderDetails(selectedId); // Fetch order details for the selected supplier
          }}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name}
            </option>
          ))}
        </select>

        <label>Order ID:</label>
        <input
          type="text"
          value={formData.orderID}
          readOnly
          className="supplier-payment-input"
        />

        <label>Supplier Email:</label>
        <input
          type="email"
          value={formData.supplierEmail}
          readOnly
          className="supplier-payment-input"
        />
        {errors.supplierEmail && (
          <p className="supplier-payment-error">{errors.supplierEmail}</p>
        )}

        <label>Total Amount:</label>
        <input
          type="number"
          value={formData.totalAmount}
          onChange={(e) =>
            setFormData({ ...formData, totalAmount: e.target.value })
          }
          className="supplier-payment-input"
          required
        />
        {errors.totalAmount && (
          <p className="supplier-payment-error">{errors.totalAmount}</p>
        )}

        <label>Order Date:</label>
        <DatePicker
          selected={formData.orderDate}
          readOnly
          className="supplier-payment-input"
        />
        {errors.orderDate && (
          <p className="supplier-payment-error">{errors.orderDate}</p>
        )}

        <button type="submit" className="supplier-payment-button">
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
