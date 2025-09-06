import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
// import { useCart } from '../../contexts/CartContext'  // Not needed here
import './ProductList.css';

/**
 * ProductList component
 * @param {Array} products - Array of product objects to display
 * @param {Boolean} limit - If true, only show first 4 products
 * @param {Function} addToCart - Function passed from parent to handle adding to cart
 * @param {Array} addingIds - Array of product IDs currently being added (for loading state)
 */
const ProductList = ({ products, limit, addToCart, addingIds }) => {
  console.log("ProductList received products:", products);

  // Using addToCart from parent to unify cart state management
  // const { addToCart, addingIds } = useCart(); // Not needed here

  // Handle case with no products
  if (!products || products.length === 0) {
    return <p>No products available</p>;
  }

  // Slice products if limit is set (e.g., show first 4 on homepage)
  const displayProducts = limit ? products.slice(0, 4) : products;

  return (
    <div className="products-list-container">
      {/* Section title and optional "View All" link */}
      <div className="products-list-title">
        <h3>All Products</h3>
        {limit && <a href="/products">View All</a>}
      </div>

      {/* Grid of ProductCards */}
      <div className="products-grid">
        {displayProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}   // Use parent-provided addToCart
            addingIds={addingIds}   // Pass current addingIds for loading indication
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
