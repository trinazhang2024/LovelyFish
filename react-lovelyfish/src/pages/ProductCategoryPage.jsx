import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../API/axios';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../pages/useSortableProducts'; 
import {useCart} from '../contexts/CartContext'
import './Products.css';
import './SortControls.css';

const ProductCategoryPage = () => {
  const { category } = useParams();
  const { addToCart } = useCart(); // 从上下文获取 addToCart
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
   const fetchProducts = useCallback((pageNum = 1) => {
    setLoading(true);
    api.get('/Product', {
      params: { page: pageNum, pageSize: 12, category: dbCategory }
    })
    .then(res => {
      const productsWithImage = res.data.items.map(p => ({
        ...p,
        mainImage: p.mainImageUrl || '/upload/placeholder.png',
      }));
      setProducts(prev => pageNum === 1 ? productsWithImage : [...prev, ...productsWithImage]);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
      setLoading(false);
    })
    .catch(err => {
      console.error('加载产品失败:', err);
      setError('无法加载产品');
      setLoading(false);
    });
  }, [dbCategory]); // dbCategory 改变时才更新函数
  
  useEffect(() => {
    fetchProducts(1); 
  }, [category, dbCategory, fetchProducts]); // ESLint 不报错

  const handleLoadMore = () => {
    if (page < totalPages) fetchProducts(page + 1);
  };

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

      <ProductList
        products={sortedProducts}
        limit={false}
        addToCart={addToCart}
      />

      {page < totalPages && (
        <button onClick={handleLoadMore}>加载更多</button>
      )}
    </div>
  );
};

export default ProductCategoryPage;