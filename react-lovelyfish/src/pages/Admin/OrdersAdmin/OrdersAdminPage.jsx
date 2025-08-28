import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../../API/axios";
import "../../Admin/AdminPages.css";
import './OrdersAdminPage.css';

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false); // 表格加载状态
  const [savedFields, setSavedFields] = useState({});
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // 每页显示条数

  const timerRef = useRef(null);

  // 防抖 + 请求
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        setLoadingOrders(true); // 只控制表格 loading
        const params = { page, pageSize: 10 };
        if (userId) params.userId = userId;
        if (search) params.search = search;

        const res = await api.get("/admin/orders", { params });
        setOrders(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0); 
      } catch (err) {
        console.error("获取订单失败:", err);
      } finally {
        setLoadingOrders(false);
      }
    }, 500);

    return () => clearTimeout(timerRef.current);
  }, [userId, search, page]);

  const flashSaved = (orderId, field) => {
    const key = `${orderId}-${field}`;
    setSavedFields(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setSavedFields(prev => ({ ...prev, [key]: false })), 2000);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, status, { headers: { "Content-Type": "application/json" } });
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
      flashSaved(id, "status");
    } catch (err) {
      console.error("更新状态失败", err);
    }
  };

  const updateShipping = async (id, courier, trackingNumber) => {
    try {
      await api.put(`/orders/${id}/shipping`, { courier, trackingNumber });
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, courier, trackingNumber } : o)));
      flashSaved(id, "courier");
      flashSaved(id, "trackingNumber");
    } catch (err) {
      console.error("更新快递信息失败", err);
    }
  };

  const updateOrderField = (id, field, value) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, [field]: value } : o)));
  };
  console.log(page, totalPages);

  return (
    <div className="p-4">
      <nav className="breadcrumb">
        <Link to="/admin/dashboard">后台管理</Link> &gt;{" "}
        <Link to="/admin/orders">订单管理</Link> &gt;{" "}
        <span>{userId ? `用户 ${userId} 的订单` : "所有订单"}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-4">
        订单管理 {userId && `(用户ID: ${userId})`}
      </h1>

      <div className="search-container mb-4">
        <input
          type="text"
          placeholder="Search by customer name or phone"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} 
          className="search-input"
        />
      </div>

      <div className="admin-table-container" style={{ position: "relative" }}>
        {loadingOrders && <div className="table-loading-overlay">加载中...</div>}
        {orders.length === 0 && !loadingOrders ? (
          <p>None Orders</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>OrderID</th>
                <th>CustomerName</th>
                <th>PhoneNumber</th>
                <th>ContactPhone</th>
                <th>Shipping Address</th>
                <th>TotalPrice</th>
                <th>Status</th>
                <th>Courier</th>
                <th>TrackingNumber</th>
                <th>CreatedAt</th>
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

                    <td className={courierSaved ? "saved-flash" : ""}>
                      <input
                        value={order.courier || ""}
                        onChange={e => updateOrderField(order.id, "courier", e.target.value)}
                        onBlur={e => updateShipping(order.id, e.target.value, order.trackingNumber || "")}
                      />
                    </td>

                    <td className={trackingSaved ? "saved-flash" : ""}>
                      <input
                        value={order.trackingNumber || ""}
                        onChange={e => updateOrderField(order.id, "trackingNumber", e.target.value)}
                        onBlur={e => updateShipping(order.id, order.courier || "", e.target.value)}
                      />
                    </td>

                    <td>{new Date(order.createdAt).toLocaleString()}</td>

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

      {/* 分页按钮 */}
      <div className="pagination mt-4">
        <span>共 {totalItems} 条，每页 {pageSize} 条</span>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous Page</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next Page</button>
      </div>
    </div>
  );
}
