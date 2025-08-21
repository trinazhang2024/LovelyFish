// ConfirmOrderPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import api from "../../../API/axios";
import "./ConfirmOrderPage.css";

export default function ConfirmOrderPage() {
  const location = useLocation();
  const { cartItems, fetchCart } = useCart();

  // ----------------- Hooks -----------------
  const [user, setUser] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const [useNewUserCoupon, setUseNewUserCoupon] = useState(false);
  const [use50Coupon, setUse50Coupon] = useState(false);
  const [use100Coupon, setUse100Coupon] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  const [localQuantities, setLocalQuantities] = useState({});
  const [selectedCartData, setSelectedCartData] = useState([]);

  // ----------------- Effects -----------------
  // 等待 user 和 cartItems 加载完成后初始化 selectedCartData 和 localQuantities

  const [loadingUser, setLoadingUser] = useState(true);
  

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/Account/me", { withCredentials: true });
        console.log("User data:", res.data); // 查看返回数据
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
        setUser({ NewUserCouponUsed: false }); // 临时 fallback
      } finally {
        setLoadingUser(false); // ✅ 一定要关掉
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user || !cartItems.length) return;

    const selectedItems = location.state?.selectedItems || [];
    const selectedData = cartItems.filter(i => selectedItems.includes(i.id));
    setSelectedCartData(selectedData);

    const initialQuantities = {};
    selectedData.forEach(item => {
      initialQuantities[item.id] = location.state?.quantities?.[item.id] ?? item.quantity;
    });
    setLocalQuantities(initialQuantities);
  }, [user, cartItems, location.state]);

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

  console.log(canUseNewUserCoupon);

  const originalTotalPrice = selectedCartData.reduce(
    (sum, item) => sum + item.product.price * (localQuantities[item.id] ?? item.quantity),
    0
  );
  const canUse50Coupon = originalTotalPrice >= 50;
  const canUse100Coupon = originalTotalPrice >= 100;

  const handleNewUserCoupon = () => {
    if (canUseNewUserCoupon) setUseNewUserCoupon(prev => !prev);
  };

  const handle50Coupon = () => {
    if (!use50Coupon) setUse100Coupon(false);
    setUse50Coupon(prev => !prev);
  };

  const handle100Coupon = () => {
    if (!use100Coupon) setUse50Coupon(false);
    setUse100Coupon(prev => !prev);
  };

  const discountAmount = (() => {
    let discount = 0;
    if (useNewUserCoupon && canUseNewUserCoupon) discount += 5;
    if (use50Coupon && canUse50Coupon) discount += 5;
    if (use100Coupon && canUse100Coupon) discount += 10;
    return discount;
  })();

  const finalTotalPrice = Math.max(originalTotalPrice - discountAmount, 0);

  // ----------------- Checkout -----------------
  const handleCheckout = async () => {
    try {
      setProcessing(true);
  
      // 将每个商品的 id 和数量打包
      const itemsToSubmit = selectedCartData.map(item => ({
        id: item.id,
        quantity: localQuantities[item.id] || item.quantity || 1
      }));
  
      const res = await api.post("/cart/checkout", {
        customerName,
        phone,
        shippingAddress,
        items: itemsToSubmit,
        useNewUserCoupon,
        use50Coupon,
        use100Coupon
      });
  
      console.log("Checkout response:", res.data);
  
      setLastOrderId(res.data.orderId);
      fetchCart();
  
      // 更新新人卷状态
      if (res.data.newUserUsed) {
        setUser(prev => ({ ...prev, NewUserCouponUsed: true }));
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

      {lastOrderId ? (
        <div className="order-success">
          <p>🎉 Your order has been submitted! Order ID: <strong>{lastOrderId}</strong></p>
          <p>Shipping cost will be emailed to you.</p>
          <p>
            Any question or payment instruction, please check{" "}
            <Link to="/about" className="check-orders-link">About Us</Link>
          </p>
          <p>THANKS FOR YOUR SHOPPING!</p>
          <Link to="/orders" className="check-orders-link">Check my orders</Link>
        </div>
      ) : (
        <>
          <h3>Products Selected</h3>
          <ul className="cart-list">
            <li className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </li>
            {selectedCartData.map(item => (
              <li key={item.id} className="cart-item">
                <div className="cart-product">
                  <img src={item.product?.image} alt={item.product?.name} className="cart-item-image"/>
                  <h4>{item.product?.name}</h4>
                </div>
                <div className="cart-price">${item.product.price.toFixed(2)}</div>
                <div className="cart-quantity">
                  <button onClick={() => decrementItem(item.id)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={localQuantities[item.id] ?? 1}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  />
                  <button onClick={() => incrementItem(item.id)}>+</button>
                </div>
                <div className="cart-total">
                  ${(item.product.price * (localQuantities[item.id] ?? 1)).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <h3>Customer Information</h3>
          <div className="confirm-form">
            <h5>Name</h5>
            <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Your Name"/>
            <h5>Phone Number</h5>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone"/>
            <h5>Postal Address</h5>
            <input type="text" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="Shipping Address"/>
          </div>

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

          <div className="cart-summary-container">
            <div className="cart-summary-left">
              <strong>Total Items:</strong> {Object.values(localQuantities).reduce((a,b)=>a+b,0)}
              <br/>
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





// 改动重点：

// 新人卷按钮灰掉逻辑：!user.NewUserCouponUsed

// 50卷和100卷互斥，互斥时切换时自动取消另一个

// 可以和新人卷组合

// 折扣计算与按钮状态同步，前端显示与后端一致

// 提交订单时传递全部信息，后端直接计算最终总价