import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // 引入 ProductCard 的样式

//ProductCard.jsx 只负责渲染单个产品卡片，不直接引入 productsByCategory。

const ProductCard = ({ product }) => {
  // 在 ProductCard 里，你应该确保 product 不是 undefined
  if (!product) return <div>Product not found</div>; 
  
  return (   
    <div className="col-lg-3 col-md-6">
      <div className="card">
        <img src={product.image} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p><strong>Price:</strong> <span>${product.price}</span></p>
          <Link to={`/product/${product.id}`} className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;