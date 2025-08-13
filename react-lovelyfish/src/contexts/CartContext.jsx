import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../API/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 计算购物车总数量和总价
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 从后端获取购物车内容
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      console.log("cart fetch res.data:", res.data);  // 打印完整响应数据
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("获取购物车失败", error);
    } finally {
      setLoading(false);
    }
  };

  // 添加商品到购物车
  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post("/cart", { productId, quantity });
      await fetchCart(); // 刷新购物车状态
    } catch (error) {
      console.error("添加购物车失败", error);
    }
  };

  // 更新商品数量
  const updateCartItem = async (productId, quantity) => {
    try {
      await api.put(`/cart/${productId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error("更新购物车失败", error);
    }
  };

  // 删除商品
  const removeCartItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (error) {
      console.error("删除购物车商品失败", error);
    }
  };

  // 组件挂载时自动加载购物车
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
        addToCart,
        updateCartItem,
        removeCartItem,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
