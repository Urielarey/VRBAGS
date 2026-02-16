import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import ItemCount from '../ItemCount/ItemCount';
import './ItemDetail.css';

const ItemDetail = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Manejar diferentes formatos de thumbnails
  let imageUrl = '/assets/VR BAGS.png'; // Imagen por defecto
  
  if (product.thumbnails && Array.isArray(product.thumbnails) && product.thumbnails.length > 0) {
    imageUrl = product.thumbnails[0];
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
  };

  const stock = product.stock || 0;
  const isOutOfStock = stock === 0;

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <img 
          src={imageUrl} 
          className="img-fluid product-image" 
          alt={product.title}
        />
      </div>
      <div className="col-12 col-md-6">
        <h2>{product.title}</h2>
        <p className="text-muted">{product.description || ''}</p>
        <p className="price fs-3">${product.price?.toLocaleString()}</p>
        <p className="text-muted">Stock disponible: {stock}</p>
        
        {isOutOfStock ? (
          <div className="alert alert-warning">
            Producto sin stock
          </div>
        ) : (
          <>
            {!addedToCart ? (
              <ItemCount
                stock={stock}
                initial={1}
                onAdd={handleAddToCart}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            ) : (
              <div className="alert alert-success">
                Producto agregado al carrito
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
