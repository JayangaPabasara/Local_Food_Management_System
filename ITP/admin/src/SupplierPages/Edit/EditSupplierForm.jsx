import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({
    name: '',
    email: '',
    address: '',
    province: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/suppliers/${id}`);
      setSupplier(response.data);
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching supplier", error);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const updateSupplier = async () => {
    setError('');

    if (supplier.phone.length !== 10 || !/^\d{10}$/.test(supplier.phone)) {
      setError('Phone number must be 10 digits long and contain only numbers.');
      return;
    }

    if (!validateEmail(supplier.email)) {
      setError('Invalid email format.');
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/suppliers/update/${id}`, supplier);
      setNotification("Supplier updated successfully!");
      setTimeout(() => {
        navigate("/supplier/list"); 
      }, 2000); 
    } catch (error) {
      console.error("Error updating supplier", error);
    }
  };

  const handleCloseNotification = () => setNotification('');

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="add1">
      <h2>Edit Supplier</h2>
      {notification && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          <strong>Success!</strong> {notification}
          <button onClick={handleCloseNotification} style={{ marginLeft: '10px', cursor: 'pointer' }}>X</button>
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <strong>Error!</strong> {error}
          <button onClick={() => setError('')} style={{ marginLeft: '10px', cursor: 'pointer' }}>X</button>
        </div>
      )}
      <form className="flex-col" onSubmit={(e) => { e.preventDefault(); updateSupplier(); }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Supplier Name:</label>
          <input
            type="text"
            name="name"
            value={supplier.name || ''}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={supplier.email || ''}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={supplier.address || ''}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Province:</label>
          <input
            type="text"
            name="province"
            value={supplier.province || ''}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={supplier.phone || ''}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <button type="submit" className='add-supplier-button'>Update Supplier</button>
      </form>
    </div>
  );
};

export default EditSupplier;