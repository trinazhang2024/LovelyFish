import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { BsStarFill, BsArrowRight } from 'react-icons/bs';
import newProducts from '../../data/newProducts';
import './NewArrivals.css';

function NewArrivals() {
  const [visibleCount, setVisibleCount] = useState(4);
  const { dispatch } = useCart();

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
    alert(`${product.name} 已加入购物车`);
  };

  return (
    <Container className="my-5 new-arrivals-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">
          <BsStarFill className="text-warning me-2" />
          新到产品
        </h2>
      </div>

      {newProducts.length === 0 ? (
        <Alert variant="info">暂无新品上架，敬请期待！</Alert>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {newProducts.slice(0, visibleCount).map(product => (
              <Col key={product.id}>
                <Card className="h-100 position-relative">
                  {product.isNew && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      NEW
                    </Badge>
                  )}
                  
                  <Link to={`/products/${product.id}`} className="text-decoration-none">
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="h6">{product.name}</Card.Title>
                      <Card.Text className="text-danger fw-bold">
                        ¥{product.price}
                      </Card.Text>
                    </Card.Body>
                  </Link>
                  
                  <Card.Footer className="bg-white border-top-0">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="w-100"
                      onClick={() => addToCart(product)}
                    >
                      加入购物车
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {visibleCount < newProducts.length && (
            <div className="text-center mt-4">
              <Button 
                variant="outline-primary" 
                onClick={loadMore}
                className="px-4"
              >
                加载更多 <BsArrowRight className="ms-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default NewArrivals;