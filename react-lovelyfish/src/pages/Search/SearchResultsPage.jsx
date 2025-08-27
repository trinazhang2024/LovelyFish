import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import api from '../../API/axios';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const query = new URLSearchParams(useLocation().search).get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/Product')
      .then(response => {
        console.log('products:', response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载产品失败:', err);
        setError('无法加载产品数据');
        setLoading(false);
      });
  }, []);

  // 统一化函数：字符串小写、去空格、去尾部 s
  const normalize = str => {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().replace(/\s+/g, '').replace(/s$/, '');
  };

  const keyword = normalize(query);

  const filteredProducts = products.filter(product => {
    const title = normalize(product.title);
    const description = normalize(product.description);
    const category = normalize(product.categoryTitle);

    return title.includes(keyword) || description.includes(keyword) || category.includes(keyword);
  });

  if (loading) return <p>正在加载产品...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="search-results-container">
      <h2 className="mb-4">搜索结果: "{query}"</h2>
      {filteredProducts.length > 0 ? (
        <div className="product-list">
           <ProductList products={filteredProducts} limit={false} />
        </div>
      ) : (
        <div className="no-results">
          <h4>未找到匹配商品</h4>
          <p>请尝试其他关键词</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
