//购物车 → 银行转账说明页 → 上传凭证页 → 提交成功确认页

/* 用户提交凭证后，系统应：

发送确认邮件给用户（包含订单号和提交时间）

通知管理员审核（邮件/短信通知您）

在数据库中标记订单状态为"待验证" */

import React from 'react';
import { 
  Container,
  Card,
  Alert,
  Button
} from 'react-bootstrap';
import { BsCheckCircleFill, BsEnvelope, BsWhatsapp, BsPrinter } from 'react-icons/bs';

export default function OrderConfirmation() {
  // 模拟订单数据（实际应从上下文或路由state获取）
  const orderInfo = {
    orderId: `#${Math.floor(Math.random() * 1000000)}`,
    contactEmail: "user@example.com",
    adminContact: "+1234567890" // 您的联系方式
  };

  return (
    <Container className="py-5 text-center">
      {/* 成功图标 */}
      <BsCheckCircleFill className="text-success" size={60} />
      <h2 className="mt-3">Payment Proof Received!</h2>
      <p className="lead text-muted">
        Your order <strong>{orderInfo.orderId}</strong> is pending verification
      </p>

      {/* 信息卡片 */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body className="text-start">
          <h5 className="d-flex align-items-center">
            <BsEnvelope className="text-primary me-2" />
            What happens next?
          </h5>
          <ol className="mt-3">
            <li>We've sent a confirmation to <strong>{orderInfo.contactEmail}</strong></li>
            <li>Our team will verify your payment within <strong>24 hours</strong></li>
            <li>You'll receive another email when verification is complete</li>
          </ol>

          <hr />

          <h5 className="d-flex align-items-center mt-4">
            <BsWhatsapp className="text-success me-2" />
            Need urgent help?
          </h5>
          <p className="mt-2">
            Contact us at: <br />
            <a href={`tel:${orderInfo.adminContact}`} className="text-decoration-none">
              {orderInfo.adminContact}
            </a>
          </p>
        </Card.Body>
      </Card>

      {/* 操作按钮 */}
      <div className="mt-4 d-flex justify-content-center gap-3">
        <Button variant="outline-primary" className="d-flex align-items-center">
          <BsPrinter className="me-2" /> Print Receipt
        </Button>
        <Button variant="primary" href="/">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}