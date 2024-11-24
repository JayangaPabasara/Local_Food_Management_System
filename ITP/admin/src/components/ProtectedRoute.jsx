import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("adminName");

  // If admin is not logged in, redirect to login page
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" />;
  }

  // If admin is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
