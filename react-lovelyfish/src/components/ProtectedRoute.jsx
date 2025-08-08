// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    // 如果没有登录，跳转到登录页
    return <Navigate to="/login" replace />;
  }

  // 如果已经登录，显示目标组件
  return children;
};

export default ProtectedRoute;
