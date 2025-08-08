import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  console.log("产品 ID 是：", id); 
  const { dispatch } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7148/api/Product/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载产品详情失败:', err);
        setError('无法加载产品详情');
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    dispatch({ 
      type: 'ADD_ITEM', 
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
    alert(`${product.name} 已添加到购物车`);
  };

  if (loading) return <p>正在加载产品详情...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>未找到该产品</p>;

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <Link to="/">Home</Link> › <Link to="/products">Products</Link> ›{' '}
        <span>{product.name}</span>
      </div>

      <div className="product-container">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        <div className="product-info-container">
          <h1 className="product-title">{product.name}</h1>
          
          {/* Price */}
          <p className="product-price">{product.discountPercent > 0 ? (
            <>
              <span className="text-muted text-decoration-line-through" style={{ marginRight: 8 }}>
                ${product.price.toFixed(2)}
              </span>
              <span className="text-danger fw-bold">
                ${(product.price * (1 - product.discountPercent / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-danger fw-bold">${product.price.toFixed(2)}</span>
          )}</p>

          <button className="buy-button" onClick={addToCart}>Add to Cart</button>
          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description}</p>
            <ul className="features-list">
              {Array.isArray(product.features)
                ? product.features.map((feature, index) => <li key={index}>{feature}</li>)
                : <li>{product.features}</li>}
            </ul>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ProductDetail;
