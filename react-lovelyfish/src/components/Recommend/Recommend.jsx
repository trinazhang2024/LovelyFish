import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../API/axios';
import './Recommend.css';

const Recommend = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/categories')   // 调你的后端接口
    
      .then(res => {
        console.log('Categories API response:', res.data); // ← 打印返回值
        setCategories(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Unable to load recommended categories');
        setLoading(false);
      });
  }, []);


  if (loading) return <div className="recommend container">Loading recommended...</div>;
  if (error) return <div className="recommend container text-danger">{error}</div>;

  return (
    <div className="recommend container">
      <h3>Recommend</h3>
      <ul className="recommend-list">
        {categories.map((category, index) => (
          <li key={index}>
            <Link to={`/products/${category.name?.toLowerCase().replace(/\s+/g, '')+ 's'}`}>
              {category.name || 'Unknown'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommend;
