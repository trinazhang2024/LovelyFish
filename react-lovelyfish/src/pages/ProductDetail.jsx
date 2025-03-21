import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  // 根据 id 获取产品数据（可以从 API 或本地数据中获取）
  const product = { id: 1, name: 'Model: wp-350s', price: 199, description: 'output: 1000L/hr; Watage: 60w' };

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
    </div>
  );
};

export default ProductDetail;