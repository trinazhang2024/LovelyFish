// AquariumGuide.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./AquariumGuide.css";

function AquariumGuide() {
  return (
    <div className="aquarium-guide">
      <h2>🐠 Aquarium Guide</h2>
      <ul>
        <li><Link to="/equipment-tips">🛠 Equipment Tips</Link></li>
        <li><Link to="/fish-care-faq">📋 Fish Care FAQ</Link></li>
      </ul>
    </div>
  );
}

export default AquariumGuide;
