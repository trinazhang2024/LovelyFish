import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UserLoginRedirect from './components/UserLoginRedirect';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Layout from "./components/Layout/Layout";

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

// Other front-end pages
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail'; 
import ProductCategoryPage from './pages/ProductCategoryPage';
import SearchResultsPage from './pages/Search/SearchResultsPage';
import CartPage from './pages/Cart/CartPage/CartPage';
import ConfirmOrderPage from "./pages/Cart/ConfirmOrder/ConfirmOrderPage";
import OrdersPage from './pages/Cart/OrdersPage/OrdersPage';
import NewArrivals from './pages/NewArrivals/NewArrivals';
import Clearance from './pages/Clearance/Clearance';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import FishOwnersPage from './pages/FishOwners/FishOwnersPage/FishOwnersPage'
import EquipmentTips from './pages/Aquarium Guide/EquipmentTips/EquipmentTips'
import FishCareFAQ from './pages/Aquarium Guide/EquipmentTips/EquipmentTips'
import AquariumGuide from './pages/Aquarium Guide/AquariumGuide'


 // AppRoutes defines all frontend routes for the application.
 // It uses ProtectedRoute and ProtectedAdminRoute to restrict access.
 
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected customer routes */}
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

      {/* Protected admin routes */}
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

      {/* Products & search pages */}
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/products/:category" element={<ProductCategoryPage />} />
      <Route path="/search" element={<SearchResultsPage />} />

      {/* Cart & orders */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/confirm-order" element={<ConfirmOrderPage />} />
      <Route path="/orders" element={<OrdersPage />} />

      {/* Other pages */}
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/clearance" element={<Clearance />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/fish-community" element={<FishOwnersPage />} />
      <Route path="/equipment-tips" element={<EquipmentTips />} />
      <Route path="/fish-care-faq" element={<FishCareFAQ />} />
      <Route path="/aquarium-guide" element={<AquariumGuide />} />

      {/* Redirect unmatched routes to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

/**
 * Main App component wraps the application with context providers
 * and renders Navbar, Routes, and Footer.
 */
const App = () => {
  return (
    <ToastProvider> {/* Global toast notifications */}
      <UserProvider> {/* User authentication and info */}
        <CartProvider> {/* Shopping cart context */}
          <Router>
            <Layout>
              <Navbar /> {/* Top navigation bar */}
              <AppRoutes /> {/* Application routes */}
              <Footer /> {/* Footer component */}
            </Layout>
          </Router>
        </CartProvider>
      </UserProvider>
    </ToastProvider>
  );
};

export default App;
