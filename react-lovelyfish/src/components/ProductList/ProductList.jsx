import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { useCart } from '../../contexts/CartContext';
import './ProductList.css';

const ProductList = ({ products, limit }) => {
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return <p>没有产品可显示</p>;
  }

  // 如果需要限制数量（比如首页显示前 4 个）
  const displayProducts = limit ? products.slice(0, 4) : products;

  return (
    <div className="products-list-container">
      <div className="products-list-title">
        <h3>All Products</h3>
        {limit && <a href="/products">查看全部</a>}
      </div>
      <div className="products-grid">
        {displayProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={() => addToCart(product.id, 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
