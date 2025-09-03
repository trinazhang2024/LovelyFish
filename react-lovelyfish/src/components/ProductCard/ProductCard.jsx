import React from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import './ProductCard.css';
import '../AddToCartButton/AddToCartButton.css'


//把 ProductCard 改造成 统一使用 addingIds 状态和外部传入的 addToCart 方法，而不是自己内部再调 addToCart(product.id, 1)，并且按钮能显示“添加中...”。
const ProductCard = ({ product, addToCart, addingIds }) => {
  //不需要在 ProductCard 里再直接调用 useCart()，只要父组件已经拿到 addToCart 并传给它 就可以了
  if (!product) return <div>Product not found</div>;

  // ✅ 使用占位图，如果数据库没有主图
  const mainImage = product.mainImageUrl || (product.images && product.images[0]?.url) || 'placeholder.png';

  // ✅ 判断当前产品是否正在添加到购物车
 // const isAdding = addingIds?.includes(product.id);

  const discountedPrice = product.discountPercent
    ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div className="product-card">

      {product.discountPercent > 0 ? (
        <div className="product-card-badge discount">{product.discountPercent}% OFF</div>
      ) : product.isNewArrival ? (
        <div className="product-card-badge new">NEW</div>
      ) : null}

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

          <Link to={`/product/${product.id}`} className="buy-button">Shop Now</Link>

           {/* 使用封装好的 AddToCartButton */}
           <AddToCartButton 
            productId={product.id} 
            productTitle={product.title} 
            addToCart={addToCart} 
          />
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
