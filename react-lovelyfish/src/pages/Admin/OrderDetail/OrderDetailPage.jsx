import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../API/axios";
import "../../Admin/AdminPages.css";
import "./OrderDetailPage.css";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedFields, setSavedFields] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/admin/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("获取订单详情失败", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const flashSaved = (field) => {
    setSavedFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => setSavedFields(prev => ({ ...prev, [field]: false })), 2000);
  };

  const updateShipping = async (field, value) => {
    if (!order) return;
    try {
      const newCourier = field === "courier" ? value : order.courier;
      const newTracking = field === "trackingNumber" ? value : order.trackingNumber;

      await api.put(`/orders/${order.id}/shipping`, { courier: newCourier, trackingNumber: newTracking });

      setOrder(prev => ({ ...prev, courier: newCourier, trackingNumber: newTracking }));
      flashSaved(field);
    } catch (err) {
      console.error("更新快递信息失败", err);
    }
  };

  const handleFieldChange = (field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  if (loading)
    return <p className="loading-text text-center mt-10">加载中...</p>;
  if (!order)
    return <p className="error-text text-center mt-10">订单不存在</p>;

  return (
    <div className="order-detail-page p-4">
      <nav className="breadcrumb mb-4">
        <Link to="/admin">后台管理</Link> &gt;{" "}
        <Link to="/admin/orders">订单管理</Link> &gt;{" "}
        <span>Order Detail (ID: {order.id})</span>
      </nav>

      <h1 className="page-title mb-4">Order Detail (ID: {order.id})</h1>

      <div className="admin-table-container mb-6">
        <table className="admin-table">
          <tbody>
            <tr>
              <th>CustomerName</th>
              <td>{order.customerName}</td>
            </tr>
            <tr>
              <th>PhoneNumber</th>
              <td>
                {order.phoneNumber && <>Account PhoneNumber: {order.phoneNumber}<br /></>}
                {order.contactPhone && <>ContactPhone: {order.contactPhone}</>}
              </td>
            </tr>
            <tr>
              <th>Shipping address</th>
              <td>{order.shippingAddress}</td>
            </tr>
            <tr>
              <th>TotalPrice</th>
              <td>${order.totalPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
            </tr>
            <tr>
              <th>Courier</th>
              <td className={savedFields["courier"] ? "saved-flash" : ""}>
                <input
                  value={order.courier || ""}
                  onChange={e => handleFieldChange("courier", e.target.value)}
                  onBlur={e => updateShipping("courier", e.target.value)}
                  placeholder="courier company"
                />
              </td>
            </tr>
            <tr>
              <th>Tracking Number</th>
              <td className={savedFields["trackingNumber"] ? "saved-flash" : ""}>
                <input
                  value={order.trackingNumber || ""}
                  onChange={e => handleFieldChange("trackingNumber", e.target.value)}
                  onBlur={e => updateShipping("trackingNumber", e.target.value)}
                  placeholder="Tracking Number"
                />
              </td>
            </tr>
            <tr>
              <th>CreatedAt</th>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link to="/admin/orders" className="btn return-button">
        Back to OrderList
      </Link>
    </div>
  );
}
