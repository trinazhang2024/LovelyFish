
/* 使用 Bootstrap 的 Card 和 ListGroup 组件创建美观的布局

添加了商品图片、数量调整按钮和删除按钮

实现了空购物车状态显示

添加了结算按钮

使用响应式布局适应不同屏幕尺寸 */

import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. 导入 useNavigate
import { useCart } from '../../contexts/CartContext';
import { Container, Card, Row, Col, Image, Button, ListGroup } from 'react-bootstrap';

export default function CartPage() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate(); // 2. 初始化 navigate 函数

  // 定义处理函数（推荐单独提取，而非内联在 JSX 中）
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return; // 阻止跳转
    }
    navigate('/checkout'); // 4. 执行跳转
  };

  
  return (
    <Container className="my-4">
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Your cart is empty</h5>
            <p className="text-muted">Start shopping to add items to your cart</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <ListGroup variant="flush">
            {cart.map(item => (
              <ListGroup.Item key={item.id}>
                <Row className="align-items-center">
                  <Col xs={3} md={2}>
                    <Image src={item.image} alt={item.name} fluid thumbnail />
                  </Col>
                  <Col xs={6} md={8}>
                    <h5>{item.name}</h5>
                    <div className="d-flex align-items-center mt-2">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => dispatch({ type: 'DECREMENT', id: item.id })}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => dispatch({ type: 'INCREMENT', id: item.id })}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                  <Col xs={3} md={2} className="text-end">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Card.Footer className="text-end">
            <Button variant="primary" onClick={handleProceedToCheckout} disabled={cart.length===0}>Proceed to Checkout</Button> 
            {/* 禁用空购物车的按钮disabled */}
          </Card.Footer>
        </Card>
      )}
    </Container>
  );
}