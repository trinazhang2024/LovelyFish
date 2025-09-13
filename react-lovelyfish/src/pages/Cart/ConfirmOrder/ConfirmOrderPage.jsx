// ConfirmOrderPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import api from "../../../API/axios";
import "./ConfirmOrderPage.css";

export default function ConfirmOrderPage() {
  const location = useLocation(); // Used to get selected items and quantities passed from previous page
  const { cartItems, fetchCart } = useCart(); // Get cart items and fetchCart function from context

  // ----------------- State Hooks -----------------
  const [user, setUser] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [useNewUserCoupon, setUseNewUserCoupon] = useState(false);
  const [use50Coupon, setUse50Coupon] = useState(false);
  const [use100Coupon, setUse100Coupon] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [userOrderCount, setUserOrderCount] = useState(0);

  const [localQuantities, setLocalQuantities] = useState({}); // Track quantity changes locally
  const [selectedCartData, setSelectedCartData] = useState([]); // Products selected for checkout

  const [loadingUser, setLoadingUser] = useState(true);
  const [bankInfo, setBankInfo] = useState(null);
  const [orderAmount, setOrderAmount] = useState(0);

  // ----------------- Fetch Current User -----------------
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/Account/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
        setUser({ newUserUsed: false }); // fallback for new user
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  // ----------------- Fetch Bank Information -----------------
  useEffect(() => {
    async function fetchBankInfo() {
      try {
        const res = await api.get("/settings/email", { withCredentials: true });
        console.log('Bank info:', res.data);
        setBankInfo(res.data);
      } catch (err) {
        console.error("Failed to load bank info", err);
      }
    }
    fetchBankInfo();
  }, []);

  // ----------------- Initialize Selected Items -----------------
  useEffect(() => {
    if (!user || !cartItems.length) return;

    const selectedItems = location.state?.selectedItems || [];
    const selectedData = cartItems.filter(i => selectedItems.includes(i.id));
    setSelectedCartData(selectedData);

    // Initialize local quantities (from previous page state or default cart quantity)
    const initialQuantities = {};
    selectedData.forEach(item => {
      initialQuantities[item.id] = location.state?.quantities?.[item.id] ?? item.quantity;
    });
    setLocalQuantities(initialQuantities);
  }, [user, cartItems, location.state]);

  // ----------------- Fetch User Order Count -----------------
  useEffect(() => {
    async function fetchUserOrderCount() {
      try {
        const res = await api.get("/orders/my", { withCredentials: true });
        setUserOrderCount(res.data.length); // Store number of previous orders
      } catch (err) {
        console.error("Failed to get user orders count", err);
      }
    }
    fetchUserOrderCount();
  }, []);

  // ----------------- Quantity Handlers -----------------
  const incrementItem = id => {
    setLocalQuantities(prev => ({ ...prev, [id]: (prev[id] ?? 1) + 1 }));
  };

  const decrementItem = id => {
    setLocalQuantities(prev => ({ ...prev, [id]: Math.max((prev[id] ?? 1) - 1, 1) }));
  };

  const handleQuantityChange = (id, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) setLocalQuantities(prev => ({ ...prev, [id]: num }));
  };

  // ----------------- Coupon Logic -----------------
  const canUseNewUserCoupon = user ? !user.newUserUsed : false;

  const originalTotalPrice = selectedCartData.reduce((sum, item) => {
    const quantity = localQuantities[item.id] ?? item.quantity;
    const discountedPrice = item.product.discountPercent
      ? item.product.price * (1 - item.product.discountPercent / 100)
      : item.product.price;
    return sum + discountedPrice * quantity;
  }, 0);

  const canUse50Coupon = originalTotalPrice >= 50;
  const canUse100Coupon = originalTotalPrice >= 100;

  const handleNewUserCoupon = () => {
    if (canUseNewUserCoupon) setUseNewUserCoupon(prev => !prev);
  };

  const handle50Coupon = () => {
    if (!use50Coupon) setUse100Coupon(false); // Only one coupon ($50 or $100) can be active
    setUse50Coupon(prev => !prev);
  };

  const handle100Coupon = () => {
    if (!use100Coupon) setUse50Coupon(false);
    setUse100Coupon(prev => !prev);
  };

  // Calculate total discount
  const discountAmount = (() => {
    let discount = 0;
    if (useNewUserCoupon && canUseNewUserCoupon) discount += 5;
    if (use50Coupon && canUse50Coupon) discount += 5;
    if (use100Coupon && canUse100Coupon) discount += 10;
    return discount;
  })();

  const finalTotalPrice = Math.max(originalTotalPrice - discountAmount, 0);

  // ----------------- Checkout Handler -----------------
  const handleCheckout = async () => {

    // Validate required fields
    if (!customerName.trim() || !phone.trim() || !customerEmail.trim()) {
      alert("⚠️ Please fill in your name, phone number and shipping address before submitting the order.");
      return;
    }

    if (shippingAddress !== "none" && !shippingAddress.trim()) {
      alert("⚠️ Please provide your shipping address or select Pickup option.");
      return;
    }
    
    try {
      setProcessing(true);

      const itemsToSubmit = selectedCartData.map(item => ({
        id: item.id,
        quantity: localQuantities[item.id] || item.quantity || 1
      }));

      // Determine delivery method based on shippingAddress
      const deliveryMethod = shippingAddress === "none" ? "pickup" : "courier";

      const res = await api.post("/cart/checkout", {
        customerName,
        phone,
        customerEmail,
        shippingAddress,
        deliveryMethod,
        items: itemsToSubmit,
        useNewUserCoupon,
        use50Coupon,
        use100Coupon
      });

      setLastOrderId(res.data.orderId);
      setOrderAmount(res.data.totalPrice);
      fetchCart(); // Refresh cart after checkout

      if (res.data.newUserUsed) {
        setUser(prev => ({ ...prev, newUserUsed: true }));
        setUseNewUserCoupon(false); 
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(err.response?.data || err.message || "Submit failed!");
    } finally {
      setProcessing(false);
    }
  };

  // ----------------- Render -----------------
  if (loadingUser) {
    return <div>Loading order info...</div>;
  }

  return (
    <div className="confirm-order-container">
      <h2>Confirm Order</h2>

      {/* If order has been submitted */}
      {lastOrderId ? (
        <div className="order-success">
          <p>🎉 Your order has been submitted! Order ID: <strong>{userOrderCount + 1}</strong></p>
          <p>Payment instructions have been sent to your email. Please check your inbox or spam folder for the details.</p>
          <p><strong>Order Amount:</strong> ${orderAmount.toFixed(2)}</p>

          {/* <p>
      {shippingMethod === "courier" 
        ? "For courier delivery, we will email you shortly with the total amount including courier fees." 
        : "For pickup, please transfer the payment using the bank details provided in the email, or pay in cash at our store."}
    </p>

    {bankInfo && shippingMethod !== "courier" && (
      <>
        <h4>Bank Transfer Information:</h4>
        <p><strong>Bank:</strong> {bankInfo.bankName}</p>
        <p><strong>Account Name:</strong> {bankInfo.accountName}</p>
        <p><strong>Account Number:</strong> {bankInfo.accountNumber}</p>
        <p>
          ⚠️ After transferring, please screenshot the transaction and email it to us for verification.{" "}
          <Link to="/contact">Contact Us</Link>
        </p>
      </>
    )} */}

          {bankInfo && (
            <>
              <h4>Bank Transfer Information:</h4>
              <p><strong>Bank:</strong> {bankInfo.bankName}</p>
              <p><strong>Account Name:</strong> {bankInfo.accountName}</p>
              <p><strong>Account Number:</strong> {bankInfo.accountNumber}</p>
              <p>⚠️ After transferring, please screenshot the transaction and email it to us for verification.
                <Link to="/contact">Contact Us</Link>
              </p>
            </>
          )}

          <Link to="/orders" className="check-orders-link">Check my orders</Link>
        </div>
      ) : (
        <>
          {/* Selected Products */}
          <h3>Products Selected</h3>
          <ul className="cart-list">
            <li className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </li>
            {selectedCartData.map(item => {
              const quantity = localQuantities[item.id] ?? item.quantity;
              const discountedPrice = item.product.discountPercent
                ? item.product.price * (1 - item.product.discountPercent / 100)
                : item.product.price;
              const totalPrice = discountedPrice * quantity;

              const IMAGE_BASE_URL = process.env.REACT_APP_API_BASE_UPLOADS;

              const getProductImage = (product) => {
                if (product?.images?.length > 0) {
                  return product.images[0].fileName;
                }
                return `${IMAGE_BASE_URL}placeholder.png`;
              };

              return (
                <li key={item.id} className="cart-item">
                  <div className="cart-product">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product?.title}
                      className="cart-item-image"
                    />
                    <h4>{item.product?.title}</h4>
                  </div>

                  <div className="cart-price">
                    {item.product.discountPercent > 0 ? (
                      <>
                        <span className="original-price">${item.product.price.toFixed(2)}</span>
                        <span className="discount-price">${discountedPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span>${discountedPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="cart-quantity">
                    <button onClick={() => decrementItem(item.id)}>-</button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                    <button onClick={() => incrementItem(item.id)}>+</button>
                  </div>

                  <div className="cart-total">${totalPrice.toFixed(2)}</div>
                </li>
              );
            })}
          </ul>

          {/* Customer Information Form */}
          <h3>Customer Information</h3>
          <div className="confirm-form">

            <h5>Name</h5>
            <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Your Name" />

            <h5>Phone Number</h5>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" 
              pattern="[0-9]{7,15}"   // only numbers, and length limited between 7 and 15.
              required/>

              <h5>Email</h5>
              <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="Email" 
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              required/>

              <h5>Delivery Method</h5>
              <div className="delivery-method">
                {/* courier */}
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="courier"
                    checked={shippingAddress !== "none"}
                    onChange={() => setShippingAddress("")}
                  />
                  Courier
                </label>
                
                {/* Pickup */}
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={shippingAddress === "none"}
                    onChange={() => setShippingAddress("none")}
                  />
                  Pickup
                </label>
              </div>

              <h5>Postal Address</h5>
              <input type="text" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder={
                shippingAddress === "none"
                  ? "Pickup selected - please enter 'none'"
                  : "Shipping Address"
              }
                disabled={shippingAddress === "none"} // Postal address will be disable if choose pickup option. 
              />

              {shippingAddress === "none" && (
                <p className="pickup-note">※ You selected pickup. Address will be set to <strong>none</strong>.</p>
              )}
            </div>

            {/* Coupons */}
            <h3>Coupon</h3>
            <div className="coupon-buttons">
              <button className={useNewUserCoupon ? "active" : ""} disabled={!canUseNewUserCoupon} onClick={handleNewUserCoupon}>
                New User - $5
              </button>
              <button className={use50Coupon ? "active" : ""} disabled={!canUse50Coupon} onClick={handle50Coupon}>
                $50 - $5
              </button>
              <button className={use100Coupon ? "active" : ""} disabled={!canUse100Coupon} onClick={handle100Coupon}>
                $100 - $10
            </button>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-container">
            <div className="cart-summary-left">
              <strong>Total Items:</strong> {Object.values(localQuantities).reduce((a, b) => a + b, 0)}
              <br />
              <strong>Original Total Price:</strong> ${originalTotalPrice.toFixed(2)}
              {discountAmount > 0 && (
                <>
                  <br/><strong>Discount:</strong> -${discountAmount.toFixed(2)}
                  <br/><strong>Final Total Price:</strong> ${finalTotalPrice.toFixed(2)}
                </>
              )}
            </div>
            <div className="cart-summary-right">
              <button className="checkout-button" onClick={handleCheckout} disabled={processing}>
                {processing ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
