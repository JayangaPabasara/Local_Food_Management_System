import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import TopSoldItemsPieChart from "../Visualization/TopSoldItemsPieChart.jsx";
import BarGraph from "../Visualization/BarGraph.jsx";
import IncomeExpenseLineGraph from "../Visualization/IncomeExpenseLineGraph.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [topSoldItems, setTopSoldItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [graphData, setGraphData] = useState([]); // Add state for the graph data
  const [payments, setPayments] = useState([]); // Add state for payments
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/food/list");
        if (response.data.success) {
          const foodItems = response.data.data;

          const lowStock = foodItems.filter(
            (food) => food.quantity <= 5
          ).length;
          const outOfStock = foodItems.filter(
            (food) => food.quantity === 0
          ).length;

          setLowStockCount(lowStock);
          setOutOfStockCount(outOfStock);
        } else {
          setError("Failed to fetch food items");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError("Something went wrong while fetching food items");
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/order");
        if (response.data.success) {
          const orders = response.data.orders;
          setOrders(orders);

          const totalSales = orders.reduce(
            (acc, order) => acc + order.amount,
            0
          );
          setSalesCount(totalSales);

          const topSoldItems = getTopSoldItems(orders);
          setTopSoldItems(topSoldItems);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Something went wrong while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/food/list");
        const allItems = response.data.data;

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

        const formattedData = Object.keys(provinceCategoryData).map(
          (province) => ({
            province,
            ...provinceCategoryData[province],
          })
        );

        setChartData(formattedData);
        setCategories(
          Object.keys(
            allItems.reduce((acc, item) => {
              acc[item.foodCategory || "Other"] = true;
              return acc;
            }, {})
          )
        ); // Extract unique categories
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Something went wrong while fetching chart data");
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/payment");
        const expenseResponse = await axios.get(
          "http://localhost:4000/api/expenses"
        );

        setPayments(response.data.payments || response.data || []);
        setExpenses(expenseResponse.data.expenses || []);
      } catch (error) {
        console.error("Error fetching payments and expenses", error);
        setError("Something went wrong while fetching payments and expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
    fetchOrders();
    fetchChartData();
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

  useEffect(() => {
    if (payments.length > 0 && expenses.length > 0) {
      const graphData = prepareGraphData();
      setGraphData(graphData);
    }
  }, [payments, expenses]);

  const getTopSoldItems = (orders) => {
    const itemCount = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    const sortedItems = Object.entries(itemCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, quantity]) => ({ name, quantity }));

    return sortedItems;
  };

  return (
    <div className="admin-dashboard">
      <div className="matrix-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        <Link to={"/list"} className="card">
          <h2>Low Stock Items</h2>
          <p>{lowStockCount}</p>
        </Link>

        <Link to={"/list"} className="card">
          <h2>Out of Stock Items</h2>
          <p>{outOfStockCount}</p>
        </Link>

        <div className="card">
          <h2>Total Sales Amount</h2>
          <p>Rs. {salesCount.toFixed(2)}</p>
        </div>

        <div className="card">
          <h2>Total Customers</h2>
          <p>50</p>
        </div>
      </div>
      <div className="bar-chart-container">
        <BarGraph data={chartData} categories={categories} />
      </div>
      <div className="line-chart-container">
        <IncomeExpenseLineGraph data={graphData} />
      </div>
      <div className="dashboard-pie-chart-container">
        {topSoldItems.length > 0 && (
          <TopSoldItemsPieChart topSoldItems={topSoldItems} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
