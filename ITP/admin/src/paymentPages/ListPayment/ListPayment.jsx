import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListPayment.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../Styles/table.css";
import html2canvas from "html2canvas";
import Modal from "../../components/DeleteModel/deleteModel";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ListPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state
  const [deletionType, setDeletionType] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [searchExpenseTerm, setSearchExpenseTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/payment");
        const expenseResponse = await axios.get(
          "http://localhost:4000/api/expenses"
        );
        console.log("API Response:", response.data);
        setPayments(response.data.payments || response.data || []);
        setExpenses(expenseResponse.data.expenses || []);
      } catch (error) {
        console.error("Error fetching payments", error);
        toast.error("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Function to prepare data for the graph
  const prepareGraphData = () => {
    const incomeData = payments.map((payment) => ({
      date: new Date(payment.date).toLocaleDateString(), // Format date for the X-axis
      income: payment.amount,
    }));

    const expenseData = expenses.map((expense) => ({
      date: new Date(expense.orderDate).toLocaleDateString(), // Format date for the X-axis
      expense: expense.totalAmount,
    }));

    // Combine income and expense data by date
    const combinedData = {};

    incomeData.forEach(({ date, income }) => {
      combinedData[date] = { income: income, expense: 0 };
    });

    expenseData.forEach(({ date, expense }) => {
      if (combinedData[date]) {
        combinedData[date].expense += expense; // Add expenses to the existing date
      } else {
        combinedData[date] = { income: 0, expense: expense }; // Create new entry
      }
    });

    // Convert combinedData object to an array for the graph
    return Object.entries(combinedData).map(([date, values]) => ({
      date,
      ...values,
    }));
  };

  const graphData = prepareGraphData();

  const handleEdit = (id) => {
    navigate(`/edit-payment/${id}`);
  };

  const handleAddSupplierPayment = () => {
    navigate("/add-supplier-payment");
  };

  const handleEditExpense = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  const handleDelete = async () => {
    try {
      if (deletionType === "income") {
        await axios.delete(
          `http://localhost:4000/api/payment/delete/${currentId}`
        );
        setPayments(payments.filter((payment) => payment._id !== currentId));
        toast.success("Payment deleted successfully");
      } else if (deletionType === "expense") {
        await axios.delete(
          `http://localhost:4000/api/expenses/delete/${currentId}`
        );
        setExpenses(expenses.filter((expense) => expense._id !== currentId));
        toast.success("Expense deleted successfully");
      }
      setShowDeleteModal(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting", error);
      toast.error("Error deleting the item");
    }
  };

  const confirmDelete = (id, type) => {
    setCurrentId(id); // Set the correct currentId to be used in handleDelete
    setDeletionType(type); // Set deletion type to either 'income' or 'expense'
    setShowDeleteModal(true); // Open the modal for confirmation
  };

  const confirmExpensesDelete = (id) => {
    setCurrentExpensesId(id);
    setShowDeleteModal(true);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text("Payment List Report - Income", 20, 10);

    const filteredPayments = payments.filter((payment) =>
      payment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableData = filteredPayments.map((payment) => [
      payment.orderID,
      payment.name,
      payment.email,
      `Rs ${payment.amount}.00`,
      payment.status,
      payment.date,
    ]);

    doc.autoTable({
      head: [["Order ID", "Name", "Email", "Amount", "Status", "Date"]],
      body: tableData,
      startY: 20,
      styles: {
        lineWidth: 0.5, // Table border width
        lineColor: [0, 0, 0], // Black border color for lines
      },
      tableLineColor: [0, 0, 0], // Black color for table borders
      tableLineWidth: 0.5, // Width of the table borders
    });

    const totalIncome = calculateTotalIncome(filteredPayments);
    doc.text(
      `Total Income: Rs ${totalIncome}.00`,
      20,
      doc.autoTable.previous.finalY + 10
    );
    doc.save("payment_report.pdf");
  };

  const generateExpensePDFReport = () => {
    const doc = new jsPDF();
    doc.text("Expense List Report", 20, 10);

    const filteredExpenses = expenses.filter((expense) =>
      expense.supplierName
        .toLowerCase()
        .includes(searchExpenseTerm.toLowerCase())
    );

    const tableData = filteredExpenses.map((expense) => [
      expense.orderID,
      expense.supplierName,
      expense.supplierEmail,
      `Rs ${expense.totalAmount}.00`,
      new Date(expense.orderDate).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [["Order ID", "Supplier Name", "Email", "Amount", "Date"]],
      body: tableData,
      startY: 20,
      styles: {
        lineWidth: 0.5, // Table border width
        lineColor: [0, 0, 0], // Black border color for lines
      },
      tableLineColor: [0, 0, 0], // Black color for table borders
      tableLineWidth: 0.5, // Width of the table borders
    });

    const totalExpense = calculateTotalExpenses(filteredExpenses);
    doc.text(
      `Total Expenses: Rs ${totalExpense}.00`,
      20,
      doc.autoTable.previous.finalY + 10
    );
    doc.save("expense_report.pdf");
  };

  const generateOverallAnalysisPDFReport = () => {
    const doc = new jsPDF();
    doc.text("Overall Analysis Report", 20, 10);

    const totalIncome = calculateTotalIncome(payments);
    const totalExpenses = calculateTotalExpenses(expenses);
    const profit = calculateProfit(payments, expenses);

    doc.text(`Total Income: Rs ${totalIncome}.00`, 20, 30);
    doc.text(`Total Expenses: Rs ${totalExpenses}.00`, 20, 40);
    doc.text(`Profit: Rs ${profit}.00`, 20, 50);

    // Capture the graph
    const graphElement = document.querySelector(".recharts-wrapper"); // Get the graph element
    if (graphElement) {
      html2canvas(graphElement).then((canvas) => {
        const graphImage = canvas.toDataURL("image/png"); // Convert graph to image
        const imgWidth = 190; // Set the width for the image in the PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
        doc.addImage(graphImage, "PNG", 10, 60, imgWidth, imgHeight); // Add image to PDF
        doc.save("overall_analysis_report.pdf");
      });
    } else {
      // If graph is not rendered, still generate the report without it
      doc.save("overall_analysis_report.pdf");
    }
  };

  const calculateTotalIncome = (payments) => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.totalAmount, 0);
  };

  const calculateProfit = (payments, expenses) => {
    const totalIncome = calculateTotalIncome(payments);
    const totalExpenses = calculateTotalExpenses(expenses);
    return totalIncome - totalExpenses;
  };

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="list add flex-col" style={{ borderRadius: "10px" }}>
      {/* Add the graph here */}
      <div className="recharts-wrapper">
        <h2
          style={{
            textAlign: "center",
            color: "#165ffd",
            marginBottom: "30px",
          }}
        >
          Income and Expenses Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#8884d8"
              fillOpacity={0.3}
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#82ca9d"
              fillOpacity={0.3}
              fill="#82ca9d"
            />
            <Line type="monotone" dataKey="income" stroke="#8884d8" />
            <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <hr style={{ margin: "30px 0px 30px 0px", backgroundColor: "black" }} />
      <div className="list-header">
        <button
          onClick={generatePDFReport}
          style={{ width: "200px" }}
          className="generate-pdf-btn"
        >
          Generate PDF Report
        </button>
        <h1>Payment List</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
      </div>
      <h2>Income</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th style={{ display: "none" }}>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(payments) && payments.length > 0 ? (
            payments
              .filter((payment) =>
                payment.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((payment) => (
                <tr key={payment._id}>
                  <td style={{ display: "none" }}>{payment.orderID}</td>
                  <td>{payment.name}</td>
                  <td>{payment.email}</td>
                  <td>Rs {payment.amount}.00</td>
                  <td>{payment.status}</td>
                  <td className="actions">
                    <button
                      className="update-btn"
                      onClick={() => handleEdit(payment._id)}
                    >
                      <img src={assets.edit_icon} className="icon" />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDelete(payment._id, "income")}
                    >
                      <img src={assets.delete_icon} className="icon" />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="5">No payments found</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total ={" "}
            </td>
            <td style={{ textAlign: "left" }}>
              Rs{" "}
              {calculateTotalIncome(
                payments.filter((payment) =>
                  payment.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )}
              .00
            </td>
          </tr>
        </tfoot>
      </table>
      <hr style={{ margin: "30px 0px 20px 0px" }} />
      <div className="list-header">
        <button
          onClick={handleAddSupplierPayment}
          className="add-supplier-payment-btn"
        >
          Add Supplier Payment
        </button>
        <div className="search">
          <input
            type="search"
            placeholder="Search expenses..."
            value={searchExpenseTerm}
            onChange={(e) => setSearchExpenseTerm(e.target.value)}
            className="search-bar"
          />
        </div>
      </div>
      <h2>Expenses</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th style={{ display: "none" }}>Order ID</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses
            .filter((expense) =>
              expense.supplierName
                .toLowerCase()
                .includes(searchExpenseTerm.toLowerCase())
            )
            .map((expense) => (
              <tr key={expense._id}>
                <td>{expense.supplierName}</td>
                <td style={{ display: "none" }}>{expense.orderID}</td>
                <td>{expense.supplierEmail}</td>
                <td>Rs {expense.totalAmount}.00</td>
                <td>{new Date(expense.orderDate).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="update-btn"
                    onClick={() => handleEditExpense(expense._id)}
                  >
                    <img src={assets.edit_icon} className="icon" />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => confirmDelete(expense._id, "expense")}
                  >
                    <img src={assets.delete_icon} className="icon" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total ={" "}
            </td>
            <td style={{ textAlign: "left" }}>
              Rs{" "}
              {calculateTotalExpenses(
                expenses.filter((expense) =>
                  expense.supplierName
                    .toLowerCase()
                    .includes(searchExpenseTerm.toLowerCase())
                )
              )}
              .00
            </td>
          </tr>
        </tfoot>
      </table>
      <button onClick={generateExpensePDFReport} className="generate-pdf-btn">
        Generate Expenses PDF
      </button>
      <hr style={{ margin: "30px 0px 20px 0px" }} />
      <h2>Profit</h2>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Profit: Rs {calculateProfit(payments, expenses)}.00
      </div>
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal} // Pass showDeleteModal as isOpen prop
          message={`Are you sure you want to delete this ${
            deletionType === "income" ? "payment" : "expense"
          }?`}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteModal(false)} // Properly close the modal
        />
      )}
      <button
        onClick={generateOverallAnalysisPDFReport}
        className="generate-overrole-pdf-btn"
      >
        Generate Overall Analysis Report
      </button>
    </div>
  );
};

export default ListPayment;
