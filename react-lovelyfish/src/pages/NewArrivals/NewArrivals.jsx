// src/pages/NewArrivals/NewArrivals.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../API/axios';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import '../../components/AddToCartButton/AddToCartButton.css';
import './NewArrivals.css';

function NewArrivals() {
  // State for product list, pagination, loading, and errors
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(1); // total pages from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart(); // cart context


  // Fetch first page of new arrival products
  // -----------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/product?page=1&pageSize=8&isNewArrival=true');

        // Ensure we have a mainImageUrl to display
        const newProducts = res.data.items.map(p => ({
          ...p,
          mainImageUrl: p.mainImageUrl || (p.imageUrls && p.imageUrls[0]) || ''
        }));

        setProducts(newProducts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Failed to load new products:', err);
        setError('Error loading new product data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // Load more products (pagination)
  // -----------------------------
  const loadMore = async () => {
    if (page >= totalPages) return; // no more pages
    const nextPage = page + 1;

    try {
      const res = await api.get(`/product?page=${nextPage}&pageSize=8&isNewArrival=true`);
      const newProducts = res.data.items.map(p => ({
        ...p,
        mainImageUrl: p.mainImageUrl || (p.imageUrls && p.imageUrls[0]) || ''
      }));
      setProducts(prev => [...prev, ...newProducts]); // append to existing products
      setPage(nextPage);
    } catch (err) {
      console.error('Load more failed', err);
    }
  };


  // Loading / Error States
  // -----------------------------
  if (loading) return <div className="na-loading">Loading new products...</div>;
  if (error) return <div className="na-error">{error}</div>;

  return (
    <div className="newarrivals-section">
      {/* Section header */}
      <div className="newarrivals-header">
        <h2>New Arrivals</h2>
      </div>

      {/* Show message if no products */}
      {products.length === 0 ? (
        <div className="na-empty">No new arrivals at the moment.</div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="newarrivals-grid">
            {products.map(product => {
              // Calculate discounted price if applicable
              const discountedPrice = product.discountPercent
                ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
                : product.price.toFixed(2);

              return (
                <div key={product.id} className="newarrivals-card">
                  {/* Badge: Sale or New */}
                  {product.isClearance && product.discountPercent > 0 ? (
                    <div className="na-badge na-sale">{product.discountPercent}% OFF</div>
                  ) : (
                    <div className="na-badge na-new">NEW</div>
                  )}

                  {/* Product Image with link */}
                  <Link to={`/product/${product.id}`} className="na-link">
                    <img src={product.mainImageUrl} alt={product.title} className="na-img" />
                  </Link>

                  {/* Card Body */}
                  <div className="na-body">
                    <div className="na-title">{product.title}</div>

                    {/* Price display: old price and new price if clearance, otherwise regular price */}
                    {product.isClearance && product.discountPercent > 0 ? (
                      <>
                        <div className="na-oldprice">${product.price.toFixed(2)}</div>
                        <div className="na-newprice">${discountedPrice}</div>
                      </>
                    ) : (
                      <div className="na-price">${product.price.toFixed(2)}</div>
                    )}

                    {/* Actions: Shop Now + Add to Cart */}
                    <div className="na-actions">
                      <Link to={`/product/${product.id}`} className="buy-button">Shop Now</Link>

                      {/* Reusable AddToCartButton component */}
                      <AddToCartButton
                        productId={product.id}
                        productTitle={product.title}
                        addToCart={addToCart}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {page < totalPages && (
            <div className="na-loadmore">
              <button className="na-btn na-load" onClick={loadMore}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NewArrivals;
