import React, { useEffect, useState } from "react";
import { useCart } from "../../../contexts/CartContext";
import api from "../../../API/axios";
import "./OrdersPage.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my"); // 调用后端 OrdersController
        setOrders(res.data);

        //console.log('res.data :', res.data);
        

        // ✅ 打印每个订单的图片 URL
        // res.data.forEach(order => {
        //   console.log("Order", order.id, "images:", order.orderItems.map(i => i.mainImageUrl));
        // });

      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const viewLogistics = (courier, trackingNumber) => {
    if (!trackingNumber) {
      alert("There is no logistic information on this order, thank you!");
      return;
    }
    alert(`Courier Company: ${courier}\nTracking Number: ${trackingNumber}`);
  };

  const repurchase = async (order) => {
    console.log("Re-purchase order items:", order.orderItems); // ✅ 调试打印
    try {
      const requests = order.orderItems.map(item => {
        if (!item.productId || item.quantity < 1) {
          console.warn("Invalid item, skip:", item);
          return Promise.resolve();
        }
        console.log("Adding to cart:", item.productId, item.quantity);
        return addToCart(item.productId, item.quantity); // ✅ 小写
      });
      await Promise.all(requests);
      alert(`The items of order #${order.id} have been added to cart`);
    } catch (err) {
      console.error("Failed to re-purchase:", err);
      alert("Failed to re-purchase. Please try again.");
    }
  };

  const contactSupport = () => {
    window.location.href = "/contact";
  };

  if (loading) return <p className="loading">Loading orders...</p>;
  if (!orders.length) return <p className="empty-orders">You have no orders yet.</p>;



  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.map((order, index) => {
        // 计算原价（所有商品单价 * 数量）
        const originalTotal = order.orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // 后端返回的最终支付价格
        const finalTotal = order.totalPrice ?? 0;

        // 节省的金额
        const saved = originalTotal - finalTotal;

        const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_UPLOADS
        const getProductImage = (item) => {
          if (item.mainImageUrl) {

           // console.log('item.mainImageUrl:', item.mainImageUrl);
            
            // 如果 mainImageUrl 已经是 /uploads/xxx.jpg，则直接拼接完整 URL
            return `${IMAGE_BASE_URL}${item.mainImageUrl}`;
          }
          return `${IMAGE_BASE_URL}placeholder.png`;
        };

        return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <p><strong>Order #:</strong> {orders.length - index}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              <p>
                <strong>Total:</strong>{" "}
                <span className="final-price">${finalTotal.toFixed(2)}</span>
                {saved > 0 && (
                  <>
                    {" "}
                    <span className="original-price" style={{ textDecoration: "line-through", color: "#888" }}>
                      ${originalTotal.toFixed(2)}
                    </span>
                    <span className="discount-amount" style={{ color: "green", fontWeight: "bold", marginLeft: "8px" }}>
                      You saved ${saved.toFixed(2)}!
                    </span>
                  </>
                )}
              </p>

              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Address:</strong> {order.shippingAddress}</p>
              <p><strong>Profile Phone:</strong> {order.phoneNumber ?? order.PhoneNumber ?? "N/A"}</p>
              <p><strong>Contact Phone:</strong> {order.contactPhone ?? order.ContactPhone ?? "N/A"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${order.status}`}>{order.status}</span>
              </p>
            </div>

            <div className="order-items">
              {order.orderItems.map((item) => (

                

                <div key={item.id} className="order-item">

                  {/* image */}
                  <img
                    src={getProductImage(item)}
                    alt={item.productName ?? "Product"}
                    className="order-item-image"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.error) {
                        e.currentTarget.src = "/uploads/placeholder.png";
                        e.currentTarget.dataset.error = "true";
                      }
                    }}
                  />

                  {/* product info and price */}
                  <p>
                    {item.productName} x {item.quantity} - ${item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-actions">
              <button onClick={() => viewLogistics(order.courier, order.trackingNumber)}>
                Courier info
              </button>
              <button onClick={() => repurchase(order)}>
                Re-purchase
              </button>
              <button onClick={contactSupport}>Contact Us</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
