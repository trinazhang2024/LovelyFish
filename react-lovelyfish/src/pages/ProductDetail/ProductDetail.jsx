import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../API/axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    //用统一的 api 请求实例，方便管理请求拦截和错误处理
    api.get(`/Product/${id}`)
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
  
  //购物车调用改为直接用 addToCart(productId, qty)，跟你的 CartContext 设计对接, 添加了按钮 loading 状态，防止多次点“Add to Cart”
  const addToCartHandler = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      alert(`${product.name} 已添加到购物车`);
    } catch (err) {
      alert('添加购物车失败，请稍后重试');
    } finally {
      setAdding(false);
    }
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

          <p className="product-price">
            {product.discountPercent > 0 ? (
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
            )}
          </p>

          <button
            className="buy-button"
            onClick={addToCartHandler}
            disabled={adding}
          >
            {adding ? "添加中..." : "Add to Cart"}
          </button>

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
