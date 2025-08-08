import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { BsArrowRight, BsTagFill } from 'react-icons/bs';
import axios from 'axios';
import './Clearance.css'; // 你可以自己创建一个对应的 CSS 文件

function Clearance() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dispatch } = useCart();

  useEffect(() => {
    axios.get('https://localhost:7148/api/Product')
      .then(response => {
        console.log('products:', response.data);
        const allProducts = response.data;

        // 你需要定义哪些商品是清仓，比如 price 打折，或者设一个字段 isClearance: true
        const clearanceProducts = allProducts.filter(p => p.isClearance); // ✅ 后端数据里要有 isClearance 字段

        setProducts(clearanceProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load clearance products:', err);
        setError('Error loading clearance product data.');
        setLoading(false);
      });
  }, []);

  const loadMore = () => setVisibleCount(prev => prev + 4);

  const addToCart = (product) => {
    dispatch({
      type: 'ADD_ITEM',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
    alert(`${product.name} Added to Cart`);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading clearance products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 clearance-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">
          <BsTagFill className="text-danger me-2" />
          Clearance Sale
        </h2>
      </div>

      {products.length === 0 ? (
        <Alert variant="info">No clearance items available right now.</Alert>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products.slice(0, visibleCount).map(product => (
              <Col key={product.id}>
                <Card className="h-100 d-flex flex-column position-relative">
                  {product.discountPercent > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      {product.discountPercent}% OFF
                    </Badge>
                  )}
                  {/*如果折扣大于0，就显示一个红色的折扣标签，比如“30% OFF”。*/}

                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                          <Card.Img
                            variant="top"
                            src={product.image}
                            style={{ height: '250px', objectFit: 'cover' ,marginTop: '20px'}}
                          />
                    </Link>
                    <Card.Body className="text-center flex-grow-1 d-flex flex-column" >
                      <div>
                        <Card.Title className="h6" mt-2>{product.name}</Card.Title>

                        {product.discountPercent > 0 ? (
                          <>
                            <Card.Text className="text-muted text-decoration-line-through mt-1">
                              ${product.price.toFixed(2)}
                            </Card.Text>
                            <Card.Text className="text-danger fw-bold mt-2">
                              ${(product.price * (1 - product.discountPercent / 100)).toFixed(2)}
                            </Card.Text>
                          </>
                        ) : (
                          <Card.Text className="text-danger fw-bold mt-2">
                            ${product.price.toFixed(2)}
                          </Card.Text>
                        )}
                      
                  
                        <Button
                          variant="outline-primary"
                          className="w-100 mt-auto"
                          style={{ cursor: 'pointer' }}
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {visibleCount < products.length && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={loadMore}
                className="px-4"
              >
                Loading more <BsArrowRight className="ms-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default Clearance;
