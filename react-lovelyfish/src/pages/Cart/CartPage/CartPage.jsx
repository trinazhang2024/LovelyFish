import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useCart } from "../../../contexts/CartContext";
import api from '../../../API/axios'
import './CartPage.css';

export default function CartPage() {
  const { cartItems, loading, updateCartItem, incrementItem, decrementItem, removeCartItem, fetchCart} = useCart();
  const [localQuantities, setLocalQuantities] = useState({});
  const [processing, setProcessing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // 新增勾选状态
  
  // 计算已选商品总数量和总价
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const selectedTotalQuantity = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotalPrice = selectedCartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

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

  // 切换勾选状态
  const toggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // 全选 / 全取消
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // 全取消
    } else {
      setSelectedItems(cartItems.map(item => item.id)); // 全选
    }
  };

  const handleCheckout = async () => {

    // if (cartItems.length === 0) {
    //   alert("Your cart is empty!");
    //   return; }

    // if (cartItems.length !== 0 && selectedItems.length === 0) {
    //   alert("Please select items to checkout!");
    //   return; } 

    if (selectedItems.length === 0) {
      alert("Please select items to checkout!");
      return;
    }

    if (!customerName || !shippingAddress) 
      {alert("Please enter your name and shipping address.");
        return; }

    try {

      setProcessing(true);
      const selectedCartData = cartItems.filter(item => selectedItems.includes(item.id));
      console.log(selectedCartData);

      const res = await api.post("/cart/checkout", {
        customerName,
        shippingAddress,
        cartItemIds: selectedItems // 传选中的购物车项ID
    }); // 调用刚才新增的接口 submit order

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

      {/* Select All */}
      {cartItems.length > 0 && (
        <div className="select-all-container"> 
          <button className="select-all-btn" onClick={toggleSelectAll}>
            {selectedItems.length === cartItems.length ? "Unselect All" : "Select All"}
          </button>
        </div>
      )}

      {lastOrderId && (
        <div className="order-success">
          <p>
            🎉 Your order has been submitted! Order ID: <strong>{lastOrderId}</strong>
          </p>
          <p>Shipping cost will be emailed to you.</p>
          <p>Any question or payment instruction, please check 
            <Link to="/about" className="check-orders-link">
              About Us
            </Link>
            </p>
          <p>THANKS FOR YOUR SHOPPING!</p>
          <Link to="/orders" className="check-orders-link">
            Check my orders
          </Link>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-list">
            <li className="cart-header">
              <span>Select</span>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </li>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">

                {/* checkbox */}
                <div className="cart-select">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </div>

                {/* Picture and Name */}
                <div className="cart-product">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="cart-item-image"
                  />
                  <h4>{item.product?.name}</h4>
                </div>

                {/* Price */}
                <div className="cart-price">${item.product?.price.toFixed(2)}</div>

                {/* Quantity */}
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

                {/* Total Price */}
                <div className="cart-total">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </div>
                
                {/* Delete button */}
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
            <strong>Total Items:</strong> {selectedTotalQuantity}
            <br />
            <strong>Total Price:</strong> ${selectedTotalPrice.toFixed(2)}
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
