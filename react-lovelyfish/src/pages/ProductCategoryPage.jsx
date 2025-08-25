import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../API/axios';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../pages/useSortableProducts'; 
import './Products.css';
import './SortControls.css';

const ProductCategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL 映射到数据库分类
  const categoryMap = {
    waterpumps: "Water Pump",
    filters: "Filter",
    wavemakers: "Wave Maker",
    airpumps: "Air Pump",
    heaters: "Heater",
    filtration: "Filtration",
    ledlights: "Led Light",
    spongefoams: "Foam and Sponge Filter",
    other: "Other"
  };
  const dbCategory = categoryMap[category.toLowerCase()];

  // 获取产品数据
  useEffect(() => {
    setLoading(true);
    api.get('/Product')
      .then(response => {

        console.log("原始产品数据:", response.data); // ✅ 查看 FeaturesJson 是字符串还是数组

        const filtered = response.data
          .filter(p => p.categoryTitle === dbCategory)
          .map(p => ({
            ...p,
            // 主图占位
            mainImage: p.mainImageUrl || '/upload/placeholder.png',
          }));

        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载产品失败:', err);
        setError('无法加载产品');
        setLoading(false);
      });
  }, [category, dbCategory]);

  // 使用 Hook 管理排序
  const {
    sortedProducts,
    sortBy,
    sortOrder,
    handleSortChange,
    handleOrderChange,
    sortOptions
  } = useSortableProducts(products);

  if (loading) return <p>正在加载 {dbCategory} 产品...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">
      <h1>{dbCategory}</h1>

      <div className="sort-controls">
        <label>排序方式：</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="default">默认</option>
          {sortOptions.includes('price') && <option value="price">价格</option>}
          {sortOptions.includes('wattage') && <option value="wattage">瓦数</option>}
        </select>

        <button onClick={handleOrderChange} disabled={sortBy === 'default'}>
          {sortOrder === 'asc' ? '↑ 升序' : '↓ 降序'}
        </button>
      </div>

      <ProductList products={sortedProducts} limit={false} />
    </div>
  );
};

export default ProductCategoryPage;