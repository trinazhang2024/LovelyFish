import React, { useEffect, useState, useCallback } from 'react';
import api from '../API/axios'; 
import { useCart } from '../contexts/CartContext';
import ProductList from '../components/ProductList/ProductList';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state
  const [page, setPage] = useState(1);          // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [totalItems, setTotalItems] = useState(0); // Total number of products

  const pageSize = 12; // Number of products per page
  const { addToCart, addingIds } = useCart(); // ✅ Get cart methods and currently adding IDs

  // Fetch products from backend
  const fetchProducts = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/Product', {
        params: { page: pageNum, pageSize }
      });
      const productsData = res.data.items || [];

      setProducts(productsData);                      // Update product list
      setTotalPages(res.data.totalPages || 1);       // Update total pages
      setTotalItems(res.data.totalItems || productsData.length); // Update total items
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message); // Show error message
      setLoading(false);
    }
  }, [pageSize]); // pageSize is stable, safe to include in dependencies

  // Fetch products whenever page changes
  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]); // ✅ Including fetchProducts avoids ESLint warnings

  // Show loading or error messages
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error}</p>;

  return (
    <div className="products-container">
      {/* <h1>All Products</h1> */}

      {/* ✅ Pass addToCart and addingIds to ProductList */}
      <ProductList 
        products={products} 
        addToCart={addToCart} 
        addingIds={addingIds} 
      />

      {/* Pagination controls */}
      <div className="pagination">
        <span>Total {totalItems} items, {pageSize} per page</span>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

    </div>
  );
};

export default Products;
