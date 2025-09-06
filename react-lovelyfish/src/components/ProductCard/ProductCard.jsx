import React from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import './ProductCard.css';
import '../AddToCartButton/AddToCartButton.css';

/**
 * ProductCard component
 * @param {Object} product - Product data
 * @param {Function} addToCart - Function from parent to add product to cart
 */
const ProductCard = ({ product, addToCart }) => {
  // If no product, show fallback
  if (!product) return <div>Product not found</div>;

  // Use main image, fallback to first image or placeholder
  const mainImage = product.mainImageUrl || (product.images && product.images[0]?.url) || 'placeholder.png';

  // Calculate discounted price if discountPercent exists
  const discountedPrice = product.discountPercent
    ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div className="product-card">

      {/* Badges: discount or new arrival */}
      {product.discountPercent > 0 ? (
        <div className="product-card-badge discount">{product.discountPercent}% OFF</div>
      ) : product.isNewArrival ? (
        <div className="product-card-badge new">NEW</div>
      ) : null}

      {/* Product image */}
      <div className="product-card-image">
        <img src={mainImage} alt={product.title} />
      </div>

      {/* Product details */}
      <div className="product-card-body">
        <h5 className="product-card-title">{product.title}</h5>
        {product.category && <p className="product-card-category">{product.category.title}</p>}
        <p className="product-card-price">
          {product.discountPercent > 0 ? (
            <>
              <span className="original-price">${product.price.toFixed(2)}</span>
              <span className="discount-price">${discountedPrice}</span>
            </>
          ) : (
            <span className="discount-price">${discountedPrice}</span>
          )}
        </p>

        {/* Actions: Shop Now + Add to Cart */}
        <div className="product-card-actions">
          {/* Link to product detail page */}
          <Link to={`/product/${product.id}`} className="buy-button">Shop Now</Link>

          {/* Unified AddToCartButton */}
          <AddToCartButton 
            productId={product.id} 
            productTitle={product.title} 
            addToCart={addToCart}   // Use parent-provided function
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
