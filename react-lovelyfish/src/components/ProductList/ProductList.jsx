import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
//import {useCart} from '../../contexts/CartContext'
import './ProductList.css';



//使用父组件传来的 addToCart 方法和 addingIds，而不是自己调用 useCart()，统一管理购物车状态。
const ProductList = ({ products, limit, addToCart, addingIds }) => {
  console.log("ProductList received products:", products);

  //const { addToCart, addingIds } = useCart(); // ✅ 取出购物车方法

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
            addToCart={addToCart}   // 使用父组件传来的方法
            addingIds={addingIds}   // 传递当前正在添加的产品ID数组
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
