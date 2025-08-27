import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin } = useUser(); // ✅ 从上下文拿状态

  if (user === null) return <p>检查登录状态...</p>; // 状态未检查
  if (!isAdmin) return <Navigate to="/admin/login" />;   // 非管理员重定向
  return children; // 已登录且是管理员，显示内容
};

export default ProtectedAdminRoute;
