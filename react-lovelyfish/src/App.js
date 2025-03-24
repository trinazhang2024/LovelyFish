import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail'; // 引入动态路由组件
import ProductCategoryPage from './pages/ProductCategoryPage';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
//import Pumps from './pages/Pumps'; // 潜水泵页面
//import Heaters from './pages/Heaters'; // 加热棒页面
//import Filters from './pages/Filters'; // 过滤器页面

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
          <Route
            path="/products/filters"
            element={
              (() => {
                console.log(12);
                return <ProductCategoryPage category="过滤器" sortOptions={['price', 'wattage', 'output']} />;
              })()
            }
          />
          <Route
            path="/products/pumps"
            element={
              <ProductCategoryPage
                category="潜水泵"
                sortOptions={['price', 'wattage', 'output']}
              />
            }
          />
          <Route
            path="/products/heaters"
            element={
              <ProductCategoryPage
                category="加热器"
                sortOptions={['price', 'wattage']}
              />
            }
          />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;