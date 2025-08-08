import React from 'react';
import './About.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUniversity } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>

      {/* Company Overview */}
      <section className="about-section">
        <h2 className="section-title">Company Overview</h2>
        <p className="section-content">
        LovelyFish is a local aquarium equipment store based in Massey, West Auckland, New Zealand. We specialize in providing high-quality, practical, and affordable equipment and accessories for freshwater aquariums, marine tanks, and ponds.
        </p>
      </section>

      {/* Mission and Vision */}
      <section className="about-section">
        <h2 className="section-title">Mission and Vision</h2>
        <p className="section-content">
           We offer a wide range of products, including but not limited to:
        </p>
        <ul className="section-content">
          <li>Air pumps, submersible pumps</li>
          <li>Heaters, LED lights</li>
          <li>Filters, filter pads, filter media</li>
          <li>Gravel, aquatic soil, aquarium decorations, and more</li>
        </ul>
        <p className="section-content">
           Our products are suitable for home aquarium enthusiasts, professional breeders, and commercial aquarium systems.
        </p>
      </section>

      {/* 如何购买 */}
      <section className="about-section">
        <h2 className="section-title">How to Purchase</h2>
        <p className="section-content">
          You can place an order directly on our website and choose to pay via bank transfer. Please email us a screenshot of your payment, and we will arrange shipment as soon as the payment is confirmed.
        </p>
        <ul className="section-content highlight">
          <li><MdPayment /> Bank: **Bank Name**</li>
          <li><FaUniversity /> Account Number: ***Bank Account Number***</li>
          <li>After payment, please send the screenshot to our email. We will process your order promptly.</li>
        </ul>
      </section>

      {/* Contact Us */}
      <section className="about-section">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-content">We check our email every day. You are also welcome to contact us via text message or phone call.</p>
        <ul className="contact-list">
          <li><FaPhoneAlt /> Phone: +64 221932432</li>
          <li><FaEnvelope /> Email: lovelyfish@yahoo.com</li>
          <li><FaMapMarkerAlt /> Address: Massey, West Auckland, New Zealand</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
