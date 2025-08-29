import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

//把 ProductCard 改造成 统一使用 addingIds 状态和外部传入的 addToCart 方法，而不是自己内部再调 addToCart(product.id, 1)，并且按钮能显示“添加中...”。
const ProductCard = ({ product, addToCart, addingIds }) => {
  if (!product) return <div>Product not found</div>;

  // const handleAddToCart = async () => {
  //   try {
  //     await addToCart(product.id, 1);
  //     alert(`${product.title} 已添加到购物车`);
  //   } catch (err) {
  //     alert('添加购物车失败，请稍后重试');
  //   }
  // };

  // ✅ 使用占位图，如果数据库没有主图
  const mainImage = product.mainImageUrl || (product.images && product.images[0]?.url) || '/upload/placeholder.png';

  // ✅ 判断当前产品是否正在添加到购物车
  const isAdding = addingIds?.includes(product.id);

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

          <Link to={`/product/${product.id}`} className="btn btn-primary">Shop Now</Link>

          <button 
             className="btn btn-success" 
             onClick={()=> addToCart(product)}
             disable={isAdding}
             >
              Add to Cart
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
