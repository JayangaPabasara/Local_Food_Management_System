import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../Styles/table.css";
import { assets } from "../../assets/assets";
import { toast } from 'react-toastify';
import './UserList.css'
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/user");
      setUsers(response.data);
      setTotalUsers(response.data.length);
      setTotalActiveUsers(response.data.filter(user => user.active).length);
    } catch (error) {
      console.error("Error fetching users", error);
      toast.error('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:4000/api/user/delete/${id}`);
        fetchUsers(); // Refresh the list
        toast.success('Customer deleted successfully!');
      } catch (error) {
        console.error("Error deleting user", error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Toggle the current status
    try {
      await axios.patch(`http://localhost:4000/api/users/status/${id}`, { active: newStatus });
      fetchUsers(); // Refresh the user list
      toast.success(`User has been ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error(`Failed to ${newStatus ? 'activate' : 'deactivate'} user`);
    }
  };

  const generatePDF = () => {
    const filteredUsers = users.filter(user => {
      const registrationDate = new Date(user.registrationDate); 
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
  
      return registrationDate >= startDate && registrationDate <= endDate;
    });
  
    const doc = new jsPDF();
    doc.text('Local Helaya', 105, 20, null, null, 'center');
    doc.text('Malabe, Sri Lanka', 105, 30, null, null, 'center');
    doc.text(`Total Customers: ${filteredUsers.length}`, 10, 40);
    doc.text(`Total Active Customers: ${filteredUsers.filter(user => user.active).length}`, 10, 50);
    doc.text(`Generated Date Range: ${dateRange.start} to ${dateRange.end}`, 10, 60);
  
    // Create table in PDF
    doc.autoTable({
      startY: 70,
      head: [['Name', 'Email', 'Phone', 'Address', 'Username', 'Status']],
      body: filteredUsers.map(user => [
        user.name, 
        user.email, 
        user.phone, 
        `${user.address1} ${user.address2 || ''} ${user.hometown}`, 
        user.username, 
        user.active ? 'Active' : 'Inactive'
      ])
    });
  
    doc.save('customer_report.pdf');
  };

  return (
    <div className="list add flex-col" style={{width:"950px", borderRadius:"10px"}}>
      <div className="list-header">
        <h2>User List</h2>
        <Link className="add-item-btn" to={"/customer/add"}>
          Add Customer
        </Link>
      </div>
      <div>
          <label htmlFor="start-date">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <label htmlFor="end-date">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <button className="add-inventory-btn" onClick={generatePDF}>
            Generate Report
          </button>
        </div>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Active Customers</h3>
          <p>{totalActiveUsers}</p>
        </div>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.phone}</td>
              <td>
                {user.address1}
                <br />
                {user.address2 && (
                  <>
                    {user.address2}
                    <br />
                  </>
                )}
                {user.hometown}
              </td>
              <td>{user.active ? "Active" : "Inactive"}</td>
              <td className="actions">
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  <img
                    src={assets.delete_icon}
                    alt="Delete Icon"
                    className="icon"
                  />
                </button>
                <button
                  className="update-btn"
                  onClick={() =>
                    (window.location.href = `/customer/edit/${user._id}`)
                  }
                >
                  <img
                    src={assets.edit_icon}
                    alt="Edit Icon"
                    className="icon"
                  />
                </button>
                <br/><br/><br/><br/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
