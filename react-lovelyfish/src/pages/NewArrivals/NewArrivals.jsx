// src/pages/NewArrivals/NewArrivals.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../API/axios';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import '../../components/AddToCartButton/AddToCartButton.css'
import './NewArrivals.css';

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  //const [addingIds, setAddingIds] = useState([]);
  //const [cartAlert, setCartAlert] = useState(null);

  // ✅ 获取第一页产品
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/product?page=1&pageSize=8&isNewArrival=true');
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

  // ✅ Load More
  const loadMore = async () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;

    try {
      const res = await api.get(`/product?page=${nextPage}&pageSize=8&isNewArrival=true`);
      const newProducts = res.data.items.map(p => ({
        ...p,
        mainImageUrl: p.mainImageUrl || (p.imageUrls && p.imageUrls[0]) || ''
      }));
      setProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
    } catch (err) {
      console.error('Load more failed', err);
    }
  };


  if (loading) return <div className="na-loading">Loading new products...</div>;
  if (error) return <div className="na-error">{error}</div>;

  return (
    <div className="newarrivals-section">
      <div className="newarrivals-header">
        <h2>New Arrivals</h2>
      </div>

      {products.length === 0 ? (
        <div className="na-empty">No new arrivals at the moment.</div>
      ) : (
        <>
          <div className="newarrivals-grid">
            {products.map(product => {
              const discountedPrice = product.discountPercent
                ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
                : product.price.toFixed(2);

              return (
                <div key={product.id} className="newarrivals-card">
                  {product.isClearance && product.discountPercent > 0 ? (
                    <div className="na-badge na-sale">{product.discountPercent}% OFF</div>
                  ) : (
                    <div className="na-badge na-new">NEW</div>
                  )}

                  <Link to={`/product/${product.id}`} className="na-link">
                    <img src={product.mainImageUrl} alt={product.title} className="na-img" />
                  </Link>

                  <div className="na-body">
                    <div className="na-title">{product.title}</div>

                    {product.isClearance && product.discountPercent > 0 ? (
                      <>
                        <div className="na-oldprice">${product.price.toFixed(2)}</div>
                        <div className="na-newprice">${discountedPrice}</div>
                      </>
                    ) : (
                      <div className="na-price">${product.price.toFixed(2)}</div>
                    )}

                    <div className="na-actions">
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
            })}
          </div>

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
