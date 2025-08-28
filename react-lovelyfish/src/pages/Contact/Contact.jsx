import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUser, FaPaperPlane } from 'react-icons/fa';
import api from '../../API/axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('❌ Please fill in all fields.');
      return;
    }

    setStatus('Sending...');

    try {
      // 调用后端接口
      const res = await api.post('/contact', formData);

      if (res.status === 200) {
        setStatus('✅ Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(`❌ Failed to send message: ${res.data?.message || ''}`);
      }
    } catch (error) {
      console.error(error);
      setStatus(`❌ Error: ${error.response?.data?.message || 'Unable to send message.'}`);
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>

      {/* Contact Info */}
      <section className="contact-section">
        <h2 className="section-title">Contact Info</h2>
        <ul className="contact-info">
          <li><FaPhoneAlt /> Phone: +64 221932432</li>
          <li><FaEnvelope /> Email: lovelyfish@yahoo.com</li>
          <li><FaMapMarkerAlt /> Address: Massey, West Auckland, New Zealand 0614</li>
        </ul>
      </section>

      {/* Contact Form */}
      <section className="contact-section">
        <h2 className="section-title">Send a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name"><FaUser /> Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Please input your name here."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email"><FaEnvelope /> Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Please input your email address here."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message"><FaPaperPlane /> Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please leave your message here."
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={status === 'Sending...'}>
            {status === 'Sending...' ? 'Sending...' : 'Submit'}
          </button>
        </form>

        {/* 状态提示 */}
        {status && <p className={`status-message ${status.includes('❌') ? 'error' : 'success'}`}>{status}</p>}
      </section>
    </div>
  );
};

export default Contact;
