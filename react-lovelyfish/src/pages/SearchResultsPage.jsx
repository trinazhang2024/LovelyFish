import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/ProductList/ProductList';
import axios from 'axios';

const SearchResultsPage = () => {
  const query = new URLSearchParams(useLocation().search).get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7148/api/Product')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载产品失败:', err);
        setError('无法加载产品数据');
        setLoading(false);
      });
  }, []);

  // 搜索逻辑（在前端过滤）
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading) return <p>正在加载产品...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4">搜索结果: "{query}"</h2>
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} limit={false} />
      ) : (
        <div className="text-center py-5">
          <h4>未找到匹配商品</h4>
          <p>请尝试其他关键词</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
