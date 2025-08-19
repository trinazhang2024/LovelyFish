// ConfirmOrderPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation,  Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import api from "../../../API/axios";
import "./ConfirmOrderPage.css";

export default function ConfirmOrderPage() {
  const location = useLocation();
  const { cartItems, fetchCart } = useCart();

  const selectedItems = location.state?.selectedItems || []; //上个页面传来的选中的购物车 item id。
  const selectedCartData = cartItems.filter(i => selectedItems.includes(i.id)); //从购物车数据中过滤出选中的商品。

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
 
  
  
  //useXXXCoupon：前端按钮是否勾选。
  const [useNewUserCoupon, setUseNewUserCoupon] = useState(false);
  const [use50Coupon, setUse50Coupon] = useState(false);
  const [use100Coupon, setUse100Coupon] = useState(false);
  

  const [canUseNewUserCoupon, setCanUseNewUserCoupon] = useState(true);
  const [canUse50Coupon, setCanUse50Coupon] = useState(true);
  const [canUse100Coupon, setCanUse100Coupon] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

    // 1️⃣ 初始化 localQuantities,本地维护每个商品的数量，初始值来自传过来的数量或购物车数量。
    const [localQuantities, setLocalQuantities] = useState(() => {
      const initial = {};
      selectedCartData.forEach(item => {
        initial[item.id] = location.state?.quantities?.[item.id] ?? item.quantity;
      });
      return initial;
    });

   // 2️⃣ 如果 selectedCartData 变化，确保 localQuantities 有所有 id
   useEffect(() => {
    const updatedQuantities = { ...localQuantities };
    selectedCartData.forEach(item => {
      if (!(item.id in updatedQuantities)) {
        updatedQuantities[item.id] = location.state?.quantities?.[item.id] ?? item.quantity;
      }
    });
    setLocalQuantities(updatedQuantities);
  }, [selectedCartData]);

  // 估算优惠券可用性
  useEffect(() => {
    const estimateDiscount = async () => {
      try {
        const res = await api.post("/cart/estimate", {
          CartItemIds: selectedItems,
          quantities: localQuantities,
          UseNewUserCoupon: useNewUserCoupon,
          Use50Coupon: use50Coupon,
          Use100Coupon: use100Coupon
        });
        setCanUseNewUserCoupon(res.data.canUseNewUserCoupon);
        setCanUse50Coupon(res.data.originalTotal >= 50);
        setCanUse100Coupon(res.data.originalTotal >= 100);
      } catch (err) {
        console.error("Estimate failed:", err);
      }
    };
    estimateDiscount();
  }, [selectedItems, localQuantities, useNewUserCoupon, use50Coupon, use100Coupon]);

  // 数量操作
  const incrementItem = (id) => {
    setLocalQuantities(prev => ({
      ...prev,
      [id]: (prev[id] ?? 1) + 1
    }));
  };

  const decrementItem = (id) => {
    setLocalQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] ?? 1) - 1, 1)
    }));
  };

  const handleQuantityChange = (id, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setLocalQuantities(prev => ({ ...prev, [id]: num }));
    }
  };

  const handleQuantityBlur = (id) => {
    // 可在这里调用后端接口更新购物车数量
    console.log("Update quantity for", id, "to", localQuantities[id]);
  };

  // 总价和总数量
  const selectedTotalQuantity = selectedCartData.reduce(
    (sum, item) => sum + (localQuantities[item.id] ?? item.quantity),
    0
  );

  const originalTotalPrice = selectedCartData.reduce(
    (sum, item) => sum + item.product.price * (localQuantities[item.id] ?? item.quantity),
    0
  );

  // 计算折扣
  const discountAmount = (() => {
    let discount = 0;
    if (useNewUserCoupon) discount += 5;
    if (use50Coupon && originalTotalPrice >= 50) discount += 5;
    if (use100Coupon && originalTotalPrice >= 100) discount += 10;
    return discount;
  })();

  const finalTotalPrice = Math.max(originalTotalPrice - discountAmount, 0);
  

  // 提交订单
  const handleCheckout = async () => {
    if (!customerName || !phone || !shippingAddress) {
      alert("Please fill all information.");
      return;
    }

    try {
      setProcessing(true);
      const res = await api.post("/cart/checkout", {
        customerName,
        phone,
        shippingAddress,
        cartItemIds: selectedItems,
        useNewUserCoupon,
        use50Coupon,
        use100Coupon,
        quantities: localQuantities // 传最新数量给后端
      });

      setLastOrderId(res.data.orderId);
      
      fetchCart(); // 清空购物车
    } catch (err) {
      console.error(err);
      alert("Submit failed!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="confirm-order-container">
      <h2>Confirm Order</h2>

      {lastOrderId ? (
        <div className="order-success">
          <p>
            🎉 Your order has been submitted! Order ID: <strong>{lastOrderId}</strong>
          </p>
          <p>Shipping cost will be emailed to you.</p>
          <p>
            Any question or payment instruction, please check{" "}
            <Link to="/about" className="check-orders-link">
              About Us
            </Link>
          </p>
          <p>THANKS FOR YOUR SHOPPING!</p>
          <Link to="/orders" className="check-orders-link">
            Check my orders
          </Link>
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
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="cart-item-image"
                  />
                  <h4>{item.product?.name}</h4>
                </div>
                
                <div className="cart-price">${item.product.price.toFixed(2)}</div>
                
                <div className="cart-quantity">
                  <button onClick={() => decrementItem(item.id)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={localQuantities[item.id]}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    onBlur={() => handleQuantityBlur(item.id)}

                  />
                  <button onClick={() => incrementItem(item.id)}>+</button>
                </div>
                <div className="cart-total">
                  ${(item.product.price * localQuantities[item.id]).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <h3>Customer Information</h3>
          <div className="confirm-form">
            <h5>Name</h5>
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <h5>Phone Number</h5>
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <h5>Postal Address</h5>
            <input
              type="text"
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
          
          <h3>Coupon</h3>
          <div className="coupon-buttons">
            <button
              className={useNewUserCoupon ? "active" : ""}
              disabled={!canUseNewUserCoupon}
              onClick={() => canUseNewUserCoupon && setUseNewUserCoupon(!useNewUserCoupon)}
            >
              New User - $5
            </button>

            {/* coupon $50-$5 */}
            <button
              className={use50Coupon ? "active" : ""}
              disabled={!canUse50Coupon}
              onClick={() => {
                if (!canUse50Coupon) return;
                setUse50Coupon(prev => { if (!prev) setUse100Coupon(false); return !prev; });
              }}
            >
              $50 - $5
            </button>

            {/* coupon $100-$10 */}
            <button
              className={use100Coupon ? "active" : ""}
              disabled={!canUse100Coupon}
              onClick={() => {
                if (!canUse100Coupon) return;
                setUse100Coupon(prev => { if (!prev) setUse50Coupon(false); return !prev; });
              }}
            >
              $100 - $10
            </button>
          </div>

          <div className="cart-summary-container">
            <div className="cart-summary-left">
              <strong>Total Items:</strong> {selectedTotalQuantity}
              <br />
              <strong>Original Total Price:</strong> ${originalTotalPrice.toFixed(2)}

              {discountAmount > 0 && (
                <>
                  <br /><strong>Discount:</strong> -${discountAmount.toFixed(2)}
                  <br /><strong>Final Total Price:</strong> ${finalTotalPrice.toFixed(2)}
                </>
              )}
            </div>
            <div className="cart-summary-right">
              <button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


// $50 和 $100 优惠券按钮根据可用条件自动禁用。

// 新人卷 $5 仍然只允许一次。

// 点击按钮前端会检查可用状态，避免提交非法优惠。

// 后端 estimate 接口已经返回 originalTotal、canUseNewUserCoupon，可以判断 $50/$100 是否可用