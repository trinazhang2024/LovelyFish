import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  if (!product) return <div>Product not found</div>;

const handleAddToCart = async () => {
  try {
    await addToCart(product.id, 1);
    alert(`${product.name} 已添加到购物车`);
  } catch (err) {
    alert('添加购物车失败，请稍后重试');
  }
};

  return (
    <div className="col-lg-3 col-md-6">
      <div className="card">
        <img src={product.image} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p><strong>Price:</strong> <span>${product.price}</span></p>
          <div className="d-flex justify-content-between">
            <Link to={`/product/${product.id}`} className="btn btn-primary">
              Shop Now
            </Link>
            <button
              className="btn btn-success"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
// 关键点：

// 通过 props 传入 addToCart 函数。

// 在按钮 onClick 里调用 addToCart，默认加1个商品。

// 按钮用 btn btn-success 让它样式和“Shop Now”区分开。

// 你只需要确保父组件（比如 ProductList）给每个 ProductCard 传入了 addToCart 函数即可。