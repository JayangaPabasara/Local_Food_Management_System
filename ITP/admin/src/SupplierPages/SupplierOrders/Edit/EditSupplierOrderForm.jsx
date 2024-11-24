import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const EditSupplierOrderForm = () => {
  const { orderId } = useParams(); // Get order ID from the URL
  const [suppliers, setSuppliers] = useState([]);
  const [order, setOrderDetails] = useState({
    supplier: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    totalPrice: 0,
  });

  // Fetch suppliers and order details
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/supplier-orders/${orderId}`);
        console.log('Order details fetched:', response.data);
        const { supplier, productName, quantity, unitPrice } = response.data;
        setOrderDetails({
          supplier: supplier._id, // Ensure the supplier's ObjectId is used
          productName,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice,
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchSuppliers();
    fetchOrderDetails();
  }, [orderId]);

  // Validate input for quantity and unit price
  const validateNumber = (value) => /^[0-9\b]+$/.test(value) && parseFloat(value) > 0;

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (validateNumber(value)) {
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        quantity: parseFloat(value), // Ensure it's a number
        totalPrice: parseFloat(value) * prevDetails.unitPrice, // Update total price
      }));
    } else {
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        quantity: '', // Clear invalid input
      }));
    }
  };

  const handleUnitPriceChange = (e) => {
    const value = e.target.value;
    if (validateNumber(value)) {
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        unitPrice: parseFloat(value), // Ensure it's a number
        totalPrice: prevDetails.quantity * parseFloat(value), // Update total price
      }));
    } else {
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        unitPrice: '', // Clear invalid input
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOrderData = {
      supplier: order.supplier, // Send supplier ID
      productName: order.productName,
      quantity: parseInt(order.quantity),
      unitPrice: parseFloat(order.unitPrice),
    };

    axios
      .put(`http://localhost:4000/api/supplier-orders/update/${orderId}`, updatedOrderData)
      .then((response) => {
        toast.success('Order updated successfully!', {
          icon: <FaCheckCircle />,
        });
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error response:', error.response.data); // Log detailed error response
        } else {
          console.error('Error:', error);
        }
        toast.error('Failed to update order. Please try again.');
      });
  };

  return (
    <div className="add1">
      <h2>Edit Supplier Order</h2>
      <form onSubmit={handleSubmit}>
        <div controlId="supplier">
          <label>Supplier</label>
          <select as="select" value={order.supplier} readOnly>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div controlId="productName">
          <label>Product Name</label>
          <input type="text" value={order.productName} readOnly />
        </div>

        <div controlId="quantity">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={order.quantity}
            onChange={handleQuantityChange}
            required
          />
        </div>

        <div controlId="unitPrice">
          <label>Unit Price</label>
          <input
            type="number"
            placeholder="Enter unit price"
            value={order.unitPrice}
            onChange={handleUnitPriceChange}
            required
          />
        </div>

        <div controlId="totalPrice">
          <label>Total Price</label>
          <input type="text" value={order.totalPrice} readOnly />
        </div>

        <button variant="primary" type="submit" className="add-supplier-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditSupplierOrderForm;
