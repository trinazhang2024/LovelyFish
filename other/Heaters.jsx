import React from 'react';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../hooks/useSortableProducts'; // 引入自定义 Hook
import productsByCategory from '../data/data'; // 引入产品数据
import '../hooks/SortControls.css'; // 引入样式文件


const Heaters = () => {
  // 过滤出加热棒类别的产品
  const heatersCategory = productsByCategory.find((category) => category.category === '加热棒');

  // 使用自定义 Hook，只允许按价格和瓦数排序
  const {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
    sortOptions,
  } = useSortableProducts(heatersCategory?.products || []);

  // 如果未找到加热器类别，显示提示信息
  if (!heatersCategory) {
    return (
      <div className="container">
        <h1>加热器</h1>
        <p>暂无加热器类别的产品</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>加热棒</h1>

      {/* 排序选择器 */}
      <div className="sort-controls">
        <label htmlFor="sort">排序方式：</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="default">默认</option>
          <option value="price">价格</option>
          <option value="wattage">瓦数</option>
        </select>

        {/* 排序顺序按钮 */}
        <button onClick={handleOrderChange}>
          {sortOrder === 'asc' ? '升序' : '降序'}
        </button>
      </div>

      <ProductList products={[heatersCategory]} limit={false}/> {/* 传递加热棒数据 */}
    </div>
  );
};

export default Heaters;