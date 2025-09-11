import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../API/axios';
import ProductList from '../components/ProductList/ProductList';
import useSortableProducts from '../pages/useSortableProducts'; 
import { useCart } from '../contexts/CartContext';
import './Products.css';
import './SortControls.css';

const ProductCategoryPage = () => {
  const { category } = useParams(); // Get category from URL parameters
  const { addToCart } = useCart();  // Get addToCart function from Cart context
  const [products, setProducts] = useState([]); // Store fetched products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state
  const [page, setPage] = useState(1);          // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  // Map URL-friendly category names to database category names
  const categoryMap = {
    waterpumps: "Water Pump",
    filters: "Filter",
    wavemakers: "Wave Maker",
    airpumps: "Air Pump",
    heaters: "Heater",
    filtrations: "Filtration",
    ledlights: "Led Light",
    foamandspongefilters: "Foam and Sponge Filter",
    others: "Other"
  };
  const dbCategory = categoryMap[category.toLowerCase()]; // Convert URL param to DB category

  // Function to fetch products from the backend
  const fetchProducts = useCallback((pageNum = 1) => {
    setLoading(true);
    api.get('/Product', {
      params: { page: pageNum, pageSize: 12, category: dbCategory }
    })
    .then(res => {
      // Ensure each product has a main image; use placeholder if missing
      const productsWithImage = res.data.items.map(p => ({
        ...p,
        mainImage: p.mainImageUrl || '/upload/placeholder.png',
      }));

      // If first page, replace products; otherwise, append
      setProducts(prev => pageNum === 1 ? productsWithImage : [...prev, ...productsWithImage]);
      setTotalPages(res.data.totalPages); // Update total pages
      setPage(pageNum);                   // Update current page
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to load products:', err);
      setError('Unable to load products'); // Show user-friendly error
      setLoading(false);
    });
  }, [dbCategory]); // Only recreate function when dbCategory changes

  // Fetch products when category or fetch function changes
  useEffect(() => {
    fetchProducts(1); 
  }, [category, dbCategory, fetchProducts]);

  // Handler to load next page of products
  const handleLoadMore = () => {
    if (page < totalPages) fetchProducts(page + 1);
  };

  // Use custom hook to manage sorting of products
  const {
    sortedProducts,   // Products after sorting
    sortBy,           // Current sort field
    sortOrder,        // Current sort order (asc/desc)
    handleSortChange, // Function to change sort field
    handleOrderChange,// Function to toggle sort order
    sortOptions       // Available sort options
  } = useSortableProducts(products);

  // Display loading or error state
  if (loading) return <p>Loading {dbCategory} products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="products-container">

      {/* Display category title */}
      <h1>{dbCategory}</h1>

      {/* Sorting controls */}
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="default">Default</option>
          {sortOptions.includes('price') && <option value="price">Price</option>}
          {sortOptions.includes('wattage') && <option value="wattage">Wattage</option>}
        </select>

        {/* Toggle ascending/descending */}
        <button onClick={handleOrderChange} disabled={sortBy === 'default'}>
          {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      {/* Display the product list */}
      <ProductList
        products={sortedProducts}
        limit={false}    // Show all products
        addToCart={addToCart} // Pass addToCart function
      />

      {/* Load more button for pagination */}
      {page < totalPages && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
};

export default ProductCategoryPage;
