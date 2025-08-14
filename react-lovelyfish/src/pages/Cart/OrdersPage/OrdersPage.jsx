import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import './OrdersPage.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders"); // 调用后端 OrdersController
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (!orders.length) return <p className="empty-orders">You have no orders yet.</p>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Address:</strong> {order.shippingAddress}</p>
          </div>
          <div className="order-items">
            {order.orderItems.map(item => (
              <div key={item.id} className="order-item">
                <p>
                  {item.productName} x {item.quantity} - ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 改动总结：

// order.customerName 和 order.shippingAddress 已显示在每个订单卡片里。

// orderItems 只显示 item.productName（前端不再依赖 item.product，避免可能的空值）。

// 保留加载和空状态提示。