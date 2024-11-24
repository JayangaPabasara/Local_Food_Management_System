import React from "react";
import "./SideBar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/" className="sidebar-option">
          <img src={assets.dashboard_icon} alt="" className="icon" />
          <p>Dashboard</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.inventory_icon} alt="" className="icon" />
          <p>Inventory Management</p>
        </NavLink>
        <NavLink to="/order" className="sidebar-option">
          <img src={assets.order_icon} alt="" className="icon" />
          <p>Orders <br/>Magament</p>
        </NavLink>
        <NavLink to="/list-payment" className="sidebar-option">
          <img src={assets.payment_icon} alt="" className="icon" />
          <p>Payment Management</p>
        </NavLink>
        <NavLink to="/supplier/list" className="sidebar-option">
          <img src={assets.supply_icon} alt="" className="icon" />
          <p>Supplier<br/> Management</p>
        </NavLink>
        <NavLink to="/customer/list" className="sidebar-option">
          <img src={assets.customer_icon} alt="" className="icon" />
          <p>Customer Management</p>
        </NavLink>
        <NavLink to="/delivery/list" className="sidebar-option">
          <img src={assets.delivery_icon} alt="" className="icon" />
          <p>Delivery<br/> Management </p>
        </NavLink>
        <NavLink to="/admin/list" className="sidebar-option">
          <img src={assets.settings_icon} alt="" className="icon" />
          <p>Admin profile Management</p>
        </NavLink>
        <NavLink to="/employee/add" className="sidebar-option">
          <img src={assets.emp_icon} alt="" className="icon" />
          <p>Employee management</p>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
