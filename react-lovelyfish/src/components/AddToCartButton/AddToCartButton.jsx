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
      showToast(`🐟 ${productTitle} has been added to cart！`,3000);
    } catch (err) {
      showToast('Fail to add cart, please try again');
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
