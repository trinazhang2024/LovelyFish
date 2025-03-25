import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail'; // 引入动态路由组件
import ProductCategoryPage from './pages/ProductCategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import { CartProvider } from './contexts/CartContext';
import CartPage from './pages/Cart/CartPage'
import CheckoutPage from './pages/Cart/Checkout'
import PaymentConfirmation from './pages/Cart/PaymentConfirmation'
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';


import "bootstrap/dist/css/bootstrap.min.css";
import './styles/global.css';

const App = () => {
  return (
    <CartProvider> {/* 新增这层包裹 */}
        <Router>
          <div className="App">
            <Navbar/>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* 在路由配置中添加 */}
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/products/:id" element={<ProductDetail/>} />
              <Route path="/products" element={<Products/>} />
              {/* 支持价格+瓦数排序的分类 */}
              <Route
                path="/products/filters"
                element={<ProductCategoryPage category="过滤器" showWattageSort={true} />}
              />
              <Route
                path="/products/pumps"
                element={<ProductCategoryPage category="潜水泵" showWattageSort={true} />}
              />
              <Route
                path="/products/heaters"
                element={<ProductCategoryPage category="加热棒" showWattageSort={true} />}
              />

              {/* 其他分类（仅价格排序） */}
              <Route
                path="/products/fish-food"
                element={<ProductCategoryPage category="鱼粮" />}  // 不传showWattageSort
              />

              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-confirmation" element={<PaymentConfirmation />} />

              <Route path="/about" element={<About/>} />
              <Route path="/contact" element={<Contact/>} />
              
            </Routes>
            <Footer/>
          </div>
        </Router>
    </CartProvider>
  );
};

export default App;