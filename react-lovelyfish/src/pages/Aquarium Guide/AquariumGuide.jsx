import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import "./AquariumGuide.css";

function AquariumGuide() {
  return (
    <>
      {/* SEO Section */}
      <SEO
        title="Aquarium Guide | Fish Tank Tips & Fish Care Advice"
        description="Explore our aquarium guide including equipment tips, fish care FAQ, and practical advice for maintaining a healthy fish tank."
      />

      <div className="aquarium-guide">
        <h1>🐠 Aquarium Guide</h1>
        <p className="guide-intro">
          Welcome to our aquarium guide. Here you will find helpful information
          about aquarium equipment, fish care, and tips for maintaining a
          healthy fish tank.
        </p>

        <h2>Helpful Aquarium Resources</h2>
        <ul>
          <li><Link to="/equipment-tips">🛠 Aquarium Equipment Tips</Link></li>
          <li><Link to="/fish-care-faq">📋 Fish Care FAQ</Link></li>
        </ul>

        <h2>Recommended Aquarium Products</h2>
        <ul>
          <li><Link to="/products/filters">🐟 Aquarium Filters</Link></li>
          <li><Link to="/products/heaters">🔥 Aquarium Heaters</Link></li>
          <li><Link to="/products/pumps">💧 Aquarium Pumps</Link></li>
        </ul>
        
      </div>
    </>
  );
}

export default AquariumGuide;
