import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../components/ProductList/ProductList';
import '../hooks/SortControls.css'; // 样式文件

const ProductCategoryPage = () => {
  const { category } = useParams(); // ⬅️ 从 URL 中读取分类
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sortBy, setSortBy] = useState('default'); // 排序字段
  const [sortOrder, setSortOrder] = useState('asc'); // 升序/降序

  const showWattageSort = ['heaters', 'waterpumps', 'wavemakers', 'ledlights', 'filters', 'airpumps'].includes(category.toLowerCase());

  useEffect(() => {
    axios.get('https://localhost:7148/api/Product')
      .then(response => {
        console.log('接口返回所有产品:', response.data);
        // 筛选出当前分类的产品
        const filtered = response.data.filter(p => p.category.toLowerCase() === category.toLowerCase());
        console.log(`筛选后${category}分类产品:`, filtered);
        setProducts(filtered);
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

  // 动态生成可用排序选项
  const availableSortOptions = ['price'];
  if (showWattageSort && products.some(p => p.wattage !== undefined)) {
    availableSortOptions.push('wattage');
  }

  console.log('传给ProductList的产品数组:', sortedProducts);

  if (loading) return <p>正在加载 {category} 产品...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      
      {/* eg: heaters → Heaters */}
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1> 
      
      
      {/* 排序控件 */}
      <div className={`sort-controls ${availableSortOptions.length === 1 ? 'single-option' : ''}`}>
        {availableSortOptions.length > 1 ? (
          <>
            <label>排序方式：</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">默认</option>
              <option value="price">价格</option>
              <option value="wattage">瓦数</option>
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
