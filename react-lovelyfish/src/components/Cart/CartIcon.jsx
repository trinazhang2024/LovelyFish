
/* 
使用 React Icons 中的购物车图标 (BsCart) 替代表情符号
添加了 Bootstrap 的 Badge 组件显示数量
优化了定位和样式 
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Badge } from 'react-bootstrap';
import { BsCart } from 'react-icons/bs';

export default function CartIcon() {
  const { cart } = useCart();
  
  return (
    <Link to="/cart" className="position-relative text-decoration-none">
      <BsCart size={24} className="text-dark" />
      {cart.length > 0 && (
        <Badge 
          pill 
          bg="danger" 
          className="position-absolute top-0 start-100 translate-middle"
          style={{ fontSize: '0.6rem' }}
        >
          {cart.length}
        </Badge>
      )}
    </Link>
  );
}