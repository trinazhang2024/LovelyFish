import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail'; // 引入动态路由组件
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

import "bootstrap/dist/css/bootstrap.min.css";
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;