import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/fish-community">Fish Community 🐟</Link> 
        <Link to="/aquarium-guide">Aquarium Guide 🐠</Link> 
      </div>
      <p>&copy; 2025 LovelyFish. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
