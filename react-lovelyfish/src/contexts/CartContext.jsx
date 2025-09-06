import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../API/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Fetch the shopping cart
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a product to the cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post("/cart", { productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  // Manually update quantity (input field)
  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await api.post(`/cart/update/${cartItemId}?quantity=${quantity}`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to update cart item", error);
    }
  };

  // Increase quantity
  const incrementItem = async (cartItemId) => {
    try {
      await api.post(`/cart/increment/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to increment item quantity", error);
    }
  };

  // Decrease quantity
  const decrementItem = async (cartItemId) => {
    try {
      await api.post(`/cart/decrement/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to decrement item quantity", error);
    }
  };

  // Remove item from cart
  const removeCartItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove cart item", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        totalPrice,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        incrementItem,
        decrementItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
