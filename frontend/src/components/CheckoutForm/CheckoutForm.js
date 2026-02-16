import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import './CheckoutForm.css';

const CheckoutForm = () => {
  const { cartItems, getTotal, cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    metodoPago: 'Transferencia',
    tipoEnvio: 'Envío a domicilio',
    detalleEnvio: '',
    notas: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('=== INICIO handleSubmit ===');
      console.log('cartItems:', cartItems);
      console.log('cart:', cart);
      console.log('cartItems length:', cartItems.length);
      console.log('cartItems detalle:', JSON.stringify(cartItems, null, 2));
      
      const token = localStorage.getItem('token');
      const email = formData.email.trim().toLowerCase();
      
      // Crear ticket (con o sin autenticación)
      if (cart && token) {
        // Usuario logueado: crear ticket normal
        await axios.post(
          `${API_URL}/tickets`,
          { cartId: cart.id, purchaser: email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (cartItems.length > 0) {
        // Usuario NO logueado: crear ticket con email
        console.log('CartItems recibidos:', cartItems);
        
        const productsData = cartItems.map((item, index) => {
          try {
            console.log(`Procesando item ${index}:`, item);
            
            // Manejar diferentes formatos de producto
            let product = item.product;
            if (!product || (typeof product === 'object' && Object.keys(product).length === 0)) {
              console.error(`Item ${index} sin producto válido:`, item);
              return null;
            }
            
            // Si product es un string (ID directo)
            if (typeof product === 'string' && product.trim().length > 0) {
              const price = item.price || 0;
              console.log(`Item ${index} - Producto es string ID:`, product, 'Precio:', price);
              return {
                product: product.trim(),
                quantity: item.quantity || 1,
                price: price
              };
            }
            
            // Si product es un objeto, extraer ID
            let productId = product._id || product.id;
            
            // Si productId es un objeto, extraer el _id
            if (productId && typeof productId === 'object') {
              productId = productId._id || productId.id;
            }
            
            // Validar que productId sea válido (string no vacío o ObjectId válido)
            if (!productId || (typeof productId === 'string' && productId.trim().length === 0)) {
              console.error(`Producto ${index} sin ID válido:`, {
                product,
                productId,
                itemCompleto: item
              });
              return null;
            }
            
            const finalProductId = String(productId).trim();
            const finalPrice = product.price || item.price || 0;
            const finalQuantity = item.quantity || 1;
            
            console.log(`Item ${index} procesado correctamente:`, {
              productId: finalProductId,
              quantity: finalQuantity,
              price: finalPrice
            });
            
            return {
              product: finalProductId,
              quantity: finalQuantity,
              price: finalPrice
            };
          } catch (error) {
            console.error(`Error procesando item ${index}:`, error, item);
            return null;
          }
        }).filter(item => {
          // Filtrar productos sin ID válido - validación más estricta
          const isValid = item && item.product && String(item.product).trim().length > 0;
          if (!isValid) {
            console.error('Item filtrado por ser inválido:', item);
          }
          return isValid;
        });
        
        if (productsData.length === 0) {
          throw new Error('No hay productos válidos en el carrito. Por favor, agrega productos nuevamente.');
        }
        
        const totalAmount = cartItems.reduce((sum, item) => {
          const product = typeof item.product === 'object' ? item.product : {};
          return sum + ((product.price || 0) * (item.quantity || 1));
        }, 0);

        console.log('Enviando datos al backend:', {
          purchaser: email,
          purchaserName: formData.nombreCompleto,
          amount: totalAmount,
          productsCount: productsData.length,
          products: productsData
        });

        await axios.post(
          `${API_URL}/tickets/guest`,
          {
            purchaser: email,
            purchaserName: formData.nombreCompleto,
            amount: totalAmount,
            products: productsData
          }
        );
      }

      // Construir mensaje de WhatsApp con el formato solicitado
      const productosTexto = cartItems.map((item) => {
        const product = typeof item.product === 'object' ? item.product : {};
        const precio = product.price || 0;
        const cantidad = item.quantity || 1;
        const subtotal = precio * cantidad;
        return `${product.title || 'Producto'}, cantidad: ${cantidad}, precio: $${subtotal.toLocaleString()}`;
      }).join(' | ');

      const envioTexto = `${formData.tipoEnvio}, ${formData.detalleEnvio || 'sin dirección especificada'}`;
      const pagoTexto = formData.metodoPago;

      const mensaje = `Hola soy ${formData.nombreCompleto} y quiero comprar ${productosTexto} (${envioTexto}) (${pagoTexto})`;
      
      const numero = '5491168666761'; // Formato internacional para WhatsApp
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

      clearCart();
      window.open(url, '_blank');
      navigate('/');
    } catch (error) {
      console.error('Error procesando compra:', error);
      alert('Error al procesar la compra. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Finalizar compra</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre y apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                  />
                  <small className="form-text text-muted">Si te registras después, podrás ver tus pedidos aquí</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Método de pago</label>
                  <select
                    className="form-select"
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    required
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Mercado Pago">Mercado Pago</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Envío o retiro</label>
                  <select
                    className="form-select"
                    name="tipoEnvio"
                    value={formData.tipoEnvio}
                    onChange={handleChange}
                    required
                  >
                    <option value="Envío a domicilio">Envío a domicilio</option>
                    <option value="Retiro en sucursal">Retiro en sucursal</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección / Detalle</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="detalleEnvio"
                    value={formData.detalleEnvio}
                    onChange={handleChange}
                    placeholder="Dirección, localidad o punto de retiro"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notas (opcional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    placeholder="Instrucciones o comentarios"
                  />
                </div>
                <div className="alert alert-light border mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Productos</span>
                    <strong>{cartItems.length}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total</span>
                    <strong>${getTotal().toLocaleString()}</strong>
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Enviar por WhatsApp'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
