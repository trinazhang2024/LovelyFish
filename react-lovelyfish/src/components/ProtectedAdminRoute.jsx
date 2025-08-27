// components/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ isAdminLoggedIn, children }) => {
  if (isAdminLoggedIn === null) return <p>检查登录状态...</p>; // 状态未检查
  if (!isAdminLoggedIn) return <Navigate to="/admin/login" />; // 未登录重定向
  return children; // 已登录，显示内容
};

export default ProtectedAdminRoute;
