import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/ProductList/ProductList';
import productsByCategory from '../data/data';

const SearchResultsPage = () => {
  const query = new URLSearchParams(useLocation().search).get('q') || '';

  // 搜索逻辑
  const searchResults = productsByCategory
    .map(category => ({
      ...category,
      products: category.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
      )
    }))
    .filter(category => category.products.length > 0);

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4">搜索结果: "{query}"</h2>
      {searchResults.length > 0 ? (
        <ProductList products={searchResults} limit={false} />
      ) : (
        <div className="text-center py-5">
          <h4>未找到匹配商品</h4>
          <p>请尝试其他关键词</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;