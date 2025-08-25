import { useState } from 'react';

// 提取瓦数函数
const getWattage = (product) => {
  let features = product.features;  // ✅ 用 features

  if (!Array.isArray(features)) return 0;

  const wattItem = features.find(f => f.toLowerCase().includes('watt'));
  if (!wattItem) return 0;

  const match = wattItem.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const useSortableProducts = (initialProducts) => {
  const [sortBy, setSortBy] = useState('default'); // 排序字段
  const [sortOrder, setSortOrder] = useState('asc'); // 排序顺序

  // 动态生成可用排序选项
  const sortOptions = ['price'];
  if (initialProducts.some(p => getWattage(p) > 0)) sortOptions.push('wattage');

  // 排序逻辑
  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (sortBy === 'default') return 0;

    let aVal = 0, bVal = 0;

    if (sortBy === 'price') {
      aVal = parseFloat(a.price || 0);
      bVal = parseFloat(b.price || 0);
    }

    if (sortBy === 'wattage') {
      aVal = getWattage(a);
      bVal = getWattage(b);
    }

    const result = sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    console.log(`排序字段: ${sortBy}, ${a.Title}: ${aVal}, ${b.Title}: ${bVal}, 结果: ${result}`);
    return result; });

  // 更新排序方式
  const handleSortChange = (e) => {
    console.log('选择排序字段:', e.target.value); // ✅ 调试选择排序字段
    setSortBy(e.target.value);
  };

  // 切换升降序
  const handleOrderChange = () => {
    setSortOrder(prev => {
      const newOrder = prev === 'asc' ? 'desc' : 'asc';
      console.log('切换排序顺序:', newOrder); // ✅ 调试升降序
      return newOrder;
    });
  };


  

  return {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
    sortOptions
  };
};

export default useSortableProducts;