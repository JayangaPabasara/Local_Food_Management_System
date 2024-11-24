import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Row, Col } from 'react-bootstrap';

const SupplierOrderForm = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch suppliers from the API
    axios.get('http://localhost:4000/api/suppliers')
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the suppliers!', error);
      });
  }, []);

  // Validate input for quantity and unit price
  const validateNumber = (value) => /^[0-9\b]+$/.test(value) && parseFloat(value) > 0;

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (validateNumber(value)) {
      setQuantity(value);
      setTotalPrice(value * unitPrice); // Update total price
    } else {
      setQuantity(''); // Clear invalid input
    }
  };

  const handleUnitPriceChange = (e) => {
    const value = e.target.value;
    if (validateNumber(value)) {
      setUnitPrice(value);
      setTotalPrice(quantity * value); // Update total price
    } else {
      setUnitPrice(''); // Clear invalid input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      supplier: selectedSupplier,
      productName: productName,
      quantity: parseInt(quantity),
      unitPrice: parseFloat(unitPrice)
    };

    axios.post('http://localhost:4000/api/supplier-orders/add', orderData)
      .then(response => {
        toast.success('Order added successfully!');
        // Reset form
        setSelectedSupplier('');
        setProductName('');
        setQuantity('');
        setUnitPrice('');
        setTotalPrice(0);
      })
      .catch(error => {
        toast.error('Failed to add order. Please try again.');
        console.error(error);
      });
  };

  return (
    <div className="add1">
      <h2>Add Supplier Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="supplier">Supplier</label>
          <select
            id="supplier"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            id="quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={handleQuantityChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unitPrice">Unit Price</label>
          <input
            type="text"
            id="unitPrice"
            placeholder="Enter unit price"
            value={unitPrice}
            onChange={handleUnitPriceChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalPrice">Total Price</label>
          <input
            type="text"
            id="totalPrice"
            value={totalPrice}
            readOnly
          />
        </div>

        <button type="submit" className="add-supplier-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupplierOrderForm;
