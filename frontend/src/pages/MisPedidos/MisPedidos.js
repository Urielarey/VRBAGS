import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import './MisPedidos.css';

const MisPedidos = () => {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        setTickets(response.data.payload || []);
      }
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('Error al cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (isAuthenticated() && user) {
      loadTickets();
    }
  }, [user, isAuthenticated, loadTickets]);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pendiente': return 'bg-secondary';
      case 'en_proceso': return 'bg-primary';
      case 'en_camino': return 'bg-info';
      case 'rechazado': return 'bg-danger';
      case 'entregado': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'en_camino': return 'En Camino';
      case 'rechazado': return 'Rechazado';
      case 'entregado': return 'Entregado';
      default: return status || 'Pendiente';
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="mis-pedidos-page">
        <div className="container mt-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-pedidos-page">
      <div className="container mt-5">
        <h2 className="mb-4">Mis Pedidos</h2>
        
        {tickets.length === 0 ? (
          <div className="alert alert-info">
            No tienes pedidos registrados aún
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket._id || ticket.code} className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Código: {ticket.code}</strong>
                    <small className="d-block text-muted">
                      {new Date(ticket.purchase_datetime).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                    <div className="mt-2">
                      <span className={`badge ${getStatusBadgeClass(ticket.status || 'pendiente')}`}>
                        {getStatusLabel(ticket.status || 'pendiente')}
                      </span>
                    </div>
                  </div>
                  <div className="text-end">
                    <strong className="text-success">${ticket.amount?.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="card-body">
                  <h6>Productos:</h6>
                  <ul className="list-unstyled">
                    {ticket.products?.map((item, index) => (
                      <li key={index} className="mb-2">
                        <strong>{item.product?.title || 'Producto'}</strong> - 
                        Cantidad: {item.quantity} - 
                        Precio unitario: ${item.price?.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;
