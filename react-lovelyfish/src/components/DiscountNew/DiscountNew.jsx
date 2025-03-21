import React from 'react';
import './DiscountNew.css'; // 引入 DiscountNew 的样式

const DiscountNew = () => {
  return (
    <div className="discountnew">
      <div className="left">
        <h2>CLEARANCE SPECIALS</h2>
        <h3>20-50% off selected products</h3>
        <a href="#" className="button">SHOP ALL SPECIALS NOW</a>
      </div>
      <div className="right">
        <h2>New Coming</h2>
        <h3>10% off selected new products</h3>
        <a href="#" className="button">SHOP ALL NEWS NOW</a>
      </div>
    </div>
  );
};

export default DiscountNew;