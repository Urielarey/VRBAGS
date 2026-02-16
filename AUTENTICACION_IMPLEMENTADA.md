# Sistema de Autenticación con Roles - Guía Completa

## 📋 Resumen de Implementación

Se ha implementado un sistema de autenticación profesional con roles (user/admin) que incluye:

### ✅ Frontend
1. **AuthContext** - Gestión global del estado de autenticación
2. **ProtectedRoute** - Componentes para proteger rutas por rol
3. **NavBar mejorado** - Dropdown "Mi cuenta" sin exponer el panel admin
4. **Login integrado** - Login/Register usando AuthContext

### ✅ Backend
1. **Middleware de autenticación** - Verificación JWT
2. **Middleware de autorización** - Control por roles
3. **Rutas protegidas** - POST, PUT, DELETE requieren admin

---

## 🔐 Flujo de Autenticación

### Usuario NO autenticado
```
NavBar muestra: 👤 Mi cuenta
   ├─ 🔓 Iniciar sesión
   └─ ✏️ Registrarse
```

### Usuario autenticado (rol: user)
```
NavBar muestra: 👤 {Nombre del usuario}
   ├─ 📦 Mis pedidos
   └─ 🚪 Cerrar sesión
```

### Usuario autenticado (rol: admin)
```
NavBar muestra: 👤 {Nombre del usuario}
   ├─ 📦 Mis pedidos
   ├─ ⚙️ Panel de control  ← Solo visible si es admin
   └─ 🚪 Cerrar sesión
```

---

## 📁 Estructura de Carpetas Creadas

```
frontend/src/
├── context/
│   ├── AuthContext.js (NUEVO)
│   └── CartContext.js
├── components/
│   ├── ProtectedRoute/
│   │   └── ProtectedRoute.js (NUEVO)
│   └── NavBar/
│       └── NavBar.js (ACTUALIZADO)
└── pages/
    ├── Login/
    │   └── Login.js (ACTUALIZADO)
    └── Admin/
        └── Admin.js (ACTUALIZADO)
```

---

## 🛡️ Permisos por Rol

### Usuario (role: user)
✅ Ver catálogo de productos
✅ Agregar productos al carrito
✅ Realizar compras
❌ Acceder a /admin
❌ Crear, editar o eliminar productos
❌ Ver panel de administración

### Admin (role: admin)
✅ Todas las acciones de usuario
✅ Ver panel de administración (/admin)
✅ Crear productos
✅ Editar productos
✅ Eliminar productos
✅ Gestionar stock
✅ Ver estadísticas

---

## 🔄 Rutas Disponibles

### Públicas (sin autenticación)
- `GET /` - Inicio
- `GET /catalog` - Tienda
- `GET /contact` - Contacto
- `GET /help` - Ayuda
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Protegidas (usuarios autenticados)
- `GET /api/auth/current` - Obtener usuario actual
- `GET /cart` - Ver carrito
- `GET /checkout` - Ir a pagar
- `GET /mis-pedidos` - Ver mis pedidos

### Admin Only
- `GET /admin` - Panel de administración
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Editar producto
- `DELETE /api/products/:id` - Eliminar producto

---

## 🎯 Cómo Usar

### 1. Cambiar un usuario a admin (backend)

```bash
cd backend
node scripts/upgradeToAdmin.js
```

### 2. Login en la App

1. Click en "👤 Mi cuenta"
2. Click en "🔓 Iniciar sesión"
3. Ingresar email y contraseña
4. Si es admin, verá "⚙️ Panel de control"

### 3. Acceder al Panel Admin

Una vez admin y logueado:
- Click en "👤 {Nombre}"
- Click en "⚙️ Panel de control"
- O acceder directamente a `/admin`

---

## 🔧 Métodos del AuthContext

```javascript
import { useAuth } from './context/AuthContext';

const { 
  user,              // Objeto del usuario autenticado
  loading,           // True mientras se verifica la sesión
  error,             // Mensaje de error
  login,             // async login(email, password)
  register,          // async register(firstName, lastName, email, age, password)
  logout,            // logout()
  isAuthenticated,   // isAuthenticated() → boolean
  isAdmin,           // isAdmin() → boolean
  hasRole,           // hasRole('user' | 'admin') → boolean
  setError           // Establecer error manualmente
} = useAuth();
```

### Ejemplos de Uso

```javascript
// Verificar si está autenticado
if (isAuthenticated()) {
  // Hacer algo
}

// Verificar si es admin
if (isAdmin()) {
  // Mostrar panel admin
}

// Login
const result = await login('usuario@email.com', 'password');
if (result.success) {
  navigate('/catalog');
} else {
  console.error(result.error);
}

// Logout
const handleLogout = () => {
  logout();
  navigate('/');
};
```

---

## 🛣️ Componentes Protected Route

```javascript
import { PrivateRoute, PublicRoute, AdminRoute } from './components/ProtectedRoute/ProtectedRoute';

// Usar en App.js
<Routes>
  {/* Solo usuarios NO autenticados */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  
  {/* Solo usuarios autenticados */}
  <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
  
  {/* Solo administradores */}
  <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
</Routes>
```

---

## 📊 Estructura de Usuario en localStorage

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 30,
    "role": "user|admin",  // ← Rol del usuario
    "cart": "507f1f77bcf86cd799439012",
    "createdAt": "2024-02-09T10:30:00Z",
    "updatedAt": "2024-02-09T10:30:00Z"
  }
}
```

---

## ⚠️ Seguridad

### Frontend
✅ Las rutas están protegidas por componentes ProtectedRoute
✅ No se muestra el panel admin en el UI para no-admin
✅ Redirecciones automáticas al intentar acceder a rutas protegidas

### Backend
✅ Todo POST, PUT, DELETE en /products requiere JWT
✅ Middleware `authorize('admin')` verifica el rol
✅ Los tokens expiran en 24 horas (configurable)
✅ Las contraseñas están hasheadas con bcrypt

### Recomendaciones
1. Nunca exponer el JWT en la URL
2. Usar HTTPS en producción
3. Validar permisos SIEMPRE en backend
4. No confiar solo en validaciones del frontend

---

## 🐛 Troubleshooting

### Error: "No tienes permisos para realizar esta acción"
- Verificar que el usuario sea admin
- Revisar el rol en MongoDB con: `db.users.findOne({ email: 'user@email.com' })`
- Ejecutar script: `node scripts/upgradeToAdmin.js`

### Panel admin no aparece en NavBar
- Hacer logout y login nuevamente
- Limpiar localStorage: `localStorage.clear()`
- Verificar rol en backend

### Token expirado
- La sesión dura 24 horas por defecto
- Hacer logout y login nuevamente
- Revisar variable `JWT_EXPIRES_IN` en `.env`

---

## 📝 Variables de Entorno Necesarias

```bash
# Backend (.env)
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=24h
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=tu@email.com
EMAIL_PASS=password

# Frontend (.env o .env.local)
REACT_APP_API_URL=http://localhost:3000/api
```

---

## ✨ Siguientes Pasos Opcionales

1. **Implementar refresh tokens** - Para sesiones más largas sin relogin
2. **Email verification** - Verificar email al registrar
3. **2FA (Two-Factor Authentication)** - Seguridad adicional
4. **Roles adicionales** - vendor, moderator, etc.
5. **Auditoría de acciones** - Log de cambios en productos
