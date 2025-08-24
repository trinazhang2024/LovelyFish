import React, { useEffect, useState } from 'react';
import api from '../API/axios'; 
import ProductList from '../components/ProductList/ProductList';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/Product')
      .then((response) => {
        setProducts(response.data); // 直接存储数组，ProductCard 会处理图片
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>正在加载产品...</p>;
  if (error) return <p>加载产品时出错: {error}</p>;

  return (
    <div className="products-container">
      <h1>All Products</h1>
      <ProductList products={products} />
    </div>
  );
};

export default Products;
