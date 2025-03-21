import React from 'react';
import './Recommend.css'; // 引入 Recommend 的样式


const Recommend = () => {
  return (
    <div className="recommend container">
      <h3>精品推荐</h3>
      <ul>
        <li><a href="#">过滤器</a></li>
        <li><a href="#">水泵</a></li>
        <li><a href="#">heater</a></li>
        <li><a href="#">foam</a></li>
        <li><a href="#">filtration</a></li>
      </ul>
    </div>
  );
};

export default Recommend;