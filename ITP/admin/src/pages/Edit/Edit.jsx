import React, { useEffect, useState } from "react";
import "../Inventorystyle/Inventoryform.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const UpdateFood = ({ url }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Sweet",
    quantity: "",
    foodCategory: "Dessert",
  });

  const [errors, setErrors] = useState({}); // State to hold error messages

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/api/food/find/${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            name: response.data.name,
            description: response.data.description,
            price: response.data.price,
            category: response.data.category,
            quantity: response.data.quantity,
            foodCategory: response.data.foodCategory || "Dessert", // Retrieve existing food category
          });
          setImage(response.data.image);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, url]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    let errorMessages = { ...errors };

    // Validation for name
    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        errorMessages[name] = "Cannot enter special characters";
      } else {
        delete errorMessages[name];
      }
    }

    // Validation for quantity
    if (name === "quantity") {
      if (!/^\d*$/.test(value) || value > 30) {
        errorMessages[name] = "Quantity must be a number and less than 30";
      } else {
        delete errorMessages[name];
      }
    }

    // Validation for price
    if (name === "price") {
      if (value <= 0) {
        errorMessages[name] = "Price must be greater than 0";
      } else {
        delete errorMessages[name];
      }
    }

    setErrors(errorMessages);
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Check for validation errors before submitting
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("foodCategory", data.foodCategory);
    formData.append("quantity", Number(data.quantity));
    if (image) formData.append("image", image);

    try {
      const response = await axios.put(`${url}/api/food/edit/${id}`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update food item");
      console.error("Error updating food item:", error);
    }
  };

  return (
    <div className="add1">
      <form
        className="flex-col"
        onSubmit={onSubmitHandler}
        style={{ width: "500px" }}
      >
        <div className="add-img-upload flex-col">
          <p style={{ color: "black" }}>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? `${url}/images/${image}` : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Food category</p>
            <select
              onChange={onChangeHandler}
              name="foodCategory"
              value={data.foodCategory}
              required
            >
              <option value="Sweet">Sweet</option>
              <option value="Curry">Curry</option>
              <option value="Dessert">Dessert</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="350.00"
              required
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>

          <div className="add-quantity flex-col">
            <p>Quantity</p>
            <input
              onChange={onChangeHandler}
              value={data.quantity}
              type="number"
              name="quantity"
              placeholder="30"
              required
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col" style={{ width: "400px" }}>
            <p>Product category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
              required
            >
              <option value="Central Province">Central Province</option>
              <option value="Eastern Province">Eastern Province</option>
              <option value="North Central Province">
                North Central Province
              </option>
              <option value="North Western Province">
                North Western Province
              </option>
              <option value="Northern Province">Northern Province</option>
              <option value="Sabaragamuwa Province">
                Sabaragamuwa Province
              </option>
              <option value="Southern Province">Southern Province</option>
              <option value="Uva Province">Uva Province</option>
              <option value="Western Province">Western Province</option>
            </select>
          </div>
        </div>

        <button type="submit" className="add-inventory-btn">
          Update The Inventory
        </button>
      </form>
    </div>
  );
};

export default UpdateFood;
