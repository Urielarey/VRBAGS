/**
 * EJEMPLOS DE USO - Sistema de Autenticación
 * 
 * Estos son ejemplos prácticos de cómo usar el AuthContext
 * en diferentes escenarios de la aplicación
 */

// ============================================================
// 1. COMPONENTE CON VERIFICACIÓN DE ROL
// ============================================================

import { useAuth } from './context/AuthContext';

function MiComponente() {
  const { user, isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <div>Por favor inicia sesión</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {user.first_name}</h1>
      <p>Email: {user.email}</p>
      
      {isAdmin() && (
        <section>
          <h2>Sección de Administrador</h2>
          <button>Gestionar productos</button>
        </section>
      )}
    </div>
  );
}

// ============================================================
// 2. LOGIN CON REDIRECCIÓN SEGÚN ROL
// ============================================================

import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    
    if (result.success) {
      // Redirigir según el rol
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/catalog');
      }
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        type="email"
      />
      <input 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        type="password"
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}

// ============================================================
// 3. LOGOUT
// ============================================================

function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    // También remover carrito si lo deseas
    localStorage.removeItem('localCart');
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
}

// ============================================================
// 4. CONDITIONAL RENDERING CON MÚLTIPLES ROLES
// ============================================================

function Dashboard() {
  const { hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {hasRole('admin') && (
        <section>
          <h2>Panel de Admin</h2>
          {/* Contenido admin */}
        </section>
      )}

      {hasRole('user') && (
        <section>
          <h2>Mi Cuenta</h2>
          {/* Contenido user */}
        </section>
      )}
    </div>
  );
}

// ============================================================
// 5. COMPONENTE QUE REQUIERE AUTENTICACIÓN
// ============================================================

function CarroDeCompras() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return (
      <div className="alert">
        <p>Debes iniciar sesión para ver tu carrito</p>
        <Link to="/login">Ir a login</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Mostrar carrito */}
    </div>
  );
}

// ============================================================
// 6. HEADER DINÁMICO SEGÚN AUTENTICACIÓN
// ============================================================

function HeaderDinamico() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <header>
      <h1>Mi Sitio</h1>
      
      {isAuthenticated() ? (
        <div>
          <span>Hola, {user.first_name}</span>
          {isAdmin() && <badge>Admin</badge>}
          <button>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/login?tab=login">Login</Link>
          <Link to="/login?tab=register">Registro</Link>
        </div>
      )}
    </header>
  );
}

// ============================================================
// 7. ACTUALIZAR DATOS DEL USUARIO
// ============================================================

async function ActualizarPerfil() {
  const { user, setError } = useAuth();
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: 'Nuevo Nombre',
        age: 25
      })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar');
    }

    // Actualizar localStorage manualmente o hacer logout/login
    const updatedUser = await response.json();
    localStorage.setItem('user', JSON.stringify(updatedUser.payload));
    
  } catch (error) {
    setError(error.message);
  }
}

// ============================================================
// 8. PROTEGER RUTAS EN APP.JS
// ============================================================

import { PrivateRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Rutas privadas (solo autenticados) */}
      <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

      {/* Rutas solo admin */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
    </Routes>
  );
}

// ============================================================
// 9. LLAMADAS A API AUTENTICADAS
// ============================================================

import axios from 'axios';

function ComponenteConCalls() {
  const { isAuthenticated } = useAuth();

  const fetchUserData = async () => {
    if (!isAuthenticated()) return;

    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get('/api/auth/current', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response.data.payload);
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expirado - logout automático
        logout();
        navigate('/login');
      }
    }
  };

  return <button onClick={fetchUserData}>Cargar datos</button>;
}

// ============================================================
// 10. MODO LOADING DURANTE AUTENTICACIÓN
// ============================================================

function AppLayout() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loader">Cargando...</div>;
  }

  return (
    <>
      <NavBar />
      <main>{/* contenido */}</main>
      <Footer />
    </>
  );
}

// ============================================================
// USO EN BACKEND: Middleware de Protección
// ============================================================

/**
 * En backend/routes/api/products.js
 * 
 * const { authenticate, authorize } = require('middleware/auth');
 * 
 * // Solo admin puede crear
 * router.post('/', authenticate, authorize('admin'), productController.create);
 * 
 * // Solo admin puede editar
 * router.put('/:id', authenticate, authorize('admin'), productController.update);
 * 
 * // Solo admin puede eliminar
 * router.delete('/:id', authenticate, authorize('admin'), productController.delete);
 * 
 * // Todos autenticados pueden obtener sus datos
 * router.get('/mis-datos', authenticate, userController.getCurrentUser);
 */

// ============================================================
// CHECKLIST DE IMPLEMENTACIÓN
// ============================================================

/*
✅ AuthContext creado y funciona
✅ ProtectedRoute implementado
✅ NavBar actualizado con dropdown "Mi cuenta"
✅ Login integrado con AuthContext
✅ Routes protegidas en App.js
✅ Admin.js verifica rol desde servidor
✅ Middleware de autorización en backend
✅ Documentación completa

📋 Próximos pasos opcionales:
  - Refresh tokens
  - Email verification
  - 2FA
  - Audit logs
  - Rate limiting
*/
