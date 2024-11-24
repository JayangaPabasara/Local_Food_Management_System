import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createPostCss.css";
import "../deliveryStyle/deliveryform.css";
import { toast } from "react-toastify";
import "../deliveryStyle/deliveryform.css";

const CreatePosts = () => {
  const [formData, setFormData] = useState({
    DeliveryId: "",
    DeliveryPerson: "",
    Locaton: "",
    Date: "",
  });
  const [employees, setEmployees] = useState([]); // State to store employees
  const [errors, setErrors] = useState({});
  const [isDateValid, setIsDateValid] = useState(true);
  const navigate = useNavigate();

  const alphaOnly = /^[a-zA-Z\s]*$/;

  // Function to generate a unique ID
  const generateId = () => {
    const randomString = Math.random().toString(36).substring(2, 15);
    return `DEL-${randomString}`;
  };

  // Fetch employees when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/employees")
      .then((response) => {
        setEmployees(response.data); // Save the list of employees
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        toast.error("Failed to fetch employees.");
      });
  }, []);

  // Auto-generate Delivery ID on component mount
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, DeliveryId: generateId() }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validation logic
    if (name === "Locaton" && !alphaOnly.test(value)) {
      error = "Invalid characters in Location.";
    } else if (name === "Date") {
      const today = new Date();
      const twoMonthsFromNow = new Date(today.setMonth(today.getMonth() + 2))
        .toISOString()
        .split("T")[0];
      if (
        value &&
        (value <= new Date().toISOString().split("T")[0] ||
          value > twoMonthsFromNow)
      ) {
        error = "Date must be within two months and in the future.";
        setIsDateValid(false);
      } else {
        setIsDateValid(true);
      }
    }

    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const { DeliveryPerson, Locaton, Date } = formData;
    let formErrors = {};
    let formIsValid = true;

    if (!DeliveryPerson) {
      formIsValid = false;
      formErrors["DeliveryPerson"] = "Delivery Person is required.";
    }
    if (!Locaton) {
      formIsValid = false;
      formErrors["Locaton"] = "Location is required.";
    }
    if (!Date || !isDateValid) {
      formIsValid = false;
      formErrors["Date"] = !Date
        ? "Date is required."
        : "Invalid date selection.";
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .post("http://localhost:4000/api/delivery/delivery/save", formData)
      .then((res) => {
        if (res.data.success) {
          setFormData({
            DeliveryId: generateId(),
            DeliveryPerson: "",
            Locaton: "",
            Date: "",
          });
          setErrors({});
          navigate("/delivery/list");
          toast.success("Delivery Added Successfully!");
        }
      })
      .catch((error) => {
        console.error("Error adding delivery:", error);
        toast.error("Failed to add delivery.");
      });
  };

  return (
    <div>
      <div className="delivery-container">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Add Delivery
        </h1>
        <form className="delivery-form" onSubmit={onSubmit}>
          <div className="row mb-3">
            <div className="col-sm-10">
              <label htmlFor="deliveryId"></label>
              <input
                type="text"
                className="form-control"
                id="deliveryId"
                name="DeliveryId"
                value={formData.DeliveryId}
                readOnly
              />
            </div>
          </div>

          {/* Dropdown for Delivery Person */}
          <div className="row mb-3" style={{ marginBottom: "20px" }}>
            <div className="col-sm-10">
              <label htmlFor="deliveryPerson"></label>
              <select
                className="form-control"
                name="DeliveryPerson"
                value={formData.DeliveryPerson}
                onChange={handleChange}
              >
                <option value="">Select Delivery Person</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
              {errors.DeliveryPerson && (
                <div className="delivery-text-danger">
                  {errors.DeliveryPerson}
                </div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                name="Locaton"
                placeholder="Enter Location"
                value={formData.Locaton}
                onChange={handleChange}
              />
              {errors.Locaton && (
                <div className="delivery-text-danger">{errors.Locaton}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
              />
              {errors.Date && (
                <div className="delivery-text-danger">{errors.Date}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="add-Delivery-Btn"
            disabled={!isDateValid}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePosts;
