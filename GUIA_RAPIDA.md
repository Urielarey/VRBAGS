# 🚀 GUÍA RÁPIDA - VRBAGS ECOMMERCE

## 📖 DOCUMENTACIÓN DISPONIBLE

| Documento | Contenido |
|-----------|-----------|
| **ESTADO_BACKEND.md** | Resumen completo de lo implementado en el backend |
| **TESTING_ENDPOINTS.md** | Ejemplos de requests para probar cada endpoint |
| **CHECKLIST_COMPLETO.md** | Verificación de requisitos cumplidos |
| **GUIA_RAPIDA.md** | Este archivo - cómo usar la aplicación |

---

## 1️⃣ INICIAR LA APLICACIÓN

### Backend
```bash
cd backend
npm start
# Se ejecuta en http://localhost:3000
```

### Frontend
```bash
cd frontend
npm start
# Se ejecuta en http://localhost:3001
```

---

## 2️⃣ CREAR ADMIN

Solo una vez, ejecutar:
```bash
cd backend
node scripts/createAdmin.js
```

**Credenciales:**
- Email: `admin@vrbags.com`
- Contraseña: `admin123`

---

## 3️⃣ USAR LA APLICACIÓN

### Como Usuario Normal

1. Ir a http://localhost:3001
2. Clickear en "Ingresar" (arriba a la derecha)
3. **Registrarse:** Llenar formulario con email, nombre, contraseña
4. **O loginear** con cuenta existente
5. Ver productos en "Tienda"
6. Agregar al carrito
7. Ir al carrito y comprar

### Como Administrador

1. Ir a http://localhost:3001/login
2. Loginear con: `admin@vrbags.com` / `admin123`
3. Verás "Panel Admin" en la navbar (botón verde)
4. En el panel ves: estadísticas, tabla de productos
5. Desde la API puedes crear/editar productos (veremos más adelante)

---

## 4️⃣ ENDPOINTS DE API

### Para Usuarios

**Registrarse:**
```
POST /api/auth/register
Body: { first_name, last_name, email, age, password }
```

**Loginear:**
```
POST /api/auth/login
Body: { email, password }
Response: { status, payload: { user, token } }
```

**Ver productos:**
```
GET /api/products
GET /api/products?limit=20&page=1
GET /api/products?query=category:bolsos
GET /api/products?sort=asc
```

**Comprar:**
```
POST /api/tickets
Header: Authorization: Bearer <TOKEN>
Body: { cartId, purchaser }
```

### Para Administradores

**Crear producto:**
```
POST /api/products
Header: Authorization: Bearer <ADMIN_TOKEN>
Body: { title, price, stock, category, description, thumbnails, etc. }
```

**Actualizar producto:**
```
PUT /api/products/<ID>
Header: Authorization: Bearer <ADMIN_TOKEN>
Body: { title, price, stock, etc. }
```

**Eliminar producto:**
```
DELETE /api/products/<ID>
Header: Authorization: Bearer <ADMIN_TOKEN>
```

---

## 5️⃣ FEATURES PRINCIPALES

### ✅ Autenticación
- Registro de usuarios
- Login con JWT
- Roles (admin, user)
- Recuperación de contraseña por email

### ✅ Productos
- Paginación
- Filtros por categoría
- Ordenamiento por precio
- CRUD (solo admin)

### ✅ Carritos
- Agregar/quitar productos
- Actualizar cantidades
- Ver carrito completo con detalles

### ✅ Compra
- Verificación de stock
- Generación de tickets
- Decremento automático de stock
- Manejo de falta de stock

### ✅ Panel Admin
- Ver estadísticas
- Tabla de productos
- Información del usuario logueado

---

## 6️⃣ ARCHIVOS IMPORTANTES

### Backend
- `backend/server.js` - Configuración del servidor
- `backend/.env` - Variables de entorno (MONGODB_URI, JWT_SECRET)
- `backend/routes/api/products.js` - Rutas de productos
- `backend/routes/api/carts.js` - Rutas de carritos
- `backend/routes/api/auth.js` - Rutas de autenticación

### Frontend
- `frontend/src/App.js` - Rutas principales
- `frontend/src/pages/Tienda/Tienda.js` - Catálogo de productos
- `frontend/src/pages/Login/Login.js` - Página de login
- `frontend/src/pages/Admin/Admin.js` - Panel de administrador
- `frontend/src/components/NavBar/NavBar.js` - Navegación

---

## 7️⃣ FLUJO TÍPICO DE USUARIO

```
1. Registro (POST /auth/register)
   ↓
2. Login (POST /auth/login) → obtiene TOKEN + CART_ID
   ↓
3. Ver productos (GET /products)
   ↓
4. Agregar al carrito (POST /carts/:cid/products/:pid)
   ↓
5. Ver carrito (GET /carts/:cid)
   ↓
6. Comprar (POST /tickets)
   ↓
7. Ticket generado con código único
```

---

## 8️⃣ VARIABLES DE ENTORNO

En `backend/.env` (ya creado):

```env
MONGODB_URI=mongodb+srv://byurodev:...@ecommerce-cluster...
JWT_SECRET=vrbags_ecommerce_jwt_secret_2024
JWT_EXPIRES_IN=24h
PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña
```

---

## 9️⃣ TROUBLESHOOTING

### Error: "Cannot connect to MongoDB"
→ Verificar MONGODB_URI en .env está correcta

### Error: "Token inválido"
→ Hacer login nuevamente, el token expiró (24h)

### Error: "No tienes permisos"
→ Estás usando token de usuario normal, necesitas admin

### Productos no aparecen en tienda
→ Verificar que el backend esté ejecutándose
→ Ir a http://localhost:3000/api/products en navegador

### No puedo hacer login
→ Verificar credenciales de admin: admin@vrbags.com / admin123
→ O registrarse como nuevo usuario

---

## 🔟 PRÓXIMOS PASOS OPCIONALES

1. **Frontend mejorado:** Agregar carrito dinámico, checkout avanzado
2. **Admin dashboard completo:** Crear/editar productos desde UI
3. **Notificaciones:** Enviar emails de compra confirmada
4. **Reportes:** Ver estadísticas de ventas
5. **Búsqueda avanzada:** Filtros múltiples en UI
6. **Reviews:** Sistema de comentarios en productos

---

## 📞 SOPORTE

Si algo no funciona:
1. Revisar la consola del navegador (F12)
2. Revisar logs del backend en terminal
3. Consultar `TESTING_ENDPOINTS.md` para ver ejemplos
4. Verificar que ambos servidores estén ejecutándose
