import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para productos
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  
  // Estados para formulario
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si es admin (este control ya está en ProtectedRoute, pero es defensa adicional)
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate, isAdmin]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar productos
      const prodResponse = await axios.get('http://localhost:3000/api/products?limit=100', getAuthHeaders());
      if (prodResponse.data.status === 'success') {
        setProducts(prodResponse.data.payload);
      }
      
      // Cargar tickets (admin - todos los tickets)
      try {
        const ticketResponse = await axios.get('http://localhost:3000/api/tickets/all', getAuthHeaders());
        if (ticketResponse.data.status === 'success') {
          setTickets(ticketResponse.data.payload || []);
        }
      } catch (err) {
        console.error('Error cargando tickets:', err);
        setTickets([]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear/Actualizar producto
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
        // Actualizar
        await axios.put(`http://localhost:3000/api/products/${editingProduct._id}`, dataToSend, getAuthHeaders());
        alert('✅ Producto actualizado');
      } else {
        // Crear
        await axios.post('http://localhost:3000/api/products', dataToSend, getAuthHeaders());
        alert('✅ Producto creado');
      }
      
      // Recargar y limpiar
      resetForm();
      loadData();
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.message || error.message);
    }
  };

  // Actualizar estado de un ticket
  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/tickets/${ticketId}/status`,
        { status: newStatus },
        getAuthHeaders()
      );
      // Recargar tickets después de actualizar
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
      await axios.delete(`http://localhost:3000/api/products/${pid}`, getAuthHeaders());
      alert('✅ Producto eliminado');
      loadData();
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.message);
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

  if (!user) {
    return <div className="container mt-5">Cargando...</div>;
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1>Panel de Control - VRBAGS</h1>
        <div className="admin-user-info">
          <span>👤 {user.first_name} {user.last_name} ({user.role.toUpperCase()})</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => { setActiveTab('products'); resetForm(); }}
        >
          📦 Productos ({products.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create-product' ? 'active' : ''}`}
          onClick={() => { setActiveTab('create-product'); resetForm(); }}
        >
          ➕ Nuevo Producto
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🧾 Compras ({tickets.length})
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">⏳ Cargando datos...</div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <section className="admin-section">
                <h2>📊 Dashboard General</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>{products.length}</h3>
                    <p>Productos en catálogo</p>
                    <small className="stat-detail">
                      En stock: {products.filter(p => p.stock > 0).length}
                    </small>
                  </div>

                  <div className="stat-card">
                    <h3>{products.length > 0 ? products.length / 3 : 0}</h3>
                    <p>Categorías</p>
                    <small className="stat-detail">
                      Distribución de productos
                    </small>
                  </div>

                  <div className="stat-card">
                    <h3>${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}</h3>
                    <p>Valor en inventario</p>
                    <small className="stat-detail">
                      Precio x Stock disponible
                    </small>
                  </div>

                  <div className="stat-card">
                    <h3>{tickets.length}</h3>
                    <p>Compras totales</p>
                    <small className="stat-detail">
                      Ingresos: ${tickets.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </small>
                  </div>
                </div>

                {/* Top Products */}
                <div style={{ marginTop: '2rem' }}>
                  <h3>📈 Top 5 Productos por Precio</h3>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .sort((a, b) => b.price - a.price)
                        .slice(0, 5)
                        .map(p => (
                          <tr key={p._id}>
                            <td>{p.title}</td>
                            <td>${p.price.toLocaleString()}</td>
                            <td><span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>{p.stock}</span></td>
                            <td>{p.category}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* PRODUCTOS TAB */}
            {activeTab === 'products' && (
              <section className="admin-section">
                <h2>📦 Gestión de Productos</h2>
                
                <div className="products-admin-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td><strong>{p.title}</strong></td>
                          <td>${p.price.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td>{p.category}</td>
                          <td>
                            <span className={`badge ${p.status ? 'bg-primary' : 'bg-secondary'}`}>
                              {p.status ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-warning me-1"
                              onClick={() => handleEditProduct(p)}
                            >
                              ✏️ Editar
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteProduct(p._id)}
                            >
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* CREAR/EDITAR PRODUCTO TAB */}
            {activeTab === 'create-product' && (
              <section className="admin-section">
                <h2>{editingProduct ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}</h2>
                
                <form onSubmit={handleSaveProduct} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre del producto *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Ej: Bolso Miri Grande"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Código único *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Ej: BOLSO-MIRI-001"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea 
                        className="form-control"
                        rows="3"
                        placeholder="Descripción detallada del producto"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Precio ($) *</label>
                      <input 
                        type="number" 
                        className="form-control"
                        placeholder="5500"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock *</label>
                      <input 
                        type="number" 
                        className="form-control"
                        placeholder="10"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Sección *</label>
                      <select 
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                      >
                        <option value="">-- Seleccionar sección --</option>
                        <option value="miri">Miri</option>
                        <option value="caktus">Caktus</option>
                        <option value="cata">Cata</option>
                        <option value="emilia">Emilia</option>
                        <option value="golfera">Golfera</option>
                        <option value="mini-chini">Mini Chini</option>
                        <option value="mochilas">Mochilas</option>
                        <option value="monederos">Monederos</option>
                        <option value="riñoneras">Riñoneras</option>
                        <option value="paris">Paris</option>
                        <option value="roma">Roma</option>
                        <option value="troya">Troya</option>
                        <option value="iris">Iris</option>
                        <option value="toronto">Toronto</option>
                        <option value="geranio">Geranio</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>URL de imagen</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Ej: /assets/bolso-miri.jpg"
                        value={formData.thumbnails}
                        onChange={(e) => setFormData({...formData, thumbnails: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Estado</label>
                      <select 
                        className="form-control"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value === 'true'})}
                      >
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-lg">
                      {editingProduct ? '✏️ Actualizar' : '➕ Crear'}
                    </button>
                    {editingProduct && (
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-lg"
                        onClick={resetForm}
                      >
                        ❌ Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </section>
            )}

            {/* COMPRAS/TICKETS TAB */}
            {activeTab === 'tickets' && (
              <section className="admin-section">
                <h2>🧾 Historial de Compras</h2>
                
                {tickets.length === 0 ? (
                  <div className="alert alert-info">
                    📭 No hay compras registradas aún
                  </div>
                ) : (
                  <div className="products-admin-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Comprador</th>
                          <th>Email</th>
                          <th>Total</th>
                          <th>Productos</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map(t => {
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
                              default: return status;
                            }
                          };

                          return (
                            <tr key={t.id || t._id}>
                              <td><strong>{t.code}</strong></td>
                              <td>{t.purchaser}</td>
                              <td>
                                <small className="text-muted">
                                  {t.purchaserEmail || 'N/A'}
                                </small>
                              </td>
                              <td>${t.amount.toLocaleString()}</td>
                              <td>
                                <span className="badge bg-info">
                                  {t.products?.length || 0} items
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadgeClass(t.status || 'pendiente')}`}>
                                  {getStatusLabel(t.status || 'pendiente')}
                                </span>
                              </td>
                              <td>{new Date(t.purchase_datetime).toLocaleDateString()}</td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={t.status || 'pendiente'}
                                  onChange={(e) => handleUpdateTicketStatus(t.id || t._id, e.target.value)}
                                  style={{ minWidth: '150px' }}
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="en_proceso">En Proceso</option>
                                  <option value="en_camino">En Camino</option>
                                  <option value="rechazado">Rechazado</option>
                                  <option value="entregado">Entregado</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
