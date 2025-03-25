import React,{ useState}  from 'react';
import productsByCategory from '../data/data';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../hooks/useSortableProducts'; // 引入自定义 Hook
import '../hooks/SortControls.css'; // 引入样式文件

const ProductCategoryPage = ({ category, showWattageSort = false }) => {
  const categoryData = productsByCategory.find(cat => cat.category === category);
  
  // 动态生成可用排序选项
  const availableSortOptions = ['price'];
  if (showWattageSort && categoryData?.products.some(p => p.wattage !== undefined)) {
    availableSortOptions.push('wattage');
  }

  // 简单排序逻辑（无需自定义Hook）
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const sortedProducts = [...(categoryData?.products || [])].sort((a, b) => {
    if (sortBy === 'default') return 0;
    const aVal = a[sortBy] || 0;
    const bVal = b[sortBy] || 0;
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="container">
      <h1>{category}</h1>
      
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

      <ProductList products={[{ category, products: sortedProducts }]} limit={false} />
    </div>
  );
};

export default ProductCategoryPage;