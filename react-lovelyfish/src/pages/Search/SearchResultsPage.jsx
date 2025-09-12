import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import api from '../../API/axios';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  // Get query string from URL. e.g., /search?q=fish
  const query = new URLSearchParams(useLocation().search).get('q') || '';

  // Component state
  const [products, setProducts] = useState({ items: [] }); // All products fetched from backend
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error message


  // Fetch all products on component mount
  useEffect(() => {
    api.get('/Product')
      .then(response => {
        console.log('products:', response.data);
        setProducts(response.data || { items: [] }); //Ensure there is an items array
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setError('Unable to load product data');
        setLoading(false);
      });
  }, []);

  // Normalize strings for search
  // Lowercase, remove spaces, remove trailing 's'
  const normalize = str => {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().replace(/\s+/g, '').replace(/s$/, '');
  };

  const keyword = normalize(query); // Normalized search keyword

  console.log(products.items.map(p => normalize(p.categoryTitle)), "keyword:", keyword);

  // Filter products based on title, description, or category
  const filteredProducts = (products.items || []).filter(product => {
    
    const title = normalize(product.title);
    const category = normalize(product.categoryTitle);

    return title.includes(keyword) || category.includes(keyword);
  });


  // Render loading, error, or results
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="search-results-container">
      <h2 className="mb-4">Search Results: "{query}"</h2>

      {filteredProducts.length > 0 ? (
        <div className="product-list">
          {/* Pass filtered products to ProductList component */}
          <ProductList products={filteredProducts} limit={false} />
        </div>
      ) : (
        <div className="no-results">
          <h4>No matching products found</h4>
          <p>Try searching with other keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
