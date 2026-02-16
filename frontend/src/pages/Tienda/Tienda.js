import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/Loader/Loader';
import './Tienda.css';

const Tienda = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_URL = 'http://localhost:3000/api';
        const response = await axios.get(`${API_URL}/products?limit=100`);
        
        if (response.data.status === 'success') {
          const productsData = response.data.payload || [];
          setProducts(productsData);
          
          // Agrupar productos por categoría (manejar productos sin categoría)
          const grouped = {};
          productsData.forEach(product => {
            // Manejar productos sin categoría o con categoría inválida
            const category = product.category && product.category.trim() !== '' 
              ? product.category.trim() 
              : 'Sin categoría';
            
            if (!grouped[category]) {
              grouped[category] = [];
            }
            grouped[category].push(product);
          });
          setGroupedProducts(grouped);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (product) => {
    // thumbnails es garantizado ser un array por el DTO
    if (product.thumbnails && Array.isArray(product.thumbnails) && product.thumbnails.length > 0) {
      return product.thumbnails[0];
    }
    return '/assets/VR BAGS.png';
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const categories = Object.entries(groupedProducts);
  
  if (categories.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">No hay productos disponibles</div>
      </div>
    );
  }

  return (
    <>
      <main className="main-tienda">
        <div className="container">
          <section className="text-center mb-5">
            <h1 className="display-4 fw-bold h2">TIENDA</h1>
            <p className="lead">Descubrí nuestra colección de bolsos y carteras</p>
            <div className="alert alert-info mx-auto pimg alert-shop">
              Consultar precios y colores
            </div>
          </section>

          {categories.map(([category, categoryProducts]) => {
            // Generar ID seguro para la sección
            const sectionId = category && typeof category === 'string' 
              ? category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
              : 'sin-categoria';
            
            return (
            <section 
              key={category || 'sin-categoria'} 
              id={sectionId}
              className="products-section" 
              data-aos="fade-up"
            >
              <h2 className="category-title">{category || 'Sin categoría'}</h2>
              <div className="row g-4">
                {categoryProducts.map((product) => (
                  <div key={product._id || product.id || Math.random()} className="col-12 col-md-6 col-lg-4">
                    <div className="card product-card h-100">
                      <img 
                        src={getImageUrl(product)} 
                        className="card-img-top product-image" 
                        alt={product.title}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">{product.description || ''}</p>
                        <p className="price">${product.price?.toLocaleString()}</p>
                        <Link 
                          to={`/product/${product._id || product.id}`}
                          className="btn btn-primary add-to-cart-btn"
                        >
                          Ver Detalle
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            );
          })}
        </div>
      </main>
      <div style={{paddingBottom: '30px'}}></div>
    </>
  );
};

export default Tienda;
