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


  // Selection Handlers
  // -------------------------

  // Toggle single item selection
  const toggleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Select all / Deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(i => i.id));
    }
  };

 
  // Quantity Handlers
  // -------------------------

  // Increase quantity
  const incrementItem = (id) => {
    setLocalQuantities(prev => ({
      ...prev,
      [id]: (prev[id] ?? cartItems.find(i => i.id === id)?.quantity) + 1
    }));
  };

  // Decrease quantity
  const decrementItem = (id) => {
    setLocalQuantities(prev => {
      const current = prev[id] ?? cartItems.find(i => i.id === id)?.quantity;
      return { ...prev, [id]: current > 1 ? current - 1 : 1 };
    });
  };

  // Direct quantity input change
  const handleQuantityChange = (id, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setLocalQuantities(prev => ({ ...prev, [id]: num }));
    }
  };

  // On blur, can call backend API to update quantity
  const handleQuantityBlur = (id) => {
    console.log("Update quantity for", id, "to", localQuantities[id]);
    // TODO: Call backend API to save updated quantity
  };


  // Order Calculation / Navigation
  // -------------------------

  const calculateOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please select items first!");
      return;
    }
    navigate("/confirm-order", { state: { selectedItems, quantities: localQuantities } });
  };


  // Computed Values
  // -------------------------

  // Total selected quantity
  const selectedTotalQuantity = selectedItems.reduce((sum, id) => {
    const item = cartItems.find(i => i.id === id);
    const quantity = localQuantities[id] ?? item.quantity;
    return sum + (item ? quantity : 0);
  }, 0);

  // Total price for selected items (with discount)
  const originalTotalPrice = selectedItems.reduce((sum, id) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return sum;

    const quantity = localQuantities[id] ?? item.quantity;
    const discountedPrice = item.product.discountPercent
      ? item.product.price * (1 - item.product.discountPercent / 100)
      : item.product.price;

    return sum + discountedPrice * quantity;
  }, 0);


  // Render
  // -------------------------
  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {/* Select All / Unselect All */}
          <button onClick={toggleSelectAll}>
            {selectedItems.length === cartItems.length ? "Unselect All" : "Select All"}
          </button>

          {/* Cart List */}
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
              const discountedPrice = item.product.discountPercent
                ? item.product.price * (1 - item.product.discountPercent / 100)
                : item.product.price;
              const quantity = localQuantities[item.id] ?? item.quantity;
              const totalPrice = discountedPrice * quantity;

              const IMAGE_BASE_URL = "https://lovelyfishstorage2025.blob.core.windows.net/uploads";
              const getProductImage = (product) => {
                if (product.images && product.images.length > 0) {
                  return `${IMAGE_BASE_URL}${product.images[0].fileName}`;
                }
                return `${IMAGE_BASE_URL}placeholder.png`; // fallback image
              };

              return (
                <li key={item.id} className="cart-item">
                  {/* Checkbox */}
                  <div className="cart-select">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </div>

                  {/* Product Image & Name */}
                  <div className="cart-product">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product?.title || 'Product'}
                      className="cart-item-image"
                    />
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

                  {/* Total */}
                  <div className="cart-total">${totalPrice.toFixed(2)}</div>

                  {/* Action */}
                  <div className="cart-action">
                    <button className="delete-btn" onClick={() => removeCartItem(item.id)}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Summary & Next Step */}
          <div className="cart-summary-container">
            <div className="cart-summary-left">
              <strong>Total Items:</strong> {selectedTotalQuantity} <br />
              <strong>Original Total Price:</strong> ${originalTotalPrice.toFixed(2)}
            </div>
            <div className="cart-summary-right">
              <button onClick={calculateOrder}>Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
