# ✅ CHECKLIST - Sistema de Autenticación

## 📦 Archivos Creados/Modificados

### ✅ Frontend - Nuevos Archivos
- [x] `frontend/src/context/AuthContext.js` - Context de autenticación global
- [x] `frontend/src/components/ProtectedRoute/ProtectedRoute.js` - Componentes para proteger rutas

### ✅ Frontend - Archivos Modificados
- [x] `frontend/src/App.js` - Agregadas rutas protegidas y AuthProvider
- [x] `frontend/src/pages/Login/Login.js` - Integrado con AuthContext
- [x] `frontend/src/components/NavBar/NavBar.js` - Dropdown "Mi cuenta" implementado
- [x] `frontend/src/components/NavBar/NavBar.css` - Estilos para dropdown
- [x] `frontend/src/pages/Admin/Admin.js` - Verificación de rol mejorada

### ✅ Backend - Ya Implementados
- [x] `backend/middleware/auth.js` - Middleware de autenticación y autorización
- [x] `backend/routes/api/products.js` - Rutas protegidas por rol

---

## 🧪 Pruebas de Funcionalidad

### 1️⃣ Usuario NO Autenticado
- [ ] Navegar a la app sin estar logueado
- [ ] Ver "👤 Mi cuenta" en navbar
- [ ] Click en "Mi cuenta" → dropdown con "Iniciar sesión" y "Registrarse"
- [ ] NO debe haber opción "Panel de control"
- [ ] Intentar acceder a `/admin` → redirige a `/login`
- [ ] Intentar acceder a `/cart` → redirige a `/login`

### 2️⃣ Registro Nuevo Usuario
- [ ] Click en "✏️ Registrarse"
- [ ] Rellenar formulario (nombre, apellido, email, edad, password)
- [ ] Confirmar contraseña
- [ ] Click en "Registrarse"
- [ ] Redirecciona a `/catalog` automáticamente
- [ ] Usuario aparece en navbar como "👤 {Nombre}"
- [ ] Rol asignado es "user" en base de datos

### 3️⃣ Login Usuario Regular (role: user)
- [ ] Click en "👤 Mi cuenta"
- [ ] Click en "🔓 Iniciar sesión"
- [ ] Ingresar email y password
- [ ] Click en "Ingresar"
- [ ] Redirecciona a `/catalog`
- [ ] Dropdown muestra:
  - [ ] 📦 Mis pedidos
  - [ ] 🚪 Cerrar sesión
  - [ ] ❌ NO debe aparecer "⚙️ Panel de control"

### 4️⃣ Convertir Usuario a Admin
```bash
# En terminal, en la carpeta raíz del proyecto
cd backend
node scripts/upgradeToAdmin.js
```
- [ ] Script ejecuta exitosamente
- [ ] Usuario ahora es admin en MongoDB

### 5️⃣ Login Usuario Admin
- [ ] Hacer logout del usuario anterior (si aplica)
- [ ] Clear localStorage en consola: `localStorage.clear()`
- [ ] Recargar página
- [ ] Login con usuario admin
- [ ] Dropdown muestra:
  - [ ] 📦 Mis pedidos
  - [ ] ⚙️ Panel de control ← Visible solo para admin
  - [ ] 🚪 Cerrar sesión

### 6️⃣ Acceder al Panel Admin
- [ ] Logueado como admin
- [ ] Click en "👤 {Nombre}"
- [ ] Click en "⚙️ Panel de control"
- [ ] Se abre página `/admin` sin errores
- [ ] Se cargan productos exitosamente
- [ ] Botones de crear, editar, eliminar funcionan

### 7️⃣ Protección de Rutas
- [ ] Logueado como admin
- [ ] Acceder a `http://localhost:3001/admin` → funciona
- [ ] Logout
- [ ] Intentar acceder a `/admin` → redirige a `/login`
- [ ] Intentar acceder a `/cart` → redirige a `/login`
- [ ] Login como user (no admin)
- [ ] Intentar acceder a `/admin` → redirige a `/`

### 8️⃣ Crear Producto (Como Admin)
- [ ] Logueado como admin
- [ ] Ir a Panel Admin → pestaña "Crear Producto"
- [ ] Rellenar formulario
- [ ] Click en "Crear"
- [ ] ✅ Producto creado exitosamente
- [ ] Aparece en la lista de productos

### 9️⃣ Editar Producto (Como Admin)
- [ ] En Panel Admin, click en "✏️ Editar" en un producto
- [ ] Modificar datos
- [ ] Click en "Actualizar"
- [ ] ✅ Producto actualizado exitosamente

### 🔟 Eliminar Producto (Como Admin)
- [ ] En Panel Admin, click en "🗑️ Eliminar"
- [ ] Confirmar eliminación
- [ ] ✅ Producto eliminado exitosamente

### 1️⃣1️⃣ Permiso Denegado
- [ ] Logueado como user (NO admin)
- [ ] En consola: intentar hacer POST a `/api/products` con datos
- [ ] Respuesta: 403 "No tienes permisos para realizar esta acción"
- [ ] Request a `/admin` en URL
- [ ] Redirecciona a `/`

### 1️⃣2️⃣ Logout
- [ ] Click en dropdown "Mi cuenta"
- [ ] Click en "🚪 Cerrar sesión"
- [ ] localStorage se limpia
- [ ] User se vuelve null
- [ ] Dropdown vuelve a mostrar "Iniciar sesión" y "Registrarse"
- [ ] Redirecciona a `/`

---

## 🔍 Verificación Técnica

### Frontend
- [ ] `localStorage.getItem('token')` contiene JWT
- [ ] `localStorage.getItem('user')` contiene objeto de usuario con `role`
- [ ] AuthContext se instancia correctamente en App.js
- [ ] No hay errores en consola al cambiar de rol
- [ ] NavBar se actualiza cuando cambia el usuario

### Backend
- [ ] Rutas de productos tienen middleware `authorize('admin')`
- [ ] GET `/api/auth/current` devuelve usuario autenticado
- [ ] POST `/api/products` devuelve 403 si no es admin
- [ ] PUT y DELETE también requieren admin

### Base de Datos
```javascript
// Verificar usuario admin
db.users.findOne({ email: 'email@example.com' });
// Debe mostrar: role: "admin"

// Verificar usuario regular
db.users.findOne({ email: 'otro@example.com' });
// Debe mostrar: role: "user"
```

---

## 🐛 Solucionar Problemas

### Panel Admin no aparece después de hacer upgrade
**Problema:** Usuario es admin pero panel no aparece en navbar
**Solución:**
```javascript
// En consola del navegador
localStorage.clear();
location.reload();
// Hace login de nuevo
```

### Error 403 al crear producto siendo admin
**Problema:** Dice "No tienes permisos"
**Solución:**
1. Verificar que el token está en `Authorization: Bearer {token}`
2. Verificar que la base de datos dice que el usuario es admin
3. Hacer logout y login nuevamente

### Routes no protegidas
**Problema:** Puede acceder a `/admin` sin estar logueado
**Verificar:**
```javascript
// En App.js
import { AdminRoute } from './components/ProtectedRoute/ProtectedRoute';
<Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
// ☝️ Debe estar envuelto en AdminRoute
```

### NavBar no muestra usuario después de login
**Problema:** Dice "Mi cuenta" pero no muestra el nombre
**Verificar:**
1. `localStorage.getItem('user')` existe
2. El objeto tiene `first_name`
3. Refrescar página

---

## 📊 Matriz de Permisos

| Acción | Guest | User | Admin |
|--------|-------|------|-------|
| Ver tienda | ✅ | ✅ | ✅ |
| Ver producto | ✅ | ✅ | ✅ |
| Agregar carrito | ❌ | ✅ | ✅ |
| Comprar | ❌ | ✅ | ✅ |
| Ver mis pedidos | ❌ | ✅ | ✅ |
| Panel admin | ❌ | ❌ | ✅ |
| Crear producto | ❌ | ❌ | ✅ |
| Editar producto | ❌ | ❌ | ✅ |
| Eliminar producto | ❌ | ❌ | ✅ |
| Ver usuarios | ❌ | ❌ | ✅ |

---

## 🚀 Deployment Checklist

Antes de ir a producción:

- [ ] HTTPS habilitado (no HTTP)
- [ ] `JWT_SECRET` es fuerte y único
- [ ] `CORS` configurado correctamente
- [ ] Rate limiting implementado
- [ ] Validación de entrada en frontend Y backend
- [ ] No hay console.log() con datos sensibles
- [ ] Tokens no expuestos en URL
- [ ] Contraseñas hasheadas con bcrypt
- [ ] CSRF protection (si aplica)
- [ ] Audit logs implementado (opcional)

---

## 📞 Soporte

Si algo no funciona:

1. Buscar en "Troubleshooting" arriba
2. Verificar red en DevTools (Network tab)
3. Revisar console (F12 Console)
4. Revisar backend logs
5. Verificar archivo `.env` tiene todas las variables necesarias

---

**✨ Sistema listo para usar. ¡Felicidades!**
