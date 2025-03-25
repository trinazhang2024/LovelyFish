import React,{ useEffect }  from 'react';
import productsByCategory from '../data/data';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../hooks/useSortableProducts'; // 引入自定义 Hook
import '../hooks/SortControls.css'; // 引入样式文件

console.log("1. ProductCategoryPage模块加载");


const ProductCategoryPage = ({ category, sortOptions }) => {
  console.log("2. 组件开始渲染，接收到的props:", { category, sortOptions });

  useEffect(() => {
    console.log("3. useEffect触发，当前props:", { category, sortOptions });
  }, [category, sortOptions]);

  console.log("4. 开始查找类别数据");
  // 获取原始类别数据
  const categoryData = productsByCategory.find((cat) => cat.category === category);

  console.log("5. 找到的类别数据:", categoryData);

  // 使用自定义Hook
  console.log("6. 准备调用useSortableProducts");

  // 使用自定义 Hook
  const {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
    sortOptions: availableSortOptions, // 从 Hook 返回的可用排序选项
  } = useSortableProducts(categoryData?.products || [], sortOptions);
  console.log("7. 排序后的产品:", sortedProducts);

  // 格式化数据以匹配ProductList要求
  const formattedProducts = [{
    category: category || '未命名类别',  // 默认值防止undefined
    products: sortedProducts || []      // 保证始终是数组
  }];

  console.log('格式化后的最终数据:', formattedProducts);

  // 如果未找到类别，显示提示信息
  if (!categoryData) {
    console.log("8. 未找到类别数据，显示错误信息");
    return (
      <div className="container">
        <h1>{category}</h1>
        <p>暂无{category}类别的产品</p>
      </div>
    );
  }
  console.log("9. 准备渲染组件主体");

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

      {/* 产品列表 传递排序后的产品数据 */}
      <ProductList 
        products={formattedProducts} 
        limit={false}
        data-testid="product-list"
      />     
       
    </div>
  );
};

export default ProductCategoryPage;