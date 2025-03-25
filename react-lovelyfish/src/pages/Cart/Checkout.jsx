import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { 
  Container, 
  Alert,
  Card,
  Form,
  Button,
  ListGroup,
  Row, // 添加这行
  Col  // 添加这行
} from 'react-bootstrap';
import { BsUpload, BsCurrencyDollar } from 'react-icons/bs';

export default function CheckoutPage() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  // 计算总金额
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'CLEAR_CART' });
    navigate('/payment-confirmation'); // 跳转到支付凭证提交页
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Offline Payment Instructions</h2>
      
      <Row>
        {/* 左侧 - 支付说明 */}
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="d-flex align-items-center">
                <BsCurrencyDollar className="text-warning me-2" size={24} />
                Payment Method
              </h4>
              
              <Alert variant="warning" className="mt-3">
                <strong>Bank Transfer Details:</strong>
                <ul className="mt-2 mb-0">
                  <li>Bank Name: YOUR BANK NAME</li>
                  <li>Account Number: 1234 5678 9012</li>
                  <li>Account Holder: YOUR NAME</li>
                  <li>Amount: <strong>${total.toFixed(2)}</strong></li>
                </ul>
              </Alert>

              <div className="bg-light p-3 rounded small">
                <h6>Important Notes:</h6>
                <ol>
                  <li>Complete the transfer using your <strong>Order ID</strong> as reference</li>
                  <li>Payment must be made within 24 hours</li>
                  <li>After payment, upload screenshot on next page</li>
                </ol>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 右侧 - 订单摘要 */}
        <Col md={5}>
          <Card>
            <Card.Body>
              <h4>Order Summary</h4>
              <ListGroup variant="flush" className="mb-3">
                {cart.map(item => (
                  <ListGroup.Item key={item.id}>
                    {item.name} × {item.quantity}
                    <span className="float-end">${(item.price * item.quantity).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="text-end h5">
                Total: <strong>${total.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>

          <Button 
            variant="primary" 
            size="lg"
            className="w-100 mt-3 py-2"
            onClick={handleSubmit}
          >
            I've Made Payment - Upload Proof
          </Button>
        </Col>
      </Row>
    </Container>
  );
}