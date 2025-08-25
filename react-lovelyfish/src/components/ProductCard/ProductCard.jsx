import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert(`${product.title} 已添加到购物车`);
    } catch (err) {
      alert('添加购物车失败，请稍后重试');
    }
  };

  // ✅ 使用占位图，如果数据库没有主图
  const mainImage = product.mainImageUrl || (product.images && product.images[0]?.url) || '/upload/placeholder.png';

  const discountedPrice = product.discountPercent
    ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div className="product-card">

      {product.discountPercent > 0 && (
        <div className="product-card-badge">
          {product.discountPercent}% OFF
        </div>
      )}

      <div className="product-card-image">
        <img src={mainImage} alt={product.title} />
      </div>

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

        <div className="product-card-actions">

          <Link to={`/product/${product.id}`} className="btn btn-primary">Shop Now</Link>

          <button className="btn btn-success" onClick={handleAddToCart}>Add to Cart</button>
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
