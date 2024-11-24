import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../CustomerFormStyle/customerFormStyle.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    address1: '',
    address2: '',
    hometown: '',
    phone: '',
    active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/user/${id}`);
      setFormData(response.data.user);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/user/update/${id}`, formData);
      navigate('/customer/list')
      toast.success('User Updated!')
    } catch (error) {
      console.error("Error updating user", error);
      alert("Error updating user");
    }
  };

  return (
    <div className="add1">
      <h2>Edit User</h2>
      <form className="flex-col" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="address1" placeholder="Address Line 1" value={formData.address1} onChange={handleChange} required />
        <input type="text" name="address2" placeholder="Address Line 2" value={formData.address2} onChange={handleChange} />
        <input type="text" name="hometown" placeholder="Hometown" value={formData.hometown} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <select name="active" value={formData.active} onChange={handleChange}>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        <button className="add-inventory-btn" type="submit">Update User</button>
      </form>
    </div>
  );
};

export default EditUser;
