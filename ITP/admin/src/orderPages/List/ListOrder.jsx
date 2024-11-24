import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ListOrder.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import "../../Styles/search.css";
import "../../Styles/table.css";
import html2canvas from "html2canvas";
import TopSoldItemsPieChart from "../../Visualization/TopSoldItemsPieChart.jsx";

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For controlling delete modal visibility
  const [orderToDelete, setOrderToDelete] = useState(null); // Store the order to delete
  const [startDate, setStartDate] = useState(""); // New state for start date
  const [endDate, setEndDate] = useState(""); // New state for end date

  const navigate = useNavigate();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/order");
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError("Failed to fetch orders");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Something went wrong while fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    const isWithinDateRange =
      (!startDate || orderDate >= new Date(startDate)) &&
      (!endDate || orderDate <= new Date(endDate));

    // Check if order.userId exists and has a name before trying to access it
    return (
      order.userId &&
      order.userId.name &&
      order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      isWithinDateRange
    );
  });

  // Function to get top 4 most sold items
  const getTopSoldItems = () => {
    const itemCount = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    // Sort items by quantity and get top 4
    const sortedItems = Object.entries(itemCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, quantity]) => ({ name, quantity }));

    return sortedItems;
  };

  const topSoldItems = getTopSoldItems();

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/order/delete/${orderToDelete}`
      );
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      toast.success("Order removed");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error removing order");
    } finally {
      setShowDeleteModal(false); // Close modal
      setOrderToDelete(null); // Clear selected order
    }
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId); // Set the order to delete
    setShowDeleteModal(true); // Show the delete modal
  };

  const handleEdit = (id) => {
    navigate(`/edit/order/${id}`);
  };

  const openModal = (items) => {
    setSelectedOrderItems(items);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const generatePDFReport = () => {
    const pieChart = document.querySelector(".pie-chart-container");

    html2canvas(pieChart).then((canvas) => {
      const chartImage = canvas.toDataURL("image/png");

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Order List Report (${startDate} to ${endDate})`,
        doc.internal.pageSize.getWidth() / 2,
        15,
        null,
        null,
        "center"
      );

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 20, 30);

      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce(
        (acc, order) => acc + order.amount,
        0
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Orders: ${totalOrders}`, 20, 40);
      doc.text(`Total Amount: Rs ${totalAmount}.00`, 20, 50);

      doc.addImage(chartImage, "PNG", 35, 60, 180, 100);

      const tableData = [];

      filteredOrders.forEach((order) => {
        // Push order-level information first
        tableData.push([
          order._id, // Order ID
          order.userId.name, // User Name
          "", // Empty cell for Item Name
          "", // Empty cell for Quantity
          `Rs ${order.amount}.00`, // Total Order Amount
          order.status, // Status
          new Date(order.date).toLocaleString(), // Date
        ]);

        // Add a row for each item in the order
        order.items.forEach((item) => {
          tableData.push([
            "", // Empty cell for Order ID
            "", // Empty cell for User Name
            item.name, // Item Name
            item.quantity, // Quantity
            "", // Empty cell for Amount
            "", // Empty cell for Status
            "", // Empty cell for Date
          ]);
        });
      });

      const tableStyles = {
        theme: "striped",
        headStyles: { fillColor: [22, 160, 133] },
        styles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.5, // Set border width for rows and columns
          lineColor: [0, 0, 0], // Set border color (black)
        },
        alternateRowStyles: { fillColor: [242, 242, 242] },
        startY: 170,
      };

      doc.autoTable({
        head: [
          [
            "Order ID",
            "User Name",
            "Item Name",
            "Quantity",
            "Amount",
            "Status",
            "Date",
          ],
        ],
        body: tableData,
        ...tableStyles,
      });

      doc.save("order_report_with_date_filter.pdf");
    });
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div style={{ marginBottom: "10px", color: "white" }}>
            Are you sure you want to delete this order?
          </div>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="list add flex-col"
      style={{ borderRadius: "10px", width: "70%" }}
    >
      <TopSoldItemsPieChart topSoldItems={topSoldItems} />
      <hr style={{ marginBottom: "30px", backgroundColor: "black" }} />
      <div className="list-header">
        <h2>All Orders</h2>
        <div className="search">
          <input
            type="search"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
      </div>
      <div className="date-filter">
        <div className="date-input-group">
          <label>Starting Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
            placeholder="Start Date"
          />
        </div>
        <div className="date-input-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
            placeholder="End Date"
          />
        </div>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th className="order-id">Order ID</th>
            <th>User Name</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="8">No orders found</td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="order-id">{order._id}</td>
                <td>{order.userId.name}</td>
                <td>
                  <button
                    style={{ width: "100px" }}
                    className="view-items-btn"
                    onClick={() => openModal(order.items)}
                  >
                    View Items
                  </button>
                </td>
                <td>Rs {order.amount}.00</td>
                <td>
                  <div className="order-status">
                    <div
                      className={`status-indicator ${
                        order.payment ? "status-paid" : "status-unpaid"
                      }`}
                    ></div>
                    {order.status}
                  </div>
                </td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="update-btn"
                    onClick={() => handleEdit(order._id)}
                  >
                    <img src={assets.edit_icon} className="icon" />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(order._id)}
                  >
                    <img src={assets.delete_icon} className="icon" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={generatePDFReport} className="generate-pdf-btn">
        Generate PDF Report
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Items"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Items in Order</h2>
        <ul>
          {selectedOrderItems.map((item, index) => (
            <li key={index}>
              {item.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
        <button
          onClick={closeModal}
          style={{ width: "70px" }}
          className="close-modal-btn"
        >
          Close
        </button>
      </Modal>

      {showDeleteModal && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ListOrder;
