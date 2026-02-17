import React, { useState, useEffect } from 'react';

const Admin = () => {
  // Estados
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, _setProductos] = useState([]);
  const [tickets, _setTickets] = useState([]);
  const [loading, _setLoading] = useState(false);

  // Funciones (todavía sin usar)
  const handleSaveProduct = () => {
    console.log('handleSaveProduct llamado');
  };

  const handleUpdateTicketStatus = () => {
    console.log('handleUpdateTicketStatus llamado');
  };

  const handleDeleteProduct = () => {
    console.log('handleDeleteProduct llamado');
  };

  const handleEditProduct = () => {
    console.log('handleEditProduct llamado');
  };

  const handleLogout = () => {
    console.log('handleLogout llamado');
  };

  // Para evitar errores de ESLint en variables sin usar
  useEffect(() => {
    console.log({
      activeTab,
      productos,
      tickets,
      loading,
      handleSaveProduct,
      handleUpdateTicketStatus,
      handleDeleteProduct,
      handleEditProduct,
      handleLogout
    });
  }, []);

  return (
    <div>
      <h1>Panel de Admin</h1>
      <p>Este es un placeholder temporal para que compile en Vercel.</p>
    </div>
  );
};

export default Admin;
