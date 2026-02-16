import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../CartItem/CartItem';
import Loader from '../Loader/Loader';
import './Cart.css';

const Cart = () => {
  const { cartItems, loading, getTotal, clearCart } = useCart();

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <main>
        {/* Logo superior unificado */}
        <section className="py-5 text-center">
          <img src="/assets/VR BAGS.png" alt="VRBAGS" style={{width: '280px', maxWidth: '85vw', height: 'auto'}} className="mono"/>
        </section>

        <div className="container">
          <div className="row">
            {/* Lista de productos */}
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-bag text-dark"></i> Productos en el carrito
                  </h5>
                </div>
                <div className="card-body">
                  {!cartItems || cartItems.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <i className="bi bi-cart-x" style={{fontSize: '3rem', color: '#ccc'}}></i>
                      <p className="mt-3">Tu carrito está vacío</p>
                      <Link to="/catalog" className="btn btn-primary">Ir a la tienda</Link>
                    </div>
                  ) : (
                    <div id="carrito-container">
                      {cartItems.map((item) => {
                        const productId = typeof item.product === 'object' 
                          ? (item.product._id || item.product.id || Math.random())
                          : (item.product || Math.random());
                        return <CartItem key={productId} item={item} />;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen del carrito */}
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt text-dark"></i> Resumen de la compra
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal:</span>
                    <span id="subtotal">${getTotal().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Envío:</span>
                    <span className="text-dark">A consultar</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total:</strong>
                    <strong id="total" className="text-dark fs-5">${getTotal().toLocaleString()}</strong>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Link 
                      to="/checkout" 
                      className={`btn checkout-btn text-white ${cartItems.length === 0 ? 'disabled' : ''}`}
                      style={{pointerEvents: cartItems.length === 0 ? 'none' : 'auto', opacity: cartItems.length === 0 ? 0.6 : 1}}
                    >
                      <i className="bi bi-credit-card"></i> Proceder al Pago
                    </Link>
                    
                    <button 
                      className="btn btn-outline-secondary vaciar-carrito"
                      onClick={clearCart}
                      disabled={cartItems.length === 0}
                    >
                      <i className="bi bi-trash"></i> Vaciar Carrito
                    </button>
                    
                    <Link to="/catalog" className="btn btn-outline-dark">
                      <i className="bi bi-arrow-left"></i> Seguir Comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div style={{paddingBottom: '30px'}}></div>
    </>
  );
};

export default Cart;
