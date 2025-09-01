import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { BsArrowRight, BsTagFill } from 'react-icons/bs';
import api from '../../API/axios';
import './Clearance.css';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import '../../components/AddToCartButton/AddToCartButton.css'

function Clearance() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const pageSize = 8;

  // ✅ 初次加载第一页
  useEffect(() => {
    const fetchFirstPage = async () => {
      try {
        const res = await api.get('/product', {
          params: { page: 1, pageSize, isClearance: true }
        });
        setProducts(res.data.items);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Failed to load clearance products:', err);
        setError('Error loading clearance product data.');
      } finally {
        setLoading(false);
      }
    };
    fetchFirstPage();
  }, []);

  // ✅ Load More
  const handleLoadMore = async () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await api.get('/product', {
        params: { page: nextPage, pageSize, isClearance: true }
      });
      setProducts(prev => [...prev, ...res.data.items]);
      setPage(nextPage);
    } catch (err) {
      console.error('Load more failed', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading)
    return (
      <Container className="clearance-loading">
        <Spinner animation="border" variant="primary" />
        <p>Loading clearance products...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="clearance-error">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="clearance-section">
      <div className="clearance-header">
        <h2><BsTagFill className="clearance-icon" /> Clearance Sale</h2>
      </div>

      {products.length === 0 ? (
        <Alert variant="info">No clearance items available right now.</Alert>
      ) : (
        <>
          <Row className="clearance-grid">
            {products.map(product => {
              const discountedPrice = product.discountPercent
                ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
                : product.price.toFixed(2);

              return (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="clearance-col">
                  <Card className="clearance-card">
                    {product.discountPercent > 0 && <Badge bg="danger" className="clearance-badge">{product.discountPercent}% OFF</Badge>}

                    <Link to={`/product/${product.id}`} className="clearance-link">
                      <Card.Img
                        variant="top"
                        src={product.mainImageUrl || (product.imageUrls && product.imageUrls[0]) || ''}
                        className="clearance-img"
                      />
                    </Link>

                    <Card.Body className="clearance-body">
                      <Card.Title className="clearance-title">{product.title}</Card.Title>

                      {product.discountPercent > 0 ? (
                        <>
                          <Card.Text className="clearance-oldprice">${product.price.toFixed(2)}</Card.Text>
                          <Card.Text className="clearance-newprice">${discountedPrice}</Card.Text>
                        </>
                      ) : (
                        <Card.Text className="clearance-newprice">${discountedPrice}</Card.Text>
                      )}

                      <div className="clearance-actions">

                        <Link to={`/product/${product.id}`} className="buy-button">Shop Now</Link>

                        {/* 使用封装好的 AddToCartButton */}
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
            <div className="clearance-loadmore text-center my-3">
              <Button variant="outline-primary" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More'} <BsArrowRight className="ms-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default Clearance;
