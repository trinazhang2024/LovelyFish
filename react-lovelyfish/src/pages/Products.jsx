import React from 'react';
import ProductList from '../components/ProductList/ProductList';
import productsByCategory from '../data/data'; // 引入产品数据

const Products = () => {
  return (
    <div className="container">
      <h1>All the Products</h1>
      <ProductList products={productsByCategory} /> {/* 传递产品数据 */}
    </div>
  );
};

export default Products;