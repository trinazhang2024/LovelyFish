import React, { useEffect, useState } from 'react';
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

  const [addingIds, setAddingIds] = useState([]);
  const [cartAlert, setCartAlert] = useState(null);

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
   const fetchProducts = (pageNum = 1) => {
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
  };

  useEffect(() => {
    fetchProducts(1); // 初始加载第一页
  }, [category, dbCategory]);

  const handleLoadMore = () => {
    if (page < totalPages) fetchProducts(page + 1);
  };

  // ✅ 统一 Add to Cart 方法
  const handleAddToCart = async (product) => {
    if (addingIds.includes(product.id)) return;
    setAddingIds(prev => [...prev, product.id]);
    try {
      await addToCart(product.id, 1);
      setCartAlert(`${product.title} 已添加到购物车`);
      setTimeout(() => setCartAlert(null), 3000);
    } catch (err) {
      alert('添加购物车失败，请稍后重试');
    } finally {
      setAddingIds(prev => prev.filter(id => id !== product.id));
    }
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

      {cartAlert && <div className="cart-alert">{cartAlert}</div>}

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
        addToCart={handleAddToCart}
        addingIds={addingIds}
      />
    </div>
  );
};

export default ProductCategoryPage;