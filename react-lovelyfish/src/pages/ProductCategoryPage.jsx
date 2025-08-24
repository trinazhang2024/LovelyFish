import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../API/axios'; 
import ProductList from '../components/ProductList/ProductList';
import './Products.css'; // 公共样式文件
import './SortControls.css'; // 排序控件样式

const ProductCategoryPage = () => {
  const { category } = useParams(); // 从 URL 获取分类
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState('default'); // 排序字段
  const [sortOrder, setSortOrder] = useState('asc'); // 升序/降序

  useEffect(() => {
    setLoading(true);
    api.get('/Product')
      .then(response => {
        // 先筛选当前分类
        const filtered = response.data.filter(
          p => p.category?.title?.toLowerCase() === category.toLowerCase()
        );

        // 取主图
        const filteredWithImage = filtered.map(p => ({
          ...p,
          mainImage: p.images && p.images.length > 0 ? p.images[0].url : '',
        }));

        setProducts(filteredWithImage);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载产品失败:', err);
        setError('无法加载产品');
        setLoading(false);
      });
  }, [category]);

  // 排序逻辑
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'default') return 0;
    const aVal = a[sortBy] || 0;
    const bVal = b[sortBy] || 0;
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // 动态排序控件
  const availableSortOptions = ['price'];
  if (products.some(p => p.wattage !== undefined)) {
    availableSortOptions.push('wattage');
  }

  if (loading) return <p>正在加载 {category} 产品...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>

      <div className={`sort-controls ${availableSortOptions.length === 1 ? 'single-option' : ''}`}>
        {availableSortOptions.length > 1 ? (
          <>
            <label>排序方式：</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">默认</option>
              <option value="price">价格</option>
              {availableSortOptions.includes('wattage') && <option value="wattage">瓦数</option>}
            </select>
          </>
        ) : (
          <span>按价格排序：</span>
        )}
        <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑ 升序' : '↓ 降序'}
        </button>
      </div>

      <ProductList products={sortedProducts} limit={false} />
    </div>
  );
};

export default ProductCategoryPage;
