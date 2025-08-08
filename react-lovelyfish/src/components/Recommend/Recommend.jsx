import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Recommend.css';

const Recommend = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7148/api/Product')
      .then(response => {
        const products = response.data;

        // Get all unique categories
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

        // Here you can filter by the categories you want to recommend, or simply use all categories.
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error('Unable to load recommended categories:', err);
        setError('Unable to load recommended content');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="recommend container">Loading recommended...</div>;
  }

  if (error) {
    return <div className="recommend container text-danger">{error}</div>;
  }

  return (
    <div className="recommend container">
      <h3>Recommend</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            {/* 这里用链接到对应分类页，比如 /products/filters */}
            <Link to={`/products/${category.toLowerCase()}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommend;
