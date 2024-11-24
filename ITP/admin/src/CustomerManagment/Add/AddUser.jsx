import React, { useState } from 'react';
import axios from 'axios';
import '../CustomerFormStyle/customerFormStyle.css'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    address1: '',
    address2: '',
    hometown: '',
    phone: '',
    active: true,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user/add', formData);
      toast.success('User Added!')
      navigate('/customer/list')
    } catch (error) {
      console.error("Error adding user", error);
      alert("Error adding user");
    }
  };

  return (
    <div className="add1">
      <h2>Add User</h2>
      <form className="flex-col" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="address1" placeholder="Address Line 1" value={formData.address1} onChange={handleChange} required />
        <input type="text" name="address2" placeholder="Address Line 2" value={formData.address2} onChange={handleChange} />
        <input type="text" name="hometown" placeholder="Hometown" value={formData.hometown} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <select name="active" value={formData.active} onChange={handleChange}>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        <button className='add-inventory-btn' type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
