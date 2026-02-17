import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Admin.css';

// Definimos API_URL seguro para producción y desarrollo
const API_URL =
  process.env.REACT_APP_API_URL || 'https://vrbags-backend-production.up.railway.app';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    price: '',
    stock: '',
    category: '',
    status: true,
    thumbnails: ''
  });

  // Cabeceras con token
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }, []);

  // Cargar productos y tickets
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Productos
      const prodResponse = await axios.get(`${API_URL}/api/products?limit=100`, getAuthHeaders());
      if (prodResponse.data.status === 'success') setProducts(prodResponse.data.payload);

      // Tickets
      try {
        const ticketResponse = await axios.get(`${API_URL}/api/tickets/all`, getAuthHeaders());
        if (ticketResponse.data.status === 'success') setTickets(ticketResponse.data.payload || []);
      } catch (err) {
        console.error('Error cargando tickets:', err);
        setTickets([]);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Verificar admin y cargar data
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate, isAdmin, loadData]);

  // Crear / Actualizar producto
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        thumbnails: formData.thumbnails ? [formData.thumbnails] : []
      };

      if (editingProduct) {
        await axios.put(`${API_URL}/api/products/${editingProduct._id}`, dataToSend, getAuthHeaders());
        alert('✅ Producto actualizado');
      } else {
        await axios.post(`${API_URL}/api/products`, dataToSend, getAuthHeaders());
        alert('✅ Producto creado');
      }

      resetForm();
      loadData();

    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  // Actualizar estado de ticket
  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/tickets/${ticketId}/status`, { status: newStatus }, getAuthHeaders());
      await loadData();
      alert('✅ Estado actualizado correctamente');
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (pid) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      await axios.delete(`${API_URL}/api/products/${pid}`, getAuthHeaders());
      alert('✅ Producto eliminado');
      loadData();
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  // Editar producto
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      status: product.status,
      thumbnails: product.thumbnails?.[0] || ''
    });
    setActiveTab('create-product');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      price: '',
      stock: '',
      category: '',
      status: true,
      thumbnails: ''
    });
    setEditingProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (!user) return <div className="container mt-5">Cargando...</div>;

  return (
    <div className="admin-container">
      {/* Aquí va todo tu JSX original del Admin */}
      {/* Por ejemplo, tabs de Dashboard, Crear Producto, Tickets */}
    </div>
  );
};

export default Admin;

