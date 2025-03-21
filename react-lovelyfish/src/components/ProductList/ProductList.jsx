import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import productsByCategory from '../../data/data'; // 引入产品数据
import './ProductList.css'; // 引入 ProductList 的样式

//productsByCategory在 ProductList.jsx 中遍历，并通过 props 传递给 ProductCard.jsx

const ProductList = ({ products }) => {
  return (
    <div className="product container">
      {/* 遍历每个类别 */}
      {productsByCategory.map((category) => (
        <div key={category.category} className="product-category">
          {/* 类别标题 */}
          <div className="title">
            <h3>{category.category}</h3>
            <a href="#" className="more">
              查看全部
            </a>
          </div>

          {/* 产品列表 */}
          <div className="row">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>    
  );
};

export default ProductList;