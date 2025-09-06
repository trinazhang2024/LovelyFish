import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../../API/axios";
import "../../Admin/AdminPages.css";
import "./UsersAdminPage.css";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of users per page

 
  // Fetch users from backend

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: { search, page, pageSize },
      });

      // Expected response: { items: [...], totalPages: n }
      setUsers(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  // Toggle user active/inactive status
 
  const toggleActive = async (id, active) => {
    try {
      await api.put(`/admin/users/${id}/active`, { active });
      fetchUsers(); // Refresh user list after update
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="users-admin-page">
      {/* Breadcrumb navigation */}
      <nav className="breadcrumb">
        <Link to="/admin/dashboard">Admin Dashboard</Link> &gt; <span>Users</span>
      </nav>

      <h1 className="page-title">User Management</h1>

      {/* Search box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by username or email"
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Empty state */}
      {users.length === 0 ? (
        <p className="no-users">No users found</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td data-label="ID">{user.id}</td>
                  <td data-label="Username">{user.username}</td>
                  <td data-label="Email">{user.email}</td>

                  {/* Orders link */}
                  <td data-label="Orders">
                    <Link
                      to={`/admin/users/${user.id}/orders`}
                      className="btn-view-orders"
                    >
                      {user.orderCount}
                    </Link>
                  </td>

                  {/* Active status */}
                  <td data-label="Active">{user.active ? "Yes" : "No"}</td>

                  {/* Action buttons */}
                  <td data-label="Actions" className="action-buttons">
                    <button
                      onClick={() => toggleActive(user.id, !user.active)}
                      className={user.active ? "btn-disable" : "btn-enable"}
                    >
                      {user.active ? "Disable" : "Enable"}
                    </button>

                    <Link
                      to={`/admin/users/${user.id}/orders`}
                      className="btn-view-orders"
                    >
                      View Orders
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
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
