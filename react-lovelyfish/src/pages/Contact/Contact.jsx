import React, { useState } from 'react';
import './Contact.css'; // 引入样式文件

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`感谢您的留言，${formData.name}！我们会尽快与您联系。`);
    setFormData({ name: '', email: '', message: '' }); // 清空表单
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">....</h1>

      {/* 联系方式 */}
      <section className="contact-section">
        <h2 className="section-title">联系方式</h2>
        <ul className="contact-info">
          <li>电话: +86 123 4567 890</li>
          <li>邮箱: info@lovelyfish.com</li>
          <li>地址: 中国北京市朝阳区渔具大道 123 号</li>
        </ul>
      </section>

      {/* 联系表单 */}
      <section className="contact-section">
        <h2 className="section-title">发送消息</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">留言</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            提交
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;