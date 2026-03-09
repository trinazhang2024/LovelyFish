import React from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import './ProductCard.css';
import '../AddToCartButton/AddToCartButton.css';

/**
 * ProductCard component
 * Includes SEO and accessibility improvement.
 * @param {Object} product - Product data
 * @param {Function} addToCart - Function from parent to add product to cart
 */
const ProductCard = ({ product, addToCart }) => {
  // Fallback if no product data.
  if (!product) return <div>Product not found</div>;

  // Use main image if defined, fallback to first image or placeholder
  const mainImage = 
      product.mainImageUrl || (product.images && product.images[0]?.url) || 'placeholder.png';

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

       {/* Product Image with SEO-friendly alt text and lazy loading */}
      <div className="product-card-image">
        <img 
          src={mainImage} 
          alt={`${product.title} aquarium equipment`} //SEO-friendly alt
          loading='lazy' //Lazy loading improves page performance
        />
      </div>

      {/* Product details */}
      <div className="product-card-body">

        {/* Product title */}
        <h5 className="product-card-title">{product.title}</h5>
        
        {/* Category display with SEO keywords */}
        {product.category && (
          <p className="product-card-category">
            {product.category.title} aquarium equipment
          </p>
        )}
        
        {/* Price with schema markup for SEO */}
        <p 
          className="product-card-price" 
          itemProp="offers" 
          itemScope 
          itemType="http://schema.org/Offer"
        >
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

          <Link
            to={`/product/${product.id}`}
            className="buy-button"
            aria-label={`View details for ${product.title}`} // Accessibility improvement
          >
            Shop Now
          </Link>

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
