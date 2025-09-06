import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../../API/axios";
import "../../../Admin/AdminPages.css";
import './UsersOrdersPage.css';

export default function UsersOrdersPage() {
  const { userId } = useParams(); // Get the userId from URL
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of orders per page


  // Fetch user orders from backend

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/users/${userId}/orders`, {
          params: { page, pageSize },
        });

        setOrders(res.data.items || []);       // Save orders
        setTotalPages(res.data.totalPages || 1); // Save total pages
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, page]);

 
  // Loading and empty state
 
  if (loading) return <p className="loading-text">Loading...</p>;
  if (orders.length === 0) return <p className="no-orders">This user has no orders.</p>;

  return (
    <div className="users-orders-page">
      {/* Breadcrumb navigation */}
      <nav className="breadcrumb">
        <Link to="/admin/dashboard">Admin Dashboard</Link> &gt;{" "}
        <Link to="/admin/users">User Management</Link> &gt; <span>Order List</span>
      </nav>

      <h1 className="page-title">User Order List</h1>

      {/*Orders table*/}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Courier / Tracking</th>
              <th>Order Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                {/* Use data-label for mobile card layout */}
                <td data-label="Order ID">{o.id}</td>
                <td data-label="Customer Name">{o.customerName}</td>
                <td data-label="Phone">{o.phoneNumber}</td>
                <td data-label="Address">{o.shippingAddress}</td>
                <td data-label="Total Price">${o.totalPrice}</td>
                <td data-label="Status">{o.status}</td>
                <td data-label="Courier / Tracking">
                  {o.courier} {o.trackingNumber}
                </td>
                <td data-label="Order Time">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Back button */}
      <Link to="/admin/users" className="btn return-button">
        Back to User List
      </Link>

      {/*Pagination buttons */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
