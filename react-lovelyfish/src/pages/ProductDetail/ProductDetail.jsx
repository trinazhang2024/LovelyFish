import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import api from '../../API/axios';
import './ProductDetail.css';

const IMAGE_BASE_URL = "https://localhost:7148/uploads/";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api.get(`/Product/${id}`)
      .then(res => {
        const data = res.data;
        const imagesWithUrl = data.imageUrls?.map(fileName => ({
          fileName,
          url: IMAGE_BASE_URL + fileName
        })) || [];

        setProduct({ ...data, images: imagesWithUrl });
        setSelectedImage(imagesWithUrl.length > 0 ? imagesWithUrl[0].url : 'placeholder.png');
        setLoading(false);
      })
      .catch(err => {
        console.error('加载产品详情失败:', err);
        setError('无法加载产品详情');
        setLoading(false);
      });
  }, [id]);

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
        {/* 左侧图片区域 */}
        <div className="product-image-container">
          {selectedImage && (
            <img 
            key={selectedImage}  // 加 key，每次切换都会重新渲染，触发动画   
            src={selectedImage} 
            alt={product.title} 
            className="product-image fade-in" />
          )}

          {/* 缩略图列表 */}
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

        {/* 右侧信息区域 */}
        <div className="product-info-container">
          <div className="product-field">
            <span className="field-label">Name:</span>
            <span className="field-value">{product.title}</span>
          </div>

          <div className="product-field">
            <span className="field-label">Price:</span>
            {product.discountPercent > 0 ? (
              <>
                <span className="price-original field-value">${product.price.toFixed(2)}</span>
                <span className="price-discount field-value">
                  ${(product.price * (1 - product.discountPercent / 100)).toFixed(2)}
                </span>
                <span className="discount-label">-{product.discountPercent}%</span>
              </>
            ) : (
              <span className="price-normal field-value">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="product-field">
            <span className="field-label">Category:</span>
            <span className="field-value">{product.category?.name || 'Uncategorized'}</span>
          </div>

          {/* 封装后的购物车按钮 */}
          <AddToCartButton
            productId={product.id}
            productTitle={product.title}
            addToCart={addToCart}
          />

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
