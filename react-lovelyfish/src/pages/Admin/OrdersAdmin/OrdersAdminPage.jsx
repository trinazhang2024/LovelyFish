import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../../API/axios";
import "../../Admin/AdminPages.css";
import './OrdersAdminPage.css';

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false); // Table loading state
  const [savedFields, setSavedFields] = useState({});
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // Number of items per page

  const timerRef = useRef(null);

  // Debounce search and fetch orders
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        setLoadingOrders(true); // Only control table loading
        const params = { page, pageSize };
        if (userId) params.userId = userId;
        if (search) params.search = search;

        const res = await api.get("/admin/orders", { params });
        setOrders(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0); 
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }, 500);

    return () => clearTimeout(timerRef.current);
  }, [userId, search, page]);

  // Flash effect after saving a field
  const flashSaved = (orderId, field) => {
    const key = `${orderId}-${field}`;
    setSavedFields(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setSavedFields(prev => ({ ...prev, [key]: false })), 2000);
  };

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, status, { headers: { "Content-Type": "application/json" } });
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
      flashSaved(id, "status");
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Update shipping information
  const updateShipping = async (id, courier, trackingNumber) => {
    try {
      await api.put(`/orders/${id}/shipping`, { courier, trackingNumber });
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, courier, trackingNumber } : o)));
      flashSaved(id, "courier");
      flashSaved(id, "trackingNumber");
    } catch (err) {
      console.error("Failed to update shipping info", err);
    }
  };

  // Update local field value before saving
  const updateOrderField = (id, field, value) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, [field]: value } : o)));
  };

  console.log(page, totalPages);

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/admin/dashboard">Admin Dashboard</Link> &gt;{" "}
        <Link to="/admin/orders">Orders Management</Link> &gt;{" "}
        <span>{userId ? `Orders for User ${userId}` : "All Orders"}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-4">
        Orders Management {userId && `(User ID: ${userId})`}
      </h1>

      {/* Search input */}
      <div className="search-container mb-4">
        <input
          type="text"
          placeholder="Search by customer name or phone"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} 
          className="search-input"
        />
      </div>

      {/* Orders Table */}
      <div className="admin-table-container" style={{ position: "relative" }}>
        {loadingOrders && <div className="table-loading-overlay">Loading...</div>}
        {orders.length === 0 && !loadingOrders ? (
          <p>No Orders</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>OrderID</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Contact Phone</th>
                <th>Shipping Address</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Courier</th>
                <th>Tracking Number</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const statusSaved = savedFields[`${order.id}-status`];
                const courierSaved = savedFields[`${order.id}-courier`];
                const trackingSaved = savedFields[`${order.id}-trackingNumber`];
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phoneNumber} </td>
                    <td>{order.contactPhone}</td>
                    <td>{order.shippingAddress}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>

                    {/* Status Dropdown */}
                    <td className={statusSaved ? "saved-flash" : ""}>
                      <select
                        value={order.status || "pending"}
                        onChange={e => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    {/* Courier input, pickup will show N/A */}
                    {order.deliveryMethod === "courier" ? (
                      <td className={courierSaved ? "saved-flash" : ""}>
                        <input
                          value={order.courier || ""}
                          onChange={e => updateOrderField(order.id, "courier", e.target.value)}
                          onBlur={e => updateShipping(order.id, e.target.value, order.trackingNumber || "")}
                        />
                      </td>
                    ) : (
                      <td>N/A</td>
                    )}


                    {/* Tracking number input, pickup will show N/A */}
                    {order.deliveryMethod === "courier" ? (
                      <td className={trackingSaved ? "saved-flash" : ""}>
                        <input
                          value={order.trackingNumber || ""}
                          onChange={e => updateOrderField(order.id, "trackingNumber", e.target.value)}
                          onBlur={e => updateShipping(order.id, order.courier || "", e.target.value)}
                        />
                      </td>
                    ) : (
                      <td>N/A</td>
                    )}

                    <td>{new Date(order.createdAt).toLocaleString()}</td>

                    {/* View Details Button */}
                    <td>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="order-detail-btn"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination mt-4">
        <span>Total {totalItems} items, {pageSize} per page</span>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous Page</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next Page</button>
      </div>
    </div>
  );
}
