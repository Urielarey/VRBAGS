import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('productos'); // para controlar pestañas
  const [productos, setProductos] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // para errores de autenticación

  const token = localStorage.getItem('token'); // tu token de admin

  // Fetch de tickets
  const fetchTickets = async () => {
    if (!token) {
      setError('Debes iniciar sesión');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('/api/tickets/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('No autorizado. Inicia sesión.');
      } else {
        setError('Error cargando tickets.');
      }
      console.error('Error cargando tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch de productos
  const fetchProductos = async () => {
    if (!token) {
      setError('Debes iniciar sesión');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(response.data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('No autorizado. Inicia sesión.');
      } else {
        setError('Error cargando productos.');
      }
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchTickets();
  }, []); // sin dependencias innecesarias

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Panel Admin</h1>
      <div>
        <button onClick={() => setActiveTab('productos')}>Productos</button>
        <button onClick={() => setActiveTab('tickets')}>Tickets</button>
      </div>

      {activeTab === 'productos' && (
        <div>
          <h2>Productos</h2>
          <ul>
            {productos.map((p) => (
              <li key={p._id}>{p.nombre}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div>
          <h2>Tickets</h2>
          <ul>
            {tickets.map((t) => (
              <li key={t._id}>{t.descripcion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Admin;
