
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import api from '../../API/axios';
import { Helmet } from 'react-helmet'; //Added for SEO
import './ProductDetail.css';

// Helper function: generate SEO keywords from product title
// Below function is new added
const generateKeywords = (title) => {
  if (!title) return "";
  const words = title.split(/[\s,]+/); // Split by sppace or comma
  const filtered = words.filter(w => w.length > 2); // Filter out too short words
  const unique = Array.from(new Set(filtered)); // Remove duplicates
  const extraKeywords = ["filter", "heater", "water pump", "air pump", "sponge", "filtration", "LED light"];
  return [...unique, ...extraKeywords].join(", ");
};

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const { addToCart } = useCart(); // Cart context

  // Local state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Currently displayed main image

  // Fetch product details when component mounts or `id` changes
  useEffect(() => {
    api.get(`/Product/${id}`)
      .then(res => {
        const data = res.data;

        // Map image file names to full URLs
        const imagesWithUrl = data.imageUrls?.map(url => ({ url })) || [];

        setProduct({ ...data, images: imagesWithUrl });

        // Set first image as the selected main image
        setSelectedImage(imagesWithUrl.length > 0 ? imagesWithUrl[0].url : 'placeholder.png');
        setLoading(false);

        console.log('Loaded product:', data);

      })
      .catch(err => {
        console.error('Failed to load product details:', err);
        setError('Unable to load product details');
        setLoading(false);
      });
  }, [id]);

  // Loading and error states
  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <>
      {/* SEO Section */}
      {/* Added Helmet for title, description, keywords. */}
      <Helmet>
        <title>{product.title} | Lovely Fish Aquarium</title>
        <meta
          name="description"
          content={
            product.description
              ? product.description.substring(0, 150)
              : "High quality aquarium products."
          } />
        <meta
          name="keywords"
          content={generateKeywords(product.title)} />
      </Helmet>

      <div className="product-detail">
        {/* Breadcrumb navigation */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> › <Link to="/products">Products</Link> ›{' '}
          <span>{product.title}</span>
        </div>

        <div className="product-container">
          {/* Left: Main Image */}
          <div className="product-image-container">
            {selectedImage && (
              <img
                key={selectedImage} // Force re-render to trigger animation when switching images
                src={selectedImage}
                alt={`${product.title} aquarium equipment`}
                className="product-image fade-in"
                loading='lazy' //Product Image SEO + Lazy Load
              />
            )}

            {/* Thumbnail images */}
            <div className="thumbnail-list">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  //alt={`thumb-${idx}`}
                  alt={`${product.title} image $ {idx+1}`} //Product Image SEO + Lazy Load
                  loading='lazy'
                  className={`thumbnail ${selectedImage === img.url ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(img.url)} // Change main image on click
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info-container">
            {/* Name */}
            <div className="product-field">
              <span className="field-label">Name:</span>
              <span className="field-value">{product.title}</span>
            </div>

            {/* Price & Discount */}
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

            {/* Category */}
            <div className="product-field">
              <span className="field-label">Category:</span>
              <span className="field-value">{product.categoryTitle || 'Uncategorized'}</span>
            </div>

            {/* Add to Cart button (reusable component) */}
            <AddToCartButton
              productId={product.id}
              productTitle={product.title}
              addToCart={addToCart}
            />

            {/* Product Description */}
            <div className="product-description">
              <h2>Description</h2>
              <p>{product.description}</p>
              {Array.isArray(product.features) && product.features.length > 0 && (
                <>
                  <h3>Features:</h3>
                  <ul className="features-list">
                    {product.features.map((feature, index) => <li key={index}>{feature}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
