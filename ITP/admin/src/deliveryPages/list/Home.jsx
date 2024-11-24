import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./homecss.css";
import { assets } from "../../assets/assets";
import "../../Styles/search.css";
import "../../Styles/table.css";
import emailIcon from "../../assets/email.png";
import { toast } from "react-toastify";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    retrievePosts();
  }, []);

  const retrievePosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/delivery/deliveries"
      );
      if (res.data.success) {
        setPosts(res.data.deliveries);
      } else {
        setError("Failed to fetch deliveries");
      }
    } catch (err) {
      setError("An error occurred while fetching deliveries");
    }
  };

  const deletePost = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this delivery?"
    );
    if (!isConfirmed) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/delivery/delivery/delete/${id}`
      );
      if (res.data.success) {
        retrievePosts(); // Refresh the list after deletion
        toast.success("Delivery deleted successfully!"); // Show success toast
      } else {
        setError("Failed to delete delivery");
      }
    } catch (err) {
      setError("An error occurred while deleting delivery");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.DeliveryId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.DeliveryPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.Locaton?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.Status?.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by Status as well
  );

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <button
          style={{ width: "200px" }}
          className="add-item-btn"
          onClick={() => navigate("/delivery/add")}
        >
          Add Delivery
        </button>
        <p>All Delivery List</p>
        <div className="search">
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}

      {filteredPosts.length > 0 ? (
        <table className="list-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Delivery Person</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr key={index}>
                <td>
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate(`/delivery/post/${post._id}`)}
                  >
                    {post.DeliveryId}
                  </span>
                </td>
                <td>{post.DeliveryPerson}</td>
                <td>{post.Locaton}</td>
                <td>{post.Date}</td>
                <td>{post.Status}</td>
                <td className="actions">
                  <button
                    id="edit"
                    onClick={() => navigate(`/delivery/edit/${post._id}`)}
                    className="update-btn"
                  >
                    <img src={assets.edit_icon} alt="edit" className="icon" />
                  </button>
                  <button
                    id="delete"
                    onClick={() => deletePost(post._id)}
                    className="delete-btn"
                  >
                    <img
                      src={assets.delete_icon}
                      alt="delete"
                      className="icon"
                    />
                  </button>
                </td>
                <td className="Email">
                  <button
                    id="Email"
                    className="email-btn"
                    onClick={() => navigate(`/delivery/post/${post._id}`)}
                  >
                    <img src={assets.emailIcon} alt="email" className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No deliveries found</p>
      )}
    </div>
  );
};

export default Home;
