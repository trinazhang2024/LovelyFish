import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import './AddToCartButton.css';

const AddToCartButton = ({ productId, productTitle, addToCart }) => {
const [adding, setAdding] = useState(false);
const { showToast } = useToast();

const handleClick = async () => {

    setAdding(true);
    try {
      await addToCart(productId, 1);
      showToast(`🐟 ${productTitle} 已添加到购物车！`,3000);
    } catch (err) {
      showToast('添加购物车失败，请稍后重试');
    } finally {
      setAdding(false);
    }
  };

return (
    <button className="buy-button" onClick={handleClick} disabled={adding}>
      {adding ? (
        <span className="loading">
          <span className="spinner" /> Adding...
        </span>
      ) : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;
