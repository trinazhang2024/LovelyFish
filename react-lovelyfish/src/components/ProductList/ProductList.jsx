
//productsByCategory在 ProductList.jsx 中遍历，并通过 props 传递给 ProductCard.jsx

import React from 'react';
import ProductCard from '../ProductCard/ProductCard'; // 引入 ProductCard 组件
import './ProductList.css'; // 引入样式文件

const ProductList = ({ products, limit }) => {
  return (
    <div className="product container">
      {/* 遍历每个类别 */}
      {products.map((category) => (
        <div key={category.category} className="product-category">
          {/* 类别标题 */}
          <div className="title">
            <h3>{category.category}</h3>

            {/* 如果是首页，显示“查看全部”链接,通过传递一个额外的参数 给 ProductList 组件，来区分是首页还是单个类别页面。如果是首页，就只显示4个产品；如果是单个类别页面，就显示所有产品。*/}
            {limit && (
              <a href={`/products/${category.category}`} className="more">
                查看全部
              </a>
            )}
          </div>

          {/* 产品列表 */}
          <div className="row">
             {/* 根据 limit 参数决定是否切片 */}
            {(limit ? category.products.slice(0, 4) : category.products).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;