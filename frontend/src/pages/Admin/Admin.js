import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funciones que podés implementar más adelante
  const handleSaveProduct = () => {
    console.log('handleSaveProduct ejecutado');
  };

  const handleUpdateTicketStatus = () => {
    console.log('handleUpdateTicketStatus ejecutado');
  };

  const handleDeleteProduct = () => {
    console.log('handleDeleteProduct ejecutado');
  };

  const handleEditProduct = () => {
    console.log('handleEditProduct ejecutado');
  };

  const handleLogout = () => {
    console.log('handleLogout ejecutado');
  };

  // Simulación de carga
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'productos' ? 'active' : ''}
          onClick={() => setActiveTab('productos')}
        >
          Productos
        </button>
        <button
          className={activeTab === 'tickets' ? 'active' : ''}
          onClick={() => setActiveTab('tickets')}
        >
          Tickets
        </button>
      </div>

      {/* Contenido según tab activo */}
      <div className="tab-content">
        {activeTab === 'productos' && (
          <div>
            <h2>Lista de productos</h2>
            {productos.length === 0 ? (
              <p>No hay productos.</p>
            ) : (
              productos.map((p, i) => <p key={i}>{p.nombre}</p>)
            )}
            <button onClick={handleSaveProduct}>Guardar producto</button>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div>
            <h2>Lista de tickets</h2>
            {tickets.length === 0 ? <p>No hay tickets.</p> : tickets.map((t, i) => <p key={i}>{t.id}</p>)}
            <button onClick={handleUpdateTicketStatus}>Actualizar estado</button>
          </div>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Cerrar sesión
      </button>
    </div>
  );
};

export default Admin;


