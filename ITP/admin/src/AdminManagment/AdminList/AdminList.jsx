import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminList.css";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/all");
        setAdmins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin list", error);
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to handle deletion of an admin
  const handleDeleteAdmin = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if(confirmDelete){
        try {
            await axios.delete(`http://localhost:4000/api/admin/delete/${id}`);
            alert("Admin deleted successfully!");
      
            // Remove the deleted admin from the list without reloading
            setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
          } catch (error) {
            console.error("Error deleting admin", error);
            alert("Failed to delete admin");
          }
    }else{
    }
  };

  const handleAddAdmin = () => {
    navigate("/admin/add");
  };

  return (
    <div className="list add flex-col" style={{borderRadius:"10px"}}>
        <div className="list-header">
      <button onClick={handleAddAdmin} className="add-item-btn">
        Add Admin
      </button><br/>
      <h1>Admin List</h1>
      </div>
      <table className="list-table ">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAdmin(admin._id)} // Delete button with handler
                >
                 <img
                      src={assets.delete_icon}
                      alt="delete"
                      className="icon"
                    />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
