import React from 'react';
import './DiscountNew.css'; 

const DiscountNew = () => {
  return (
    <div className="discountnew">
     {/* Left - New Arrivals */}
      <div className="left">
        <h2>NEW ARRIVALS</h2>
        <h3>Fresh gear just landed!</h3>
        <div className="button-container">
          <a href="/new-arrivals" className="button">Shop Now</a>
        </div>
      </div>
      {/* Right - Clearance Specials */}
      <div className="right">
        <h2>CLEARANCE SPECIALS</h2>
        <h3>Big discounts 30% before it's gone!</h3>
        <div className="button-container">
          <a href="/clearance" className="button">GRAB DEALS</a>
        </div>
      </div>

    </div>
  );
};

export default DiscountNew;