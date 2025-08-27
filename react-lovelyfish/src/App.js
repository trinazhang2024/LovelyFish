import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UserLoginRedirect from './components/UserLoginRedirect';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from "./pages/Home";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from "./pages/ResetPassword/ResetPasswordPage";
import Profile from './pages/Profile/Profile';

import AdminLogin from './pages/Admin/Login/LoginAdminPage';
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminForgotPassword from './pages/Admin/ForgotPassword/AdminForgotPassword';
import AdminResetPassword from "./pages/Admin/ResetPassword/AdminResetPassword";
import AdminChangePassword from "./pages/Admin/ChangePassword/AdminChangePassword";
import OrdersAdminPage from "./pages/Admin/OrdersAdmin/OrdersAdminPage";
import OrderDetailPage from "./pages/Admin/OrderDetail/OrderDetailPage";
import UsersAdminPage from './pages/Admin/UsersAdmin/UsersAdminPage';
import UsersOrdersPage from './pages/Admin/UsersAdmin/UsersOrders/UsersOrdersPage';

// 其他前端页面
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail'; 
import ProductCategoryPage from './pages/ProductCategoryPage';
import SearchResultsPage from './pages/Search/SearchResultsPage';
import CartPage from './pages/Cart/CartPage/CartPage';
import ConfirmOrderPage from "./pages/Cart/ConfirmOrder/ConfirmOrderPage";
import OrdersPage from './pages/Cart/OrdersPage/OrdersPage';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

const AppRoutes = () => {
  const { user } = useUser(); // 从 UserContext 获取当前用户

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Customer routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 受保护客户页面 */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/login" element={
        <UserLoginRedirect>
          <AdminLogin />
        </UserLoginRedirect>
      } />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route path="/admin/change-password" element={<AdminChangePassword />} />

      {/* 受保护后台页面 */}
      <Route path="/admin/dashboard" element={
        <ProtectedAdminRoute>
          <Dashboard />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedAdminRoute>
          <OrdersAdminPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/orders/:orderId" element={
        <ProtectedAdminRoute>
          <OrderDetailPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedAdminRoute>
          <UsersAdminPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/users/:userId/orders" element={
        <ProtectedAdminRoute>
          <UsersOrdersPage />
        </ProtectedAdminRoute>
      } />

      {/* 产品 & 搜索 */}
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/products/:category" element={<ProductCategoryPage />} />
      <Route path="/search" element={<SearchResultsPage />} />

      {/* 购物车 & 订单 */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/confirm-order" element={<ConfirmOrderPage />} />
      <Route path="/orders" element={<OrdersPage />} />

      {/* 其他页面 */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* 未匹配路由跳首页 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <AppRoutes />
          <Footer />
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
