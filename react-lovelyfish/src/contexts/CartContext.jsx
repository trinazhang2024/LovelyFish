import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../API/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("获取购物车失败", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post("/cart", { productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error("添加购物车失败", error);
    }
  };

  // 手动更新数量（输入框）
  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await api.post(`/cart/update/${cartItemId}?quantity=${quantity}`);
      await fetchCart();
    } catch (error) {
      console.error("更新购物车失败", error);
    }
  };

  // 增加数量
  const incrementItem = async (cartItemId) => {
    try {
      await api.post(`/cart/increment/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("增加数量失败", error);
    }
  };

  // 减少数量
  const decrementItem = async (cartItemId) => {
    try {
      await api.post(`/cart/decrement/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("减少数量失败", error);
    }
  };

  const removeCartItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("删除购物车商品失败", error);
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
