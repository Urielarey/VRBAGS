import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ItemDetail from '../ItemDetail/ItemDetail';
import Loader from '../Loader/Loader';
import './ItemDetailContainer.css';

const ItemDetailContainer = () => {
  const { pid } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${pid}`);
        
        if (response.data.status === 'success') {
          setProduct(response.data.payload);
        }
      } catch (err) {
        setError('Producto no encontrado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (pid) {
      fetchProduct();
    }
  }, [pid, API_URL]);

  if (loading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error || 'Producto no encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ flex: 1, minHeight: '60vh' }}>
      <ItemDetail product={product} />
    </div>
  );
};

export default ItemDetailContainer;
