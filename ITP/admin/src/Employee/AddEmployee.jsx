import React, { useEffect, useState } from "react";
import "./AddEmployee.css";
import "../Styles/table.css";
import { assets } from "../assets/assets";
import "./EmployeeForm.css";

const AddEmployee = ({ url }) => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false); // To manage form visibility
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    registerDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch(`${url}/api/employees`);
    const data = await response.json();
    setEmployees(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${url}/api/employees/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    fetchEmployees(); // Refresh employee list
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      registerDate: new Date().toISOString().split("T")[0],
    });
    setShowForm(false); // Hide form after submission
  };

  const handleDelete = async (id) => {
    await fetch(`${url}/api/employees/delete/${id}`, {
      method: "DELETE",
    });
    fetchEmployees(); // Refresh employee list
  };

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <button className="add-item-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add Employee"}
        </button>
        <h3>Employee List</h3>
      </div>

      {showForm && (
        <form className="employee-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="registerDate"
            value={formData.registerDate}
            onChange={handleChange}
            disabled
          />
          <button type="submit" className="add-item-btn">
            Submit
          </button>
        </form>
      )}
      <table className="list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Register Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.location}</td>
              <td>{new Date(employee.registerDate).toLocaleDateString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(employee._id)}
                >
                  <img
                    src={assets.delete_icon}
                    alt="Delete Icon"
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

export default AddEmployee;
