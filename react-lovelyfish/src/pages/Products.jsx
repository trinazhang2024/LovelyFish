import React, { useEffect, useState, useCallback } from 'react';
import api from '../API/axios'; 
import {useCart} from '../contexts/CartContext'
import ProductList from '../components/ProductList/ProductList';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 12;
  const { addToCart, addingIds } = useCart(); // ✅ 取出购物车方法

  const fetchProducts = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/Product', {
        params: { page: pageNum, pageSize }
      });
      const productsData = res.data.items ||[];

      setProducts(productsData);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || productsData.length);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [pageSize]); // pageSize 不会变，可以安全放在依赖里

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]); // ✅ 加上 fetchProducts 就不会有警告

  if (loading) return <p>正在加载产品...</p>;
  if (error) return <p>加载产品时出错: {error}</p>;


  return (
    <div className="products-container">
      {/* <h1>All Products</h1> */}
      
      {/* ✅ 把 addToCart 和 addingIds 传进去 */}
      <ProductList 
        products={products} 
        addToCart={addToCart} 
        addingIds={addingIds} 
      />

      <div className="pagination">
        <span>共 {totalItems} 条，每页 {pageSize} 条</span>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>上一页</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>下一页</button>
      </div>

    </div>
  );
};

export default Products;
