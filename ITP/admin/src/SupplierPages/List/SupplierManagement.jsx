import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./Supplier.css";
import "../../Styles/table.css";
import "../../Styles/search.css";
import SupplierOrderDetails from "../SupplierOrders/SupplierOrderDetails.jsx";
import { Chart, registerables } from "chart.js";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets.js";
import { toast } from "react-toastify";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState("");
  const [showReportFilterModal, setShowReportFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [chartData, setChartData] = useState({});
  const [currentPageSuppliers, setCurrentPageSuppliers] = useState(1);
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const suppliersPerPage = 5;
  const ordersPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditSupplierForm, setShowEditSupplierForm] = useState(false);
  const [showEditSupplierOrderForm, setShowEditSupplierOrderForm] =
    useState(false);
  const [showSupplierDetails, setShowSupplierDetails] = useState(false);
  // Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // 'success' or 'danger'
  // State to manage selected supplier order details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showSupplierOrderDetails, setShowSupplierOrderDetails] =
    useState(false);

  const handleCloseNotification = () => {
    setShowToast(false);
  };

  // Handle Show button click
  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order); // Set the selected order
    setShowSupplierOrderDetails(true); // Show the popup
  };

  const handleCloseOrderDetails = () => {
    setShowSupplierOrderDetails(false); // Close the popup
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await fetch("http://localhost:4000/api/suppliers");
      const data = await response.json();
      setSuppliers(data);
    };

    const fetchOrders = async () => {
      const response = await fetch("http://localhost:4000/api/supplier-orders");
      const data = await response.json();
      setOrders(data);
    };

    fetchSuppliers();
    fetchOrders();
  }, []);

  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };
  Chart.register(...registerables);

  const generateReport = async () => {
    // Filter orders based on selected dates
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate)
      );
    });

    const totalSuppliers = suppliers.length;
    const totalOrders = filteredOrders.length;

    // Create line chart data
    const labels = filteredOrders.map((order) =>
      new Date(order.date).toLocaleDateString()
    ); // Assuming orders have a 'date' field
    const orderCounts = filteredOrders.reduce((acc, order) => {
      const dateKey = new Date(order.date).toLocaleDateString();
      acc[dateKey] = (acc[dateKey] || 0) + 1; // Count orders per day
      return acc;
    }, {});

    const dataPoints = labels.map((label) => orderCounts[label] || 0); // Ensure all labels have a corresponding data point

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Total Orders",
          data: dataPoints,
          fill: false,
          borderColor: "#36A2EB",
          tension: 0.1,
        },
      ],
    };

    // Generate line chart
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of Orders",
            },
          },
        },
      },
    });

    // Wait for the chart to render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // PDF generation
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Company Name: Local Helaya", 10, 10);
    doc.text("Address: Malabe, Sri Lanka", 10, 20);
    doc.text("Generated By: Supplier Manager", 10, 30);
    doc.text(
      `Generated Date Range: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`,
      10,
      40
    );
    doc.text(`Total Suppliers: ${totalSuppliers}`, 10, 50);
    doc.text(`Total Supplier Orders: ${totalOrders}`, 10, 60);

    // Add Supplier Details Table
    doc.autoTable({
      head: [
        [
          "Supplier Name",
          "Email Address",
          "Address",
          "Province",
          "Phone Number",
          "Registration Date",
        ],
      ],
      body: suppliers.map((supplier) => [
        supplier.name,
        supplier.email,
        supplier.address,
        supplier.province,
        supplier.phone,
        new Date(supplier.registrationDate).toLocaleDateString(),
      ]),
      startY: 70,
    });

    // Add Supplier Orders Table
    doc.autoTable({
      head: [
        ["Supplier Name", "Product Name", "Quantity", "Unit Price", "Total"],
      ],
      body: filteredOrders.map((order) => {
        const supplier = suppliers.find(
          (supplier) => supplier._id === order.supplierId
        );
        return [
          supplier?.name || "Supplier not found",
          order.productName,
          order.quantity,
          `Rs.${order.unitPrice.toFixed(2)}`,
          `Rs.${(order.quantity * order.unitPrice).toFixed(2)}`,
        ];
      }),
      startY: doc.lastAutoTable.finalY + 10,
    });

    // Create line chart as an image and add it to the PDF
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, doc.lastAutoTable.finalY + 20, 180, 100);

    // Save the PDF
    doc.save("Supplier_Report.pdf");

    // Hide modal and show success notification
    setShowReportFilterModal(false);
    alert("Report generated successfully!");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.email.toLowerCase().includes(searchTerm) ||
      supplier.address.toLowerCase().includes(searchTerm) ||
      supplier.province.toLowerCase().includes(searchTerm) ||
      supplier.phone.toLowerCase().includes(searchTerm)
  );

  const filteredOrders = orders.filter((order) => {
    const supplier = suppliers.find((s) => s.id === order.supplierId);
    return (
      supplier &&
      (supplier.name.toLowerCase().includes(searchTerm) ||
        order.productName.toLowerCase().includes(searchTerm))
    );
  });

  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      const response = await fetch(
        `http://localhost:4000/api/suppliers/delete/${id}`,
        { method: "DELETE" }
      );
      const result = await response.json(); // Log the result
      console.log(result);

      if (response.ok) {
        toast.success('Supplier removed successfull!')
        setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
      } else {
        showNotification("Failed to delete supplier!", "danger");
      }
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const response = await fetch(
        `http://localhost:4000/api/supplier-orders/delete/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        toast.success('Order Removed Success!')
        setOrders(orders.filter((order) => order._id !== id));
      } else {
        showNotification("Failed to delete order!", "danger");
      }
    }
  };

  const handlePageChangeSuppliers = (pageNumber) => {
    setCurrentPageSuppliers(pageNumber);
  };

  const handlePageChangeOrders = (pageNumber) => {
    setCurrentPageOrders(pageNumber);
  };

  const totalPagesSuppliers = Math.ceil(
    filteredSuppliers.length / suppliersPerPage
  );
  const totalPagesOrders = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="container" style={{ width: "1000px" }}>
      <div className="list-header">
        <Link to={"/supplier/add"} className="add-item-btn">
          Add Supplier
        </Link>
        <h1 style={{ marginLeft: "10px" }}>Supplier Management</h1>
        <div className="search">
          <input
            type="search"
            placeholder="Search Supplier..."
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
      </div>
      {/* Supplier Table */}
      <h2>Supplier Details</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Email Address</th>
            <th>Address</th>
            <th>Province</th>
            <th>Phone Number</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers
            .slice(
              (currentPageSuppliers - 1) * suppliersPerPage,
              currentPageSuppliers * suppliersPerPage
            )
            .map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.address}</td>
                <td>{supplier.province}</td>
                <td>{supplier.phone}</td>
                <td>
                  {new Date(supplier.registrationDate).toLocaleDateString()}
                </td>
                <td className="actions">
                  <button
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setShowSupplierDetails(true);
                    }}
                    className="show-button"
                  >
                    Show
                  </button>
                  <Link
                    to={`/supplier/edit/${supplier._id}`}
                    className="update-btn"
                  >
                    <img
                      src={assets.edit_icon}
                      alt="Edit Icon"
                      className="icon"
                    />
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSupplier(supplier._id)}
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
      {/* Supplier Details Popup */}
      {showSupplierDetails && (
        <SupplierDetailsPopup
          supplier={selectedSupplier}
          onClose={() => setShowSupplierDetails(false)}
        />
      )}
      {/* Pagination for suppliers */}
      <div className="pagination">
        <button
          onClick={() => handlePageChangeSuppliers(currentPageSuppliers - 1)}
          disabled={currentPageSuppliers === 1}
        >
          Previous
        </button>
        {[...Array(totalPagesSuppliers)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChangeSuppliers(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChangeSuppliers(currentPageSuppliers + 1)}
          disabled={currentPageSuppliers === totalPagesSuppliers}
        >
          Next
        </button>
      </div>
      <hr style={{ marginTop: "30px", backgroundColor: "black" }} />
      {/* Supplier Orders Table */}
      <div className="list-header" style={{ marginTop: "30px" }}>
        <h1>Supplier Orders</h1>
        <Link to={"/supplier/order/add"} className="add-item-btn">
          Add Supplier Order
        </Link>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders
            .slice(
              (currentPageOrders - 1) * ordersPerPage,
              currentPageOrders * ordersPerPage
            )
            .map((order) => {
              const supplier = suppliers.find((s) => s.id === order.supplierId);
              return (
                <tr key={order._id}>
                  <td>
                    {suppliers.find(
                      (supplier) => supplier._id === order.supplier
                    )?.name || "Supplier not found"}
                  </td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>Rs.{order.unitPrice.toFixed(2)}</td>
                  <td>Rs.{(order.quantity * order.unitPrice).toFixed(2)}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleShowOrderDetails(order)}
                      className="show-button"
                    >
                      Show
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="delete-btn"
                    >
                      <img
                        src={assets.delete_icon}
                        alt="Delete Icon"
                        className="icon"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* Popup for Supplier Order Details */}
      {showSupplierOrderDetails && (
        <SupplierOrderDetails
          order={selectedOrder}
          onClose={handleCloseOrderDetails}
        />
      )}
      {/* Pagination for orders */}
      <div className="pagination">
        <button
          onClick={() => handlePageChangeOrders(currentPageOrders - 1)}
          disabled={currentPageOrders === 1}
        >
          Previous
        </button>
        {[...Array(totalPagesOrders)].map((_, index) => (
          <button key={index} onClick={() => handlePageChangeOrders(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChangeOrders(currentPageOrders + 1)}
          disabled={currentPageOrders === totalPagesOrders}
        >
          Next
        </button>
      </div>
      <button className="generate-pdf-btn" onClick={generateReport}>
        Generate Report
      </button>
    </div>
  );
};
const SupplierDetailsPopup = ({ supplier, onClose }) => {
  if (!supplier) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Supplier Details</h2>
        <p>
          <strong>Name:</strong> {supplier.name}
        </p>
        <p>
          <strong>Email:</strong> {supplier.email}
        </p>
        <p>
          <strong>Address:</strong> {supplier.address}
        </p>
        <p>
          <strong>Province:</strong> {supplier.province}
        </p>
        <p>
          <strong>Phone:</strong> {supplier.phone}
        </p>
        <p>
          <strong>Registration Date:</strong>{" "}
          {new Date(supplier.registrationDate).toLocaleDateString()}
        </p>
        <button className="close-popup-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SupplierManagement;

{
  /* <Link
                      to={`/supplier/order/edit/${order._id}`}
                      className="update-btn"
                    >
                      <img
                        src={assets.edit_icon}
                        alt="Edit Icon"
                        className="icon"
                      />
                    </Link> */
}
