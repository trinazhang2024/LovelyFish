// src/pages/admin/Dashboard.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import ProductsAdminPage from "../ProductsAdmin/ProductsAdminPage";
import OrdersAdminPage from "../OrdersAdmin/OrdersAdminPage";
import UsersAdminPage from "../UsersAdmin/UsersAdminPage";
import AdminChangePassword from "../ChangePassword/AdminChangePassword";
import { useUser } from "../../../contexts/UserContext";
import "./Dashboard.css";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("orders");
  const { user, isAdmin, loading } = useUser();

  // Show loading state when user data is being fetched
  if (loading) return <p>Loading...</p>;

  // Redirect to login if user is not logged in
  if (!user) return <Navigate to="/admin/login" />;

  // Restrict access if user is not an admin
  if (!isAdmin) return <p>You do not have permission to access this page</p>;

  // Render different admin pages based on selected tab
  const renderPage = () => {
    switch (activePage) {
      case "orders":
        return <OrdersAdminPage />;
      case "products":
        return <ProductsAdminPage />;
      case "users":
        return <UsersAdminPage />;
      default:
        return <OrdersAdminPage />;
    }
  };

  return (
    <div className="dashboard">
      {/* Left Sidebar Navigation */}
      <aside className="dashboard-aside">
        <div className="title">Admin Dashboard</div>
        <nav>
          <button
            className={activePage === "orders" ? "active" : ""}
            onClick={() => setActivePage("orders")}
          >
            Orders Management
          </button>
          <button
            className={activePage === "products" ? "active" : ""}
            onClick={() => setActivePage("products")}
          >
            Products Management
          </button>
          <button
            className={activePage === "users" ? "active" : ""}
            onClick={() => setActivePage("users")}
          >
            Users Management
          </button>
        </nav>
      </aside>

      {/* Right Main Content Area */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <button
            className="change-password-btn"
            onClick={() => setActivePage("changePassword")}
          >
            Change Password
          </button>
        </div>
        {activePage === "changePassword" ? (
          <AdminChangePassword />
        ) : (
          renderPage()
        )}
      </div>
    </div>
  );
}

/* 
Admin Dashboard Features

Orders Management:
- View all user orders (with pagination / filters)
- Update order status (pending → paid → shipped → completed)
- Edit shipping company & tracking number
- Search orders (by user, date, order ID, etc.)

Products Management:
- Add / Edit / Delete products
- Manage stock, price, images

Users Management:
- View user list
- View user order history

Future Statistics (optional):
- Total sales
- Daily / monthly order count
- Best-selling products ranking
*/
