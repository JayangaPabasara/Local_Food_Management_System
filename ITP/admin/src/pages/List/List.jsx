import React, { useState, useEffect, useRef } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { assets } from "../../assets/assets";
import "../../Styles/search.css";
import Modal from "../../components/DeleteModel/deleteModel";
import html2canvas from "html2canvas";
import BarGraph from "../../Visualization/BarGraph.jsx";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state
  const [currentItemId, setCurrentItemId] = useState(null); // Pass Id
  const [lowStockItems, setLowStockItems] = useState([]); // State for low stock or out-of-stock items
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState(""); // Start date state
  const [endDate, setEndDate] = useState(""); // End date state

  // Create a ref for the graph
  const graphRef = useRef(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        const allItems = response.data.data;
        setList(allItems);

        // Extract unique food categories dynamically
        const uniqueCategories = [
          ...new Set(allItems.map((item) => item.foodCategory)),
        ].filter(Boolean);
        setCategories(uniqueCategories);

        // Process data for the chart
        const provinceCategoryData = allItems.reduce((acc, item) => {
          const province = item.category || "Unknown";
          const category = item.foodCategory || "Other";

          if (!acc[province]) {
            acc[province] = {};
          }

          if (!acc[province][category]) {
            acc[province][category] = 0;
          }

          acc[province][category] += 1;

          return acc;
        }, {});

        // Format data for recharts
        const formattedData = Object.keys(provinceCategoryData).map(
          (province) => ({
            province,
            ...provinceCategoryData[province],
          })
        );

        setChartData(formattedData);

        // Filter low stock and out-of-stock items
        const lowStock = allItems.filter((item) => item.quantity < 5);
        setLowStockItems(lowStock);
      } else {
        toast.error("Error fetching the list");
      }
    } catch (error) {
      console.error("Error fetching the list:", error);
      toast.error("Error fetching the list");
    }
  };

  const removeFoods = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
        setShowDeleteModal(false);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Error removing food");
    }
  };

  const confirmDelete = (id) => {
    setCurrentItemId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filter items based on the date range
  const filterItemsByDate = async (startDate, endDate) => {
    if (!startDate || !endDate) return; // Do nothing if either date is missing
    try {
      const response = await axios.post(`${url}/api/food/filterByDate`, {
        startDate,
        endDate,
      });
      if (response.data.success) {
        setList(response.data.data);
        const lowStock = response.data.data.filter((item) => item.quantity < 5);
        setLowStockItems(lowStock);
      } else {
        toast.error("No items found for the selected date range");
      }
    } catch (error) {
      console.error("Error fetching filtered items:", error);
      toast.error("Error fetching filtered items");
    }
  };
  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockLevelStyle = (quantity) => {
    let color;
    let width;

    if (quantity === 0) {
      return { backgroundColor: "red", width: "100%" };
    } else if (quantity < 5) {
      color = "red";
      width = "25%";
    } else if (quantity <= 15) {
      color = "#ffd000";
      width = "50%";
    } else {
      color = "rgb(128, 207, 0)";
      width = "100%";
    }

    return { backgroundColor: color, width: width };
  };

  const generatePDFReport = async () => { 
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Item List Report", 20, 10);

    // Report Generated Date
    const reportDate = new Date().toLocaleDateString();
    const reportDateText = `Report Generated: ${reportDate}`;
    const reportDateWidth = doc.getTextWidth(reportDateText);
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add the report date to the top right corner
    doc.setFontSize(8);
    doc.text(reportDateText, pageWidth - reportDateWidth - -40, 5);

    // Summary Section
    const totalItems = list.length;
    const inStockItems = list.filter((item) => item.quantity > 0).length;
    const outOfStockItems = totalItems - inStockItems;
    const lowStockItems = list.filter(
      (item) => item.quantity < 5 && item.quantity > 0
    );
    const outOfStockItemsList = list.filter((item) => item.quantity === 0);

    doc.setFontSize(14);
    doc.text(`Total Items: ${totalItems}`, 20, 20);
    doc.text(`In Stock Items: ${inStockItems}`, 20, 30);
    doc.text(`Out of Stock Items: ${outOfStockItems}`, 20, 40);
    doc.text(`Low Stock Items (Quantity < 5): ${lowStockItems.length}`, 20, 50);

    // Capture the graph
    const canvas = await html2canvas(graphRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Add the graph image to the PDF
    const startYGraph = 70; // Start position for the graph
    doc.addImage(imgData, "PNG", 15, startYGraph, 180, 100);

    // Add gap after the graph before the table
    const gapAfterGraph = 15;
    const startYTable = startYGraph + 100 + gapAfterGraph; // Calculate starting position for the table

    // Insert "List of Foods" title before the table
    doc.setFontSize(16);
    doc.text("List of Food", 20, startYTable); // Adding topic before the table

    // Move table start position down a bit to avoid overlap with the title
    const startYTableWithTitle = startYTable + 10; // Adjust for space between title and table

    // Low Stock Items Table
    if (lowStockItems.length > 0) {
      doc.setFontSize(14);
      doc.text("Low Stock Items", 20, startYTableWithTitle); // Title for low stock items
      const lowStockData = lowStockItems.map((item) => [
        item.name || "N/A",
        item.category || "N/A",
        `Rs ${item.price || 0}.00`,
        item.quantity !== undefined ? item.quantity : "N/A",
        "Low Stock",
      ]);

      doc.autoTable({
        head: [["Name", "Category", "Price", "Quantity", "Stock Level"]],
        body: lowStockData,
        startY: startYTableWithTitle + 10, // Start the table a little lower
        styles: {
          lineWidth: 0.5, // Table border width
          lineColor: [0, 0, 0], // Black border color for lines
        },
        tableLineColor: [0, 0, 0], // Black color for table borders
        tableLineWidth: 0.5, // Width of the table borders
      });
    }

    // Out of Stock Items Table
    if (outOfStockItemsList.length > 0) {
      const startYAfterLowStock = doc.autoTable.previous.finalY + 10; // Start the out-of-stock table after the low stock table
      doc.setFontSize(14);
      doc.text("Out of Stock Items", 20, startYAfterLowStock); // Title for out of stock items
      const outOfStockData = outOfStockItemsList.map((item) => [
        item.name || "N/A",
        item.category || "N/A",
        `Rs ${item.price || 0}.00`,
        item.quantity !== undefined ? item.quantity : "N/A",
        "Out of Stock",
      ]);

      doc.autoTable({
        head: [["Name", "Category", "Price", "Quantity", "Stock Level"]],
        body: outOfStockData,
        startY: startYAfterLowStock + 10, // Start the table a little lower
        styles: {
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.5,
      });
    }

    // Detailed Table for All Items
    const tableData = list.map((item) => [
      item.name || "N/A",
      item.category || "N/A",
      `Rs ${item.price || 0}.00`,
      item.quantity !== undefined ? item.quantity : "N/A",
      item.quantity > 0 ? "In Stock" : "Out of Stock",
    ]);

    const startY = doc.autoTable.previous?.finalY || startYTableWithTitle + 10; // Get the Y position after low stock table

    doc.autoTable({
      head: [["Name", "Category", "Price", "Quantity", "Stock Level"]],
      body: tableData,
      startY: startY + 20, // Adjust starting position after the low stock section
      styles: {
        lineWidth: 0.5, // Table border width
        lineColor: [0, 0, 0], // Black border color for lines
      },
      tableLineColor: [0, 0, 0], // Black color for table borders
      tableLineWidth: 0.5, // Width of the table borders
    });

    // Save the PDF
    doc.save("item_report.pdf");
  };


  return (
    <div style={{ margin: "30px" }}>
      {/* Banner for low stock or out-of-stock items */}
      {lowStockItems.length > 0 && (
        <div className="low-stock-banner">
          <h3 style={{ textAlign: "center" }}>
            Low Stock or Out of Stock Items
          </h3>
          <ul>
            {lowStockItems.map((item) => (
              <li key={item._id}>
                {item.name} -{" "}
                {item.quantity === 0
                  ? "Out of Stock"
                  : `Low Stock (${item.quantity})`}
              </li>
            ))}
          </ul>
        </div>
      )}
      <BarGraph data={chartData} categories={categories} graphRef={graphRef} />
      <div
        className="list add flex-col"
        style={{ borderRadius: "10px", width: "1000px" }}
      >
        <div className="list-header">
          <Link to={`/add`} className="add-item-btn">
            Add Item
          </Link>
          <p>All Food List</p>
          <div className="search">
            <input
              type="search"
              placeholder="Search Items..."
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
              onChange={(e) => {
                setStartDate(e.target.value);
                filterItemsByDate(e.target.value, endDate); // Call filter function when date changes
              }}
            />
          </div>
          <div className="date-input-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                filterItemsByDate(startDate, e.target.value); // Call filter function when date changes
              }}
            />
          </div>
        </div>
        <table className="list-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Province</th>
              <th>Food Category</th>
              <th>
                Price
                <br />
                (Per Unit)
              </th>
              <th>Quantity</th>
              <th>Stock Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`${url}/images/${item.image}`}
                      alt={item.name}
                      className="food-image"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.foodCategory}</td>
                  <td>Rs {item.price}.00</td>
                  <td>{item.quantity}</td>
                  <td>
                    <div className="stock-level-bar">
                      {item.quantity === 0 ? (
                        <div className="stock-level-fill out-of-stock">
                          Out of Stock
                        </div>
                      ) : (
                        <div
                          className="stock-level-fill"
                          style={getStockLevelStyle(item.quantity)}
                        ></div>
                      )}
                    </div>
                  </td>
                  <td className="actions">
                    <Link to={`/edit/` + item._id} className="update-btn">
                      <img
                        src={assets.edit_icon}
                        alt="Edit Icon"
                        className="icon"
                      />
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDelete(item._id)}
                    >
                      <img
                        src={assets.delete_icon}
                        alt="Delete Icon"
                        className="icon"
                      />
                    </button>
                    <br />
                    <br />
                    <br />
                    <br />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <h3>No Item Found for your search</h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={generatePDFReport} className="add-item-btn">
          Generate PDF Report
        </button>
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => removeFoods(currentItemId)}
          message="Are you sure you want to delete this Item?"
        />
      </div>
    </div>
  );
};

export default List;
