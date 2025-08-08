// src/components/ProductList/ProductList.jsx
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const ProductList = ({ products, limit }) => {
  if (!products || products.length === 0) {
    return <p>没有产品可显示</p>;
  }

  console.log('products:', products);

  // 如果需要限制数量（比如首页显示前 4 个）
  const displayProducts = limit ? products.slice(0, 4) : products;

  console.log('displayProducts', displayProducts); //test displayProducts
  console.log("Product IDs:", displayProducts.map(p => p.id)); //check the key
  displayProducts.forEach((p, index) => {
    console.log(`Product at index ${index}:`, p);
  });

  return (
    <div className="product container">
      <div className="title">
        <h3>All Products</h3>
        {limit && <a href="/products">查看全部</a>}
      </div>
      <div className="row">
        
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
