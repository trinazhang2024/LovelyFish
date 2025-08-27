import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../../API/axios";
import "../../../Admin/AdminPages.css";

export default function UsersOrdersPage() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/users/${userId}/orders`, {
          params: { page, pageSize }
        });
        setOrders(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("获取用户订单失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, page]);

  if (loading) return <p className="loading-text">加载中...</p>;
  if (orders.length === 0) return <p className="no-orders">该用户暂无订单</p>;

  return (
    <div className="users-orders-page">
      <nav className="breadcrumb">
        <Link to="/admin">后台管理</Link> &gt;{" "}
        <Link to="/admin/users">用户管理</Link> &gt; <span>订单列表</span>
      </nav>

      <h1 className="page-title">用户订单列表</h1>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>订单ID</th>
              <th>客户姓名</th>
              <th>电话</th>
              <th>地址</th>
              <th>总金额</th>
              <th>状态</th>
              <th>快递/追踪号</th>
              <th>下单时间</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td data-label="订单ID">{o.id}</td>
                <td data-label="客户姓名">{o.customerName}</td>
                <td data-label="电话">{o.phoneNumber}</td>
                <td data-label="地址">{o.shippingAddress}</td>
                <td data-label="总金额">{o.totalPrice}</td>
                <td data-label="状态">{o.status}</td>
                <td data-label="快递/追踪号">
                  {o.courier} {o.trackingNumber}
                </td>
                <td data-label="下单时间">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
