import React, { useEffect, useState } from "react";
import { useCart } from "../../../contexts/CartContext";
import api from "../../../API/axios";
import "./OrdersPage.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]); // Store user's orders
  const [loading, setLoading] = useState(true); // Loading state
  const { addToCart } = useCart(); // Function to add items to cart

  // ----------------- Fetch user's orders -----------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my"); // Call backend OrdersController
        console.log("Fetched orders:", res.data);
        setOrders(res.data); // Store returned orders
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ----------------- View logistics info -----------------
  const viewLogistics = (courier, trackingNumber) => {
    if (!trackingNumber) {
      alert("There is no logistic information for this order. Thank you!");
      return;
    }
    alert(`Courier Company: ${courier}\nTracking Number: ${trackingNumber}`);
  };

  // ----------------- Re-purchase previous order -----------------
  const repurchase = async (order) => {
    console.log("Re-purchase order items:", order.orderItems);
    try {
      const requests = order.orderItems.map(item => {
        if (!item.productId || item.quantity < 1) {
          console.warn("Invalid item, skip:", item);
          return Promise.resolve();
        }
        console.log("Adding to cart:", item.productId, item.quantity);
        return addToCart(item.productId, item.quantity); // Add item to cart
      });
      await Promise.all(requests);
      alert(`The items of order #${order.id} have been added to your cart.`);
    } catch (err) {
      console.error("Failed to re-purchase:", err);
      alert("Failed to re-purchase. Please try again.");
    }
  };

  // ----------------- Contact support -----------------
  const contactSupport = () => {
    window.location.href = "/contact";
  };

  // ----------------- Render loading / empty states -----------------
  if (loading) return <p className="loading">Loading orders...</p>;
  if (!orders.length) return <p className="empty-orders">You have no orders yet.</p>;

  // ----------------- Main render -----------------
  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.map((order, index) => {
        // Calculate original total price (unit price * quantity)
        const originalTotal = order.orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Final total returned by backend
        const finalTotal = order.totalPrice ?? 0;

        // Amount saved
        const saved = originalTotal - finalTotal;

        
        const getProductImage = (item) => {
            return item.mainImageUrl; //the backend returns the full path and placeholder logical
        };

        return (
          <div key={order.id} className="order-card">
            {/* ----------------- Order Header ----------------- */}
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

            {/* ----------------- Order Items ----------------- */}
            <div className="order-items">
              {order.orderItems.map((item) => (
                <div key={item.id} className="order-item">
                  {/* Product image */}
                  <img
                    src={getProductImage(item)}
                    alt={item.productName ?? "Product"}
                    className="order-item-image"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.error) {
                        e.currentTarget.src = "placeholder.png";
                        e.currentTarget.dataset.error = "true";
                      }
                    }}
                  />
                  {/* Product info */}
                  <p>
                    {item.productName} x {item.quantity} - ${item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* ----------------- Order Actions ----------------- */}
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
