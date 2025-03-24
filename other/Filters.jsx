import React from 'react';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../hooks/useSortableProducts'; // 引入自定义 Hook
import productsByCategory from '../data/data'; // 引入产品数据
import '../hooks/SortControls.css'; // 引入样式文件

const Filters = () => {
  // 过滤出过滤器类别的产品
  const filtersCategory = productsByCategory.find((category) => category.category === '过滤器');
  //console.log(filtersCategory);
  
  // 使用自定义 Hook
  const {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
  } = useSortableProducts(filtersCategory?.products || []);

  // 如果未找到过滤器类别，显示提示信息
  if (!filtersCategory) {
    return (
      <div className="container">
        <h1>过滤器</h1>
        <p>暂无过滤器类别的产品</p>
      </div>
    );
  }


  return (
    <div className="container">
      <h1>过滤器</h1>
      
      {/* 排序选择器 */}
      <div className="sort-controls">
        <label htmlFor="sort">排序方式：</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="default">默认</option>
          <option value="price">价格</option>
          <option value="wattage">瓦数</option>
          {/* <option value="output">流量</option> */}
        </select>

        {/* 排序顺序按钮 */}
        <button onClick={handleOrderChange}>
          {sortOrder === 'asc' ? '升序' : '降序'}
        </button>
      </div>

      {/* 传递排序后的产品数据 */}
      {/* 传递 limit={false}，表示显示所有产品 */}
      <ProductList products={[{ ...filtersCategory, products: sortedProducts }]} limit={false} />
    </div>
  );
};

export default Filters;