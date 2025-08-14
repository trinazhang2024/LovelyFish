import React, { useState } from "react";
import { useCart } from "../../../contexts/CartContext";
import api from '../../../API/axios'
import './CartPage.css';

export default function CartPage() {
  const { cartItems, totalQuantity, totalPrice, loading, updateCartItem, incrementItem, decrementItem, removeCartItem, fetchCart} = useCart();
  const [localQuantities, setLocalQuantities] = useState({});
  const [processing, setProcessing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  // 新增收货人姓名和地址状态
  const [customerName, setCustomerName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");


  if (loading) return <p>Loading...</p>;

  const handleQuantityChange = (itemId, value) => {
    setLocalQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleQuantityBlur = (itemId) => {
    const quantity = parseInt(localQuantities[itemId], 10);
    if (!isNaN(quantity) && quantity > 0) {
      updateCartItem(itemId, quantity);
    }
  };

  const handleCheckout = async () => {

    if (cartItems.length === 0) return alert("Your cart is empty!");
    if (!customerName || !shippingAddress) return alert("Please enter your name and shipping address.");

    try {

      setProcessing(true);
      const res = await api.post("/cart/checkout", {
        customerName,
        shippingAddress }); // 调用刚才新增的接口 submit order

      const orderId = res.data.orderId;
      setLastOrderId(orderId);
      fetchCart();          // 前端清空购物车
      alert(
        `Order submitted! Your Order ID: ${orderId}.
Shipping cost will be emailed to you.`
      );
      setCustomerName("");
      setShippingAddress("");
      setProcessing(false);

    } catch (err) {
      console.error(err);
      alert("Failed to submit order");
      setProcessing(false);
    }
  };
  
  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {lastOrderId && (
        <div className="order-success">
          <p>
            🎉 Your order has been submitted! Order ID: <strong>{lastOrderId}</strong>
          </p>
          <p>Shipping cost will be emailed to you.</p>
          <p>Any question or need, pls check "CONTACT US"</p>
          <p>THANKS FOR YOUR SHOPPING!</p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-list">
            <li className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </li>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <div className="cart-product">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="cart-item-image"
                  />
                  <h4>{item.product?.name}</h4>
                </div>

                <div className="cart-price">${item.product?.price.toFixed(2)}</div>

                <div className="cart-quantity">
                  <button onClick={() => decrementItem(item.id)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={localQuantities[item.id] ?? item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    onBlur={() => handleQuantityBlur(item.id)}
                  />
                  <button onClick={() => incrementItem(item.id)}>+</button>
                </div>

                <div className="cart-total">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </div>

                <div className="cart-action">
                  <button
                    className="delete-btn"
                    onClick={() => removeCartItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* 输入姓名和收货地址 */}
          <div className="checkout-info">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>

          <div className="cart-summary">
            <strong>Total Items:</strong> {totalQuantity}
            <br />
            <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
          </div>
          
           <div className="checkout-container">
            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? "Submitting..." : "Submit Order"}
            </button>
          </div>

        </>
      )}
    </div>
  );
}
