import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartWidget.css';

const CartWidget = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <span className="cart-count u-cart-count position-absolute top-0 start-100 translate-middle badge rounded-pill">
      {totalItems}
    </span>
  );
};

export default CartWidget;
