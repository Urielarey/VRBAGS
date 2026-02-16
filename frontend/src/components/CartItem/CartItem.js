import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, loading } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const product = typeof item.product === 'object' ? item.product : { id: item.product };
  const productId = product._id || product.id || item.product;
  
  // Manejar diferentes formatos de thumbnails
  let imageUrl = '/assets/VR BAGS.png';
  if (product.thumbnails) {
    if (Array.isArray(product.thumbnails) && product.thumbnails.length > 0) {
      imageUrl = product.thumbnails[0];
    } else if (typeof product.thumbnails === 'string') {
      imageUrl = product.thumbnails;
    }
  }
  
  // Asegurar que la ruta empiece con /
  if (imageUrl && !imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl;
  }
  
  const title = product.title || 'Producto';
  const price = product.price || 0;
  const quantity = item.quantity || 1;
  const subtotal = price * quantity;
  const isDisabled = loading || isUpdating;

  const handleIncrease = async () => {
    if (isDisabled) return;
    setIsUpdating(true);
    try {
      await updateQuantity(productId, quantity + 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (isDisabled) return;
    setIsUpdating(true);
    try {
      if (quantity > 1) {
        await updateQuantity(productId, quantity - 1);
      } else {
        await removeFromCart(productId);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isDisabled) return;
    setIsUpdating(true);
    try {
      await removeFromCart(productId);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="cart-item border-bottom pb-3 mb-3">
      <div className="row g-2 align-items-center">
        <div className="col-3 col-md-2">
          <img
            src={imageUrl}
            alt={title}
            className="img-fluid rounded"
            style={{ maxHeight: '60px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-9 col-md-6">
          <h6 className="mb-1">{title}</h6>
          <p className="text-muted mb-0">${price.toLocaleString()}</p>
        </div>
        <div className="col-7 col-md-2 mt-2 mt-md-0">
          <div className="btn-group btn-group-sm w-100" role="group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleDecrease}
              disabled={isDisabled}
              aria-label="Disminuir cantidad"
            >
              -
            </button>
            <span className="btn btn-outline-secondary disabled flex-grow-1">
              {quantity}
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleIncrease}
              disabled={isDisabled}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
        <div className="col-5 col-md-2 text-end mt-2 mt-md-0">
          <p className="mb-1 fw-bold">${subtotal.toLocaleString()}</p>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleRemove}
            disabled={isDisabled}
            aria-label="Eliminar producto"
          >
            {isDisabled ? '...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
