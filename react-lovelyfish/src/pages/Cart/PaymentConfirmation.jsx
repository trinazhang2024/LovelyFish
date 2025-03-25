import React, { useState } from 'react';
import { 
  Container,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import { BsCheckCircleFill, BsCloudUpload } from 'react-icons/bs';

export default function PaymentConfirmation() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加文件上传逻辑（如发送到您的邮箱）
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Container className="py-5 text-center">
        <BsCheckCircleFill className="text-success" size={60} />
        <h2 className="mt-3">Proof Submitted!</h2>
        <p className="lead text-muted">We'll verify your payment within 24 hours</p>
        
        <Card className="mt-4 text-start">
          <Card.Body>
            <h5>Next Steps:</h5>
            <ul>
              <li>Check your email for order confirmation</li>
              <li>We'll contact you if additional info is needed</li>
              <li>Prepare your order ID for pickup</li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="border-primary">
        <Card.Header as="h5" className="bg-primary text-white">
          Upload Payment Proof
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Payment Screenshot/Photo</Form.Label>
              <div className="border rounded p-5 text-center bg-light">
                <BsCloudUpload size={40} className="text-muted mb-2" />
                <p>Drag & drop file here or click to browse</p>
                <Form.Control 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Your Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Text>We'll send confirmation to this address</Form.Text>
            </Form.Group>

            <Alert variant="info" className="small">
              <strong>File requirements:</strong> Clear image of bank transfer receipt or payment confirmation (JPG/PNG/PDF under 5MB)
            </Alert>

            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              className="w-100 py-2"
              disabled={!file || !email}
            >
              Submit Proof
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}