import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // 新增
import productsByCategory from '../../data/data'; // 引入数据源
import newProducts from '../../data/newProducts' ;
import './ProductDetail.css'; // 引入样式文件

const ProductDetail = () => {
  const { id } = useParams();
  const {dispatch} = useCart(); // 新增

  // 从数据源中查找当前产品 合并搜索范围：常规产品 + 新品
  const allProducts = [
    ...productsByCategory.flatMap(c => c.products),
    ...newProducts
  ];

  const product = allProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Product Not Found</div>;
  }


  const addToCart = () => { // 新增函数
    dispatch({ 
      type: 'ADD_ITEM', 
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
    alert(`${product.name} 已添加到购物车`);
  };

  return (
    <div className="product-detail">
      
       {/* 面包屑导航 */}
       <div className="breadcrumb">
        <Link to="/">Home</Link> › <Link to="/products">Books</Link> ›{' '}
        <span>{product.name}</span>
      </div>

      {/* 图片和产品信息容器 */}
      <div className="product-container">
        {/* 左侧图片 */}
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        {/* 右侧产品信息 */}
        <div className="product-info-container">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${product.price}</p>
          <button className="buy-button" onClick={addToCart}>Add to Cart</button>
          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description}</p>
            <ul className="features-list">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 相关推荐 */}
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-list">
          {productsByCategory
            .flatMap((category) => category.products) // 将所有产品扁平化
            .filter((p) => p.id !== product.id) // 过滤掉当前产品
            .slice(0, 3) // 只显示前 3 个相关产品
            .map((related) => (
              <div key={related.id} className="related-item">
                <img src={related.image} alt={related.name} className="related-image" />
                <h3 className="related-name">{related.name}</h3>
                <p className="related-price">${related.price}</p>
                <Link to={`/products/${related.id}`} className="related-link">
                  View Details
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;