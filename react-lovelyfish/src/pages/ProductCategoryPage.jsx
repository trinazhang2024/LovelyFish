import React,{ useEffect }  from 'react';
import productsByCategory from '../data/data';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../hooks/useSortableProducts'; // 引入自定义 Hook
import '../hooks/SortControls.css'; // 引入样式文件

console.log("ProductCategoryPage 渲染了！");


const ProductCategoryPage = ({ category, sortOptions }) => {
  useEffect(() => {
    console.log('Category:', category);
    console.log('Sort Options:', sortOptions);
  }, [category, sortOptions]);
  
  const categoryData = productsByCategory.find((cat) => cat.category === category);

  // 使用自定义 Hook
  const {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
    sortOptions: availableSortOptions, // 从 Hook 返回的可用排序选项
  } = useSortableProducts(categoryData?.products || [], sortOptions);

  // 如果未找到类别，显示提示信息
  if (!categoryData) {
    return (
      <div className="container">
        <h1>{category}</h1>
        <p>暂无{category}类别的产品</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{category}</h1>

      {/* 排序选择器和按钮 */}
      <div className="sort-controls">
        <label htmlFor="sort">排序方式：</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="default">默认</option>
          {availableSortOptions.map((option) => (
            <option key={option} value={option}>
              {option === 'price' ? '价格' : option === 'wattage' ? '瓦数' : '流量'}
            </option>
          ))}
        </select>

        <button onClick={handleOrderChange}>
          {sortOrder === 'asc' ? '升序 ↑' : '降序 ↓'}
        </button>
      </div>

      {/* 传递排序后的产品数据 */}
      <ProductList products={sortedProducts} limit={false} />
    </div>
  );
};

export default ProductCategoryPage;