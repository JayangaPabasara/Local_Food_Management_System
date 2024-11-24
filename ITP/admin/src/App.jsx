import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import SideBar from "./components/SideBar/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Edit from "./pages/Edit/Edit.jsx";
import ListOrder from "./orderPages/List/ListOrder.jsx";
import EditOrder from "./orderPages/Edit/EditOrder.jsx";
import ListPayment from "./paymentPages/ListPayment/ListPayment.jsx";
import EditPayment from "./paymentPages/EditPayment/EditPayment.jsx";
import Home from "./deliveryPages/list/Home.jsx";
import CreatePost from "./deliveryPages/create/CreatePosts.jsx";
import EditPost from "./deliveryPages/edit/EditPost.jsx";
import PostDetails from "./deliveryPages/sendEmail/PostDetails.jsx";
import Dashboard from "./dashboard/dashboard.jsx";
import AddSupplierPayment from "./paymentPages/AddExpenses/AddSupplierPayment.jsx";
import EditExpense from "./paymentPages/EditPayment/EditExpense.jsx";
import AdminList from "./AdminManagment/AdminList/AdminList.jsx";
import AddAdmin from "./AdminManagment/AddAdmin/AddAdmin.jsx";
import AdminLogin from "./AdminManagment/AdminLogin/AdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import UserList from "./CustomerManagment/List/UserList.jsx";
import AddUser from "./CustomerManagment/Add/AddUser.jsx";
import EditUser from "./CustomerManagment/Edit/EditUser.jsx";
import SupplierManagement from "./SupplierPages/List/SupplierManagement.jsx";
import SupplierForm from "./SupplierPages/Add/SupplierForm.jsx";
import EditSupplierForm from "./SupplierPages/Edit/EditSupplierForm.jsx";
import SupplierOrderForm from "./SupplierPages/SupplierOrders/Add/SupplierOrderForm.jsx";
import EditSupplierOrderForm from "./SupplierPages/SupplierOrders/Edit/EditSupplierOrderForm.jsx";
import AddEmployee from "./Employee/AddEmployee.jsx";

const App = () => {
  const [adminName, setAdminName] = useState(
    localStorage.getItem("adminName") || ""
  );
  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <NavBar adminName={adminName} setAdminName={setAdminName} />
      <hr />
      <div className="app-content">
        <SideBar />
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <Add url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <List url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <ListOrder url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <Edit url={url} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/order/:id"
            element={
              <ProtectedRoute>
                <EditOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-payment"
            element={
              <ProtectedRoute>
                <ListPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-payment/:id"
            element={
              <ProtectedRoute>
                <EditPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/list"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/add"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/edit/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/post/:id"
            element={
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-supplier-payment"
            element={
              <ProtectedRoute>
                <AddSupplierPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-expense/:id"
            element={
              <ProtectedRoute>
                <EditExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/list"
            element={
              <ProtectedRoute>
                <AdminList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/list"
            element={
              <ProtectedRoute>
                <SupplierManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/add"
            element={
              <ProtectedRoute>
                <SupplierForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/edit/:id"
            element={
              <ProtectedRoute>
                <EditSupplierForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/order/add"
            element={
              <ProtectedRoute>
                <SupplierOrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/order/edit/:id"
            element={
              <ProtectedRoute>
                <EditSupplierOrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/list"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/add"
            element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/edit/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/add"
            element={
              <ProtectedRoute>
                <AddEmployee url={url} />
              </ProtectedRoute>
            }
          />
          {/* Public route for login */}
          <Route
            path="/admin/login"
            element={<AdminLogin setAdminName={setAdminName} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
