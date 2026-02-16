import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ItemList from '../ItemList/ItemList';
import Loader from '../Loader/Loader';
import './ItemListContainer.css';

const ItemListContainer = ({ greeting }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('limit', '20');
        params.append('page', '1');
        
        if (category) {
          params.append('query', `category:${category}`);
        }

        const response = await axios.get(`${API_URL}/products?${params.toString()}`);
        
        if (response.data.status === 'success') {
          setProducts(response.data.payload);
          setPagination({
            totalPages: response.data.totalPages,
            page: response.data.page,
            hasPrevPage: response.data.hasPrevPage,
            hasNextPage: response.data.hasNextPage
          });
        }
      } catch (err) {
        setError('Error cargando productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, API_URL]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container my-5">
      {greeting && <h2 className="text-center mb-4">{greeting}</h2>}
      {category && <h2 className="category-title">{category}</h2>}
      <ItemList products={products} />
    </div>
  );
};

export default ItemListContainer;
