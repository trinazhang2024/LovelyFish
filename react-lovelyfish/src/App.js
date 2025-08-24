import React, {useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import api from './API/axios'
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLogin from './pages/Admin/Login/LoginAdminPage'
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminForgotPassword from './pages/Admin/ForgotPassword/AdminForgotPassword'
import AdminResetPassword from "./pages/Admin/ResetPassword/AdminResetPassword";
import AdminChangePassword from "./pages/Admin/ChangePassword/AdminChangePassword";
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ResetPasswordPage from "./pages/ResetPassword/ResetPasswordPage";
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import Profile from './pages/Profile/Profile';
import Footer from './components/Footer/Footer';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductList from "./components/ProductList/ProductList";
import NewArrivals from './pages/NewArrivals/NewArrivals';
import Clearance from './pages/Clearance/Clearance';
import ProductDetail from './pages/ProductDetail/ProductDetail'; 
import ProductCategoryPage from './pages/ProductCategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import { CartProvider } from './contexts/CartContext';
import CartPage from './pages/Cart/CartPage/CartPage';
import ConfirmOrderPage from "./pages/Cart/ConfirmOrder/ConfirmOrderPage";
import OrdersPage from './pages/Cart/OrdersPage/OrdersPage';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/global.css';

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 刷新页面时检查后端 Cookie
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("/admin/me"); // 返回当前管理员信息
        if (res.status === 200) {
          setIsAdminLoggedIn(true);
          localStorage.setItem("isAdminLoggedIn", "true");}
      } catch {
        setIsAdminLoggedIn(false);
        //localStorage.removeItem("isAdminLoggedIn");
      }
    };
    checkAdmin();
  }, []);

  return (
    <UserProvider> 
      <CartProvider>
          <Router>
            <div className="App">
              <Navbar/>
              <Routes>
                  <Route path="/" element={<Home />} />
                  
                  {/* customers routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/profile" element={<Profile />} />               
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
                <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                <Route path="/admin/change-password" element={<AdminChangePassword />} />

                {/* 受保护后台页面 */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute isAdminLoggedIn={isAdminLoggedIn}>
                      <Dashboard />
                    </ProtectedAdminRoute>
                  }
                />

                {/* 在路由配置中添加 */}
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/product/:id" element={<ProductDetail/>} />
                <Route path="/products" element={<Products/>} />
                <Route path="/new-arrivals" element={<NewArrivals/>} />
                <Route path="/clearance" element={<Clearance />} />             
                {/* 分类页面 */}
                <Route path="/products/:category" element={<ProductCategoryPage />} />             
                <Route path="/cart" element={<CartPage />} />
                <Route path="/confirm-order" element={<ConfirmOrderPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                
                {/* Recommended */}
                <Route path="/products/:category" element={<ProductList />} />

                <Route path="/about" element={<About/>} />
                <Route path="/contact" element={<Contact/>} />
                
              </Routes>
              <Footer/>
            </div>
          </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;