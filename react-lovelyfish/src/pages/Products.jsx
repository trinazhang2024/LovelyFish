import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList/ProductList';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7148/api/Product')
      .then((response) => {
        setProducts(response.data); // 直接存储平铺数组
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>正在加载产品...</p>;
  if (error) return <p>加载产品时出错: {error}</p>;

  return (
    <div className="container">
      <h1>All the Products</h1>
      <ProductList products={products} /> {/* 传递平铺数组 */}
    </div>
  );
};

export default Products;
