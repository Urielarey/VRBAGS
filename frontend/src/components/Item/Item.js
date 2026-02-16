import React from 'react';
import { Link } from 'react-router-dom';
import './Item.css';

const Item = ({ product }) => {
  // thumbnails es garantizado ser un array por el DTO
  let imageUrl = '/assets/VR BAGS.png';
  
  if (product.thumbnails && Array.isArray(product.thumbnails) && product.thumbnails.length > 0) {
    imageUrl = product.thumbnails[0];
  }

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card product-card h-100">
        <img 
          src={imageUrl} 
          className="card-img-top product-image" 
          alt={product.title}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description || ''}</p>
          <p className="price">${product.price?.toLocaleString()}</p>
          <Link 
            to={`/product/${product.id}`}
            className="btn btn-primary add-to-cart-btn"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Item;
