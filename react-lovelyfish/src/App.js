import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from './components/ProtectedRoute';
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
import CartPage from './pages/Cart/CartPage/CartPage'
import CheckoutPage from './pages/Cart/Checkout'
import PaymentConfirmation from './pages/Cart/PaymentConfirmation'
import OrderConfirmation from './pages/Cart/OrderConfirmation'
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/global.css';

const App = () => {
  return (
    <UserProvider> 
      <CartProvider>
          <Router>
            <div className="App">
              <Navbar/>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* user login & register */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* 在路由配置中添加 */}
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/product/:id" element={<ProductDetail/>} />
                <Route path="/products" element={<Products/>} />
                <Route path="/new-arrivals" element={<NewArrivals/>} />
                <Route path="/clearance" element={<Clearance />} />             
                {/* 分类页面 */}
                <Route path="/products/:category" element={<ProductCategoryPage />} />             
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
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