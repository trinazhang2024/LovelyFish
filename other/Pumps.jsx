import React from 'react';
import ProductList from '../components/ProductList/ProductList';
import productsByCategory from '../data/data'; // 引入产品数据

const Pumps = () => {
  // 过滤出潜水泵类别的产品
  const pumpsCategory = productsByCategory.find((category) => category.category === '潜水泵');

  return (
    <div className="container">
      <h1>潜水泵</h1>
      <ProductList products={[pumpsCategory]} limit={false}/> {/* 传递潜水泵数据 */}
    </div>
  );
};

export default Pumps;