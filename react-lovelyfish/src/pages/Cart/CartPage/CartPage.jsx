
// /* 使用 Bootstrap 的 Card 和 ListGroup 组件创建美观的布局

// 添加了商品图片、数量调整按钮和删除按钮

// 实现了空购物车状态显示

// 添加了结算按钮

// 使用响应式布局适应不同屏幕尺寸 */
import React from "react";
import { useCart } from "../../../contexts/CartContext";
import './CartPage.css';

export default function CartPage() {
  const { cartItems, totalQuantity, totalPrice, loading, updateCartItem, removeCartItem } = useCart();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
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
              <li key={item.productId} className="cart-item">
                {/* 产品图片和名字 */}
                <div className="cart-product">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="cart-item-image"
                  />
                  <h4>{item.product?.name}</h4>
                </div>

                {/* 单价 */}
                <div className="cart-price">${item.product?.price}</div>

                {/* 数量 */}
                <div className="cart-quantity">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartItem(item.productId, parseInt(e.target.value, 10))}
                  />
                </div>

                {/* 总价 */}
                <div className="cart-total">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </div>

                {/* 删除按钮 */}
                <div className="cart-action">
                  <button onClick={() => removeCartItem(item.productId)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          {/* 购物车总结 */}
          <div className="cart-summary">
            <strong>Total Items:</strong> {totalQuantity}
            <br />
            <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
