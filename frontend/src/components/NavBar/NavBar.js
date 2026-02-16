import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CartWidget from '../CartWidget/CartWidget';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  // Cerrar dropdown al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountMenu]);

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowAccountMenu(false);
  };

  return (
    <>
      <article className="u-envios">
        <h6>Envío a todo el país 🚚</h6>
      </article>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">VRBAGS</Link>
          <Link
            className="navbar-brand ms-auto d-lg-none position-relative"
            to="/cart"
          >
            <img
              src="/assets/carrito2.PNG"
              alt="Carrito"
              width="30"
              height="24"
            />
            <CartWidget />
          </Link>
          <button
            aria-label="menu"
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  aria-label="inicio" 
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                  to="/"
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`} 
                  to="/catalog"
                >
                  Tienda
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  aria-label="contacto" 
                  className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} 
                  to="/contact"
                >
                  Contacto
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/help' ? 'active' : ''}`} 
                  to="/help"
                >
                  Ayuda
                </Link>
              </li>
            </ul>
            <Link
              className="navbar-brand d-none d-lg-block position-relative"
              to="/cart"
            >
              <img
                src="/assets/carrito2.PNG"
                alt="Carrito"
                width="30"
                height="24"
              />
              <CartWidget />
            </Link>

            {/* Dropdown de Mi Cuenta */}
            <div 
              ref={menuRef}
              className="nav-account-dropdown position-relative ms-3"
            >
              <button
                className="btn btn-sm btn-dark nav-account-btn"
                type="button"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              >
                <span className="account-text">
                  {loading ? 'Cargando...' : (isAuthenticated() ? user?.first_name || 'Mi cuenta' : 'Mi cuenta')}
                </span>
              </button>

              {showAccountMenu && (
                <div className="account-menu show">
                  {isAuthenticated() ? (
                    <>
                      <div className="account-menu-header">
                        <small>{user?.email}</small>
                      </div>
                      <hr className="my-2" />
                      <button 
                        className="account-menu-item"
                        onClick={() => handleNavigate('/mis-pedidos')}
                        type="button"
                      >
                        📦 Mis pedidos
                      </button>
                      {isAdmin() && (
                        <button 
                          className="account-menu-item admin-item"
                          onClick={() => handleNavigate('/admin')}
                          type="button"
                        >
                          ⚙️ Panel de control
                        </button>
                      )}
                      <hr className="my-2" />
                      <button 
                        className="account-menu-item logout-item"
                        onClick={handleLogout}
                        type="button"
                      >
                        🚪 Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        className="account-menu-item"
                        to="/login?tab=login"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        🔓 Iniciar sesión
                      </Link>
                      <Link 
                        className="account-menu-item"
                        to="/login?tab=register"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        ✏️ Registrarse
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

