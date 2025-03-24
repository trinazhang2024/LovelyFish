import { useState } from 'react';



//console.log("ProductCategoryPage 渲染了！");
const useSortableProducts = (initialProducts,sortOptions = ['price', 'wattage', 'output']) => {
  
  // 状态：排序方式和排序顺序
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' 或 'desc'

  //console.log("当前类别:", category || "category 为空！");

  // 根据排序方式和排序顺序对产品进行排序
  const sortedProducts = [...initialProducts].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'price':
        comparison = parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
        break;
      case 'wattage':
        comparison = a.wattage - b.wattage;
        break;
      case 'output':
        comparison = a.output - b.output;
        break;
      default:
        return 0; // 默认排序（不排序）
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 更新排序方式
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // 更新排序顺序
  const handleOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
    sortOptions // 返回可用的排序选项
  };
};

export default useSortableProducts;