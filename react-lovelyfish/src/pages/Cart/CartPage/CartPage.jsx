// CartPage.jsx
import React, { useState } from "react";
import { useCart } from "../../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import './CartPage.css';

export default function CartPage() {
  const { cartItems, loading, removeCartItem } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  console.log("Cart Items:", cartItems);

  
  // 选择单个商品
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 全选 / 全不选
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(i => i.id));
    }
  };

  // 数量加减
  const incrementItem = (id) => {
    setLocalQuantities(prev => ({
      ...prev,
      [id]: (prev[id] ?? cartItems.find(i => i.id === id)?.quantity) + 1
    }));
  };

  const decrementItem = (id) => {
    setLocalQuantities(prev => {
      const current = prev[id] ?? cartItems.find(i => i.id === id)?.quantity;
      return { ...prev, [id]: current > 1 ? current - 1 : 1 };
    });
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

  const caculateOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please select items first!");
      return;
    }
    navigate("/confirm-order", { state: { selectedItems,quantities: localQuantities } });
  };

    // 计算选中商品总数量
  const selectedTotalQuantity = selectedItems.reduce(
    (sum, id) => {
      const item = cartItems.find(i => i.id === id);
      const quantity = localQuantities[id] ?? item.quantity;
      return sum + (item ? quantity : 0);
    },
    0
  );

  // 计算选中商品总价（折扣价）
  const originalTotalPrice = selectedItems.reduce((sum, id) => {
    const item = cartItems.find(i => i.id === id);
    const quantity = localQuantities[id] ?? item.quantity;
    if (!item) return sum;
    const discountedPrice = item.product.discountPercent
      ? item.product.price * (1 - item.product.discountPercent / 100)
      : item.product.price;
    return sum + discountedPrice * quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <button onClick={toggleSelectAll}>
            {selectedItems.length === cartItems.length ? "Unselect All" : "Select All"}
          </button>

          <ul className="cart-list">
            <li className="cart-header">
              <span>Select</span>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </li>
              {cartItems.map(item => {
                console.log(item.product);
                const discountedPrice = item.product.discountPercent
                  ? item.product.price * (1 - item.product.discountPercent / 100)
                  : item.product.price;
                const quantity = localQuantities[item.id] ?? item.quantity;
                const totalPrice = discountedPrice * quantity;

                const getProductImage = (product) => {
                  if (product.images && product.images.length > 0) {
                    return `https://localhost:7148/uploads/${product.images[0].fileName}`;
                  }
                  return 'https://localhost:7148/uploads/placeholder.png';
                };


                return (
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
                      {/* {(() => {
                        const productImage =
                          item.product?.mainImage ||
                          (item.product?.images && item.product.images[0]?.url) ||
                          'placeholder.png';
                        return <img src={productImage} alt={item.product?.title || 'Product'} className="cart-item-image" />;
                      })()} */}

                      <img src={getProductImage(item.product)} alt={item.product?.title || 'Product'} className="cart-item-image" />
                      <h4>{item.product?.title}</h4>
                    </div>

                    {/* Price */}
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

                    {/* Quantity */}
                    <div className="cart-quantity">
                      <button onClick={() => decrementItem(item.id)}>-</button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        onBlur={() => handleQuantityBlur(item.id)}
                      />
                      <button onClick={() => incrementItem(item.id)}>+</button>
                    </div>

                    {/* Total Price */}
                    <div className="cart-total">${totalPrice.toFixed(2)}</div>

                    {/* action */}
                    <div className="cart-action">
                      <button className="delete-btn" onClick={() => removeCartItem(item.id)}>Delete</button>
                    </div>
              </li>
             );
            })}
          </ul>

          {/* 总价和下一步按钮 */}
          <div className="cart-summary-container">
            <div className="cart-summary-left">
              <strong>Total Items:</strong> {selectedTotalQuantity}
              <br />
              <strong>Original Total Price:</strong> ${originalTotalPrice.toFixed(2)}
              <br />
            </div>
            <div className="cart-summary-right">
              <button onClick={caculateOrder}>Calculate Order</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
