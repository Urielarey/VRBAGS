import React from 'react';
import Item from '../Item/Item';
import './ItemList.css';

const ItemList = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No hay productos disponibles
      </div>
    );
  }

  return (
    <div className="row g-4">
      {products.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ItemList;
