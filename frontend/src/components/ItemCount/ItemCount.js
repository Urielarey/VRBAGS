import React from 'react';
import './ItemCount.css';

const ItemCount = ({ stock, initial = 1, onAdd, quantity, setQuantity }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="item-count">
      <div className="quantity-controls mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={handleDecrease}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="mx-3">{quantity}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={handleIncrease}
          disabled={quantity >= stock}
        >
          +
        </button>
      </div>
      <button
        className="btn btn-primary add-to-cart-btn w-100"
        onClick={onAdd}
        disabled={quantity < 1 || quantity > stock}
      >
        Agregar al Carrito
      </button>
    </div>
  );
};

export default ItemCount;
