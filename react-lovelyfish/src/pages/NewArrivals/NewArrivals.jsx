// src/pages/NewArrivals/NewArrivals.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../API/axios';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import '../../components/AddToCartButton/AddToCartButton.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsArrowRight, BsBoxSeam } from 'react-icons/bs';
import './NewArrivals.css';

function NewArrivals() {
  // State for product list, pagination, loading, and errors
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(1); // total pages from backend
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // Load more state
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
      setLoadingMore(true);
    } catch (err) {
      console.error('Load more failed', err);
      setLoadingMore(false);
    }
  };


  // Loading / Error States
  // -----------------------------
  if (loading) return <div className="na-loading">Loading new products...</div>;
  if (error) return <div className="na-error">{error}</div>;

  return (
    <Container className="newarrivals-section mb-4">
      {/* Section header */}
      <div className="newarrivals-header mb-3">
        <h2><BsBoxSeam className="me-2" /> New Arrivals</h2>
      </div>

      
        <Row className="justify-content-center">
          {products.map(product => {
            const discountedPrice = product.discountPercent
              ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
              : product.price.toFixed(2);

            return ( //bootstrap 
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="na-card h-100">
                  <Link to={`/product/${product.id}`}>
                    <Card.Img
                      variant="top"
                      src={product.mainImageUrl}
                      className="na-img"
                    />
                  </Link>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="na-title text-truncate">{product.title}</Card.Title>
                    {product.discountPercent ? (
                      <>
                        <div className="na-oldprice">${product.price.toFixed(2)}</div>
                        <div className="na-newprice">${discountedPrice}</div>
                      </>
                    ) : (
                      <div className="na-price">${product.price.toFixed(2)}</div>
                    )}
                    <div className="na-actions mt-auto d-flex gap-2">
                      <Link to={`/product/${product.id}`} className="buy-button btn btn-outline-primary">
                        Shop Now
                      </Link>
                      <AddToCartButton
                        productId={product.id}
                        productTitle={product.title}
                        addToCart={addToCart}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {page < totalPages && (
          <div className="na-loadmore text-center my-3">
            {/* <button className="na-btn na-load" onClick={loadMore}>
              Load More <BsArrowRight className="ms-1" />
            </button> */}

            <Button variant="outline-primary" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More'} <BsArrowRight className="ms-1" />
              </Button>

          </div>
        )}
      </Container>

  );
}

export default NewArrivals;