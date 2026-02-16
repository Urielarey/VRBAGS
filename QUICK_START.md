# ⚡ QUICK START - Sistema de Autenticación

**Tiempo estimado:** 5 minutos

---

## 1️⃣ Arrancar la Aplicación

```bash
# Terminal 1 - Backend
cd backend
npm start
# Debe mostrar: ✅ MongoDB conectado, Server running on port 3000

# Terminal 2 - Frontend
cd frontend
npm start
# Debe abrir http://localhost:3001 automáticamente
```

---

## 2️⃣ Crear Primer Usuario (Registro)

1. **Click en "👤 Mi cuenta"** en navbar
2. **Click en "✏️ Registrarse"**
3. **Llenar formulario:**
   - Nombre: Juan
   - Apellido: Pérez
   - Email: juan@example.com
   - Edad: 30
   - Contraseña: password123
   - Confirmar: password123
4. **Click "Registrarse"**
5. ✅ Se redirecciona a /catalog automáticamente

---

## 3️⃣ Convertir Usuario a Admin

```bash
# En una terminal (no cerrar las anteriores)
cd backend
node scripts/upgradeToAdmin.js
```

✅ Mensaje de éxito mostrado en terminal

---

## 4️⃣ Login y Ver Panel Admin

1. **Hacer Logout** (click en user → "🚪 Cerrar sesión")
2. **Click en "👤 Mi cuenta"**
3. **Click en "🔓 Iniciar sesión"**
4. **Ingresar:**
   - Email: juan@example.com
   - Password: password123
5. **Click "Ingresar"**
6. ✅ Se redirecciona a /admin automáticamente
7. ✅ Puedes ver "⚙️ Panel de control" en dropdown de "Mi cuenta"

---

## 5️⃣ Usar Admin Panel

### Crear Producto
```
1. Click en "Crear Producto"
2. Llenar:
   - Título: Mi Bolso Premium
   - Descripción: Bolso de cuero de buena calidad
   - Código: BOLSO001
   - Precio: 150.00
   - Stock: 10
   - Categoría: Bolsos
   - Imagen: URL de imagen
3. Click "Crear Producto"
4. ✅ Mensaje de éxito
5. Abre /catalog y verás el producto nuevo
```

### Editar Producto
```
1. Ir a pestaña "Productos"
2. Click en "✏️ Editar" en un producto
3. Modificar datos
4. Click "Actualizar"
5. ✅ Producto actualizado
```

### Eliminar Producto
```
1. Ir a pestaña "Productos"
2. Click en "🗑️ Eliminar"
3. Confirmar en el popup
4. ✅ Producto eliminado
```

---

## 6️⃣ Pruebas de Seguridad

### ✅ Usuario Regular No Puede Acceder a Admin
```
1. Logout (cerrar sesión)
2. Registrarse con usuario normal
   - Email: user@example.com
   - Password: password456
3. Intentar acceder a http://localhost:3001/admin
4. ❌ Se redirecciona a / (home)
5. En dropdown "Mi cuenta" NO aparece "Panel de control"
```

### ✅ Usuario NO Autenticado No Puede Ver Carrito
```
1. Click en carrito
2. ❌ Se redirecciona a /login
3. ✅ Debe loguearse primero
```

### ✅ API Rechaza Requests Sin Token
```
Open DevTools (F12) → Network tab

1. Click "Crear Producto" como admin
2. Busca POST a /api/products
3. Headers → Authorization: Bearer {token}
4. Si intentas sin token → Error 401
```

---

## 📊 Estado Actual de la App

### Usuarios en BD
```javascript
{
  "usuario": "juan@example.com",
  "nombre": "Juan Pérez",
  "rol": "admin",        // ← Convertido a admin
  "carrito": { ...}
}

{
  "usuario": "user@example.com",
  "nombre": "Usuario Regular",
  "rol": "user",         // ← Usuario normal
  "carrito": { ...}
}
```

### Sistema de Permisos
```javascript
// ✅ Cualquiera puede:
GET /api/products          // Ver productos

// 🔐 Solo usuarios autenticados:
GET /api/auth/current      // Su información
POST /api/carts            // Crear carrito
POST /api/carts/:id/products  // Agregar al carrito

// 👑 Solo ADMIN:
POST /api/products         // Crear producto
PUT /api/products/:id      // Editar producto
DELETE /api/products/:id   // Eliminar producto
```

---

## 🎮 Comandos Útiles

### Limpiar localStorage en navegador
```javascript
// En DevTools Console (F12)
localStorage.clear();
location.reload();
```

### Ver usuario en localStorage
```javascript
// En DevTools Console (F12)
console.log(JSON.parse(localStorage.getItem('user')));
// Muestra: { id, first_name, role, ... }
```

### Ver token
```javascript
// En DevTools Console (F12)
console.log(localStorage.getItem('token'));
// Muestra el JWT (muy largo)
```

### Verificar usuarios en MongoDB
```bash
# Conecta a MongoDB Atlas
# En una herramienta como MongoDB Compass o en terminal:
db.users.find();
db.users.findOne({ email: 'juan@example.com' });
```

---

## 🆘 Issues Comunes

### "Panel Admin no aparece después de upgrade"
```javascript
// Solución:
localStorage.clear();     // Limpiar datos
location.reload();        // Recargar
// Ahora haz login nuevamente
```

### "No puedo crear productos siendo admin"
```javascript
// Verificar:
1. ¿Estoy logueado? → Sí (veo nombre en navbar)
2. ¿Soy admin en BD? → devTools: localStorage.getItem('user').role === 'admin'
3. ¿Token en request? → Network tab → POST /api/products → Headers
4. Si no está → Logout y login de nuevo
```

### "Contraseña olvidada"
```bash
# Resetear usuario en MongoDB:
db.users.deleteOne({ email: 'juan@example.com' });
# Luego registrarse de nuevo
```

---

## 📱 URLs Rápidas

```
http://localhost:3001/              # Inicio
http://localhost:3001/login         # Login/Registro
http://localhost:3001/catalog       # Tienda
http://localhost:3001/admin         # Panel Admin (solo admin)
http://localhost:3001/cart          # Carrito (solo logueado)
http://localhost:3001/checkout      # Pagar (solo logueado)

Backend API:
http://localhost:3000/api/auth/login         # POST
http://localhost:3000/api/auth/register      # POST
http://localhost:3000/api/auth/current       # GET
http://localhost:3000/api/products           # GET/POST/PUT/DELETE
```

---

## ✅ Checklist de Funcionalidad

- [ ] Puedo registrar usuario nuevo
- [ ] Puedo hacer login
- [ ] Veo mi nombre en navbar
- [ ] Puedo ver dropdown "Mi cuenta"
- [ ] Puedo cerrar sesión
- [ ] Usuario normal NO ve "Panel de control"
- [ ] Usuario admin VE "Panel de control"
- [ ] Puedo acceder a /admin como admin
- [ ] NO puedo acceder a /admin como user
- [ ] Puedo crear productos siendo admin
- [ ] NO puedo crear productos siendo user
- [ ] Puedo editar productos siendo admin
- [ ] Puedo eliminar productos siendo admin
- [ ] Carrito solo visible si estoy logueado

---

## 🚀 Siguientes Pasos

1. **Agregar más funcionalidades:**
   - Edición de perfil
   - Historial de compras
   - Wishlist
   - Calificaciones de productos

2. **Mejorar seguridad:**
   - HTTPS en producción
   - Refresh tokens
   - Email verification
   - 2FA

3. **Optimizaciones:**
   - Caché de productos
   - Lazy loading
   - Paginación

---

## 💡 Tips

- Usa múltiples navegadores o pestañas privadas para probar login/logout simultáneamente
- Abre DevTools (F12) → Network tab para ver los requests a la API
- Revisa la consola para mensajes de error detallados
- Cada logout limpia automáticamente el localStorage

---

**¡Ya está todo listo para usar! Felicitaciones 🎉**

Para dudas, consulta:
- `AUTENTICACION_IMPLEMENTADA.md` - Guía completa
- `EJEMPLOS_AUTENTICACION.js` - Ejemplos de código
- `CHECKLIST_AUTENTICACION.md` - Testing detallado
