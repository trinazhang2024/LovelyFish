import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import './OrdersPage.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my"); // 调用后端 OrdersController
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // add logistics info, re-buy info and contact info
  const viewLogistics = (courier, trackingNumber) => {
    if (!trackingNumber) {
      alert("There is no logistic information on this order, thank you!");
      return;
    }
    alert(`Courier Company: ${courier}\nTracking Number: ${trackingNumber}`);
    // 也可以改成 window.open(快递公司官网 + trackingNumber)
  };

  const repurchase = (orderId) => {
    alert(`The items of ${orderId} have been added to cart`);
    // TODO: 调用后端API，把订单商品重新加入购物车
  };

  const contactSupport = () => {
    window.location.href = "/contact";
  };
  

  if (loading) return <p className="loading">Loading orders...</p>;
  if (!orders.length) return <p className="empty-orders">You have no orders yet.</p>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.map((order, index) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <p><strong>Order #:</strong> {orders.length - index}</p>  {/* number from 1 not from database */}
            {/* <p><strong>Order ID:</strong> {order.id}</p> */} 
            {/* the id above is the id from database */}
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Address:</strong> {order.shippingAddress}</p>
            <p><strong>Profile Phone:</strong> {order.phoneNumber ?? order.PhoneNumber ?? "N/A"}</p>
            <p><strong>Contact Phone:</strong> {order.contactPhone ?? order.ContactPhone ?? "N/A"}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${order.status}`}>
                {order.status === "pending"}
                {order.status === "paid"}
                {order.status === "shipped"}
                {order.status === "completed"}
              </span>
            </p>
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

          <div className="order-actions">
            <button onClick={() => viewLogistics(order.courier, order.trackingNumber)}>Courier info</button>
            <button onClick={() => repurchase(order.id)}>Re-purchase</button>
            <button onClick={contactSupport}>Contact Us</button>
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