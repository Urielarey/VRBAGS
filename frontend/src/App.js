import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute, AdminRoute } from './components/ProtectedRoute/ProtectedRoute';
import NavBar from './components/NavBar/NavBar';
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer';
import Cart from './components/Cart/Cart';
import CheckoutForm from './components/CheckoutForm/CheckoutForm';
import ScrollUpButton from './components/ScrollUpButton/ScrollUpButton';
import Home from './pages/Home/Home';
import Tienda from './pages/Tienda/Tienda';
import Contact from './pages/Contact/Contact';
import Help from './pages/Help/Help';
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';
import Debug from './pages/Debug/Debug';
import MisPedidos from './pages/MisPedidos/MisPedidos';
import Footer from './components/Footer/Footer';
import './App.css';
import './pages/MisPedidos/MisPedidos.css';

function App() {
  useEffect(() => {
    // Inicializar AOS cuando la app se monta
    if (window.AOS) {
      window.AOS.init();
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App" id="top">
            <ScrollUpButton />
            <header>
              <NavBar />
            </header>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/debug" element={<Debug />} />
              
              {/* Rutas de autenticación (solo no autenticados) */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              
              {/* Rutas protegidas (usuarios autenticados) */}
              <Route path="/catalog" element={<Tienda />} />
              <Route path="/catalog/:category" element={<Tienda />} />
              <Route path="/product/:pid" element={<ItemDetailContainer />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/mis-pedidos" element={<PrivateRoute><MisPedidos /></PrivateRoute>} />
              
              {/* Ruta de Admin (solo admin) */}
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
