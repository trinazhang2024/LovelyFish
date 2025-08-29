import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../API/axios';
import './ProductDetail.css';

const IMAGE_BASE_URL = "https://localhost:7148/uploads/";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api.get(`/Product/${id}`)
      .then(res => {
        const data = res.data;
        // 拼接完整 URL
        const imagesWithUrl = data.imageUrls?.map(fileName => ({
          fileName,
          url: IMAGE_BASE_URL + fileName
        })) || [];
        setProduct({ ...data, images: imagesWithUrl });
        setSelectedImage(imagesWithUrl[0]?.url || '/upload/placeholder.png'); // 占位图
        setLoading(false);
      })
      .catch(err => {
        console.error('加载产品详情失败:', err);
        setError('无法加载产品详情');
        setLoading(false);
      });
  }, [id]);

  const addToCartHandler = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      alert(`${product.title} 已添加到购物车`);
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
        <span>{product.title}</span>
      </div>

      <div className="product-container">
        <div className="product-image-container">
          {selectedImage && <img src={selectedImage} alt={product.title} className="product-image" />}
          <div className="thumbnail-list">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`thumb-${idx}`}
                className={`thumbnail ${selectedImage === img.url ? 'selected' : ''}`}
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        <div className="product-info-container">
          <h1 className="product-title">{product.title}</h1>

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

          <p>Category: {product.category?.name || 'Uncategorized'}</p>

          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description}</p>
            {Array.isArray(product.features) && product.features.length > 0 && (
              <ul className="features-list">
                {product.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
