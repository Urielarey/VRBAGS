# 🧪 TESTING ENDPOINTS - VRBAGS BACKEND

## Requisitos Previos
- Backend corriendo en `http://localhost:3000`
- Postman o similar para hacer requests (o curl en terminal)
- Haber creado admin con: `node scripts/createAdmin.js`

---

## 1️⃣ AUTENTICACIÓN

### 1.1 Registrar nuevo usuario
```
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 30,
  "password": "123456"
}
```

**Respuesta esperada:**
```json
{
  "status": "success",
  "payload": {
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "first_name": "Juan",
      "last_name": "Pérez",
      "role": "user",
      "cart": "..."
    },
    "token": "eyJhbGc..."
  }
}
```

---

### 1.2 Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@vrbags.com",
  "password": "admin123"
}
```

**Guardar el token para las próximas requests.**

---

### 1.3 Obtener usuario actual
```
GET /api/auth/current
Authorization: Bearer <TOKEN_AQUI>
```

**Respuesta esperada:**
```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "email": "admin@vrbags.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin",
    "cart": "..."
  }
}
```

---

## 2️⃣ PRODUCTOS CON PAGINACIÓN

### 2.1 Obtener todos los productos (página 1, 10 elementos)
```
GET /api/products
```

### 2.2 Con límite personalizado
```
GET /api/products?limit=20&page=1
```

### 2.3 Filtrar por categoría
```
GET /api/products?limit=10&page=1&query=category:bolsos
```

### 2.4 Ordenar por precio (ascendente)
```
GET /api/products?limit=10&page=1&sort=asc
```

### 2.5 Ordenar por precio (descendente)
```
GET /api/products?limit=10&page=1&sort=desc
```

### 2.6 Filtrar por disponibilidad
```
GET /api/products?limit=10&page=1&query=status:true
```

**Respuesta esperada (estructura):**
```json
{
  "status": "success",
  "payload": [...productos],
  "totalPages": 3,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?limit=10&page=2"
}
```

---

## 3️⃣ CREAR/ACTUALIZAR/ELIMINAR PRODUCTOS (ADMIN ONLY)

### 3.1 Crear producto
```
POST /api/products
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Bolso Premium",
  "description": "Bolso de cuero premium",
  "code": "BOLSO-PREMIUM-001",
  "price": 8500,
  "status": true,
  "stock": 15,
  "category": "bolsos",
  "thumbnails": ["bolso.jpg"]
}
```

### 3.2 Actualizar producto
```
PUT /api/products/<PRODUCT_ID>
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "price": 9000,
  "stock": 20
}
```

### 3.3 Eliminar producto
```
DELETE /api/products/<PRODUCT_ID>
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 4️⃣ CARRITOS

### 4.1 Crear carrito
```
POST /api/carts
Content-Type: application/json
```

**Respuesta:** Devuelve ID del carrito

### 4.2 Obtener carrito (con productos populados)
```
GET /api/carts/<CART_ID>
```

**Respuesta esperada:**
```json
{
  "status": "success",
  "payload": {
    "_id": "...",
    "products": [
      {
        "_id": "...",
        "product": {
          "_id": "...",
          "title": "Bolso Miri",
          "price": 5500,
          "stock": 10,
          "category": "bolsos"
        },
        "quantity": 2
      }
    ]
  }
}
```

### 4.3 Agregar producto al carrito
```
POST /api/carts/<CART_ID>/products/<PRODUCT_ID>
Content-Type: application/json

{
  "quantity": 2
}
```

### 4.4 Actualizar cantidad de producto
```
PUT /api/carts/<CART_ID>/products/<PRODUCT_ID>
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "quantity": 5
}
```

**⚠️ Nota:** Este endpoint requiere que el token pertenezca al dueño del carrito.

### 4.5 Eliminar producto del carrito
```
DELETE /api/carts/<CART_ID>/products/<PRODUCT_ID>
Authorization: Bearer <TOKEN>
```

### 4.6 Actualizar carrito completo (reemplazar todos los productos)
```
PUT /api/carts/<CART_ID>
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "products": [
    {
      "product": "<PRODUCT_ID_1>",
      "quantity": 2
    },
    {
      "product": "<PRODUCT_ID_2>",
      "quantity": 3
    }
  ]
}
```

### 4.7 Vaciar carrito
```
DELETE /api/carts/<CART_ID>
Authorization: Bearer <TOKEN>
```

---

## 5️⃣ COMPRA (TICKETS)

### 5.1 Realizar compra
```
POST /api/tickets
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "cartId": "<CART_ID>",
  "purchaser": "usuario@example.com"
}
```

**Respuesta si hay stock:** 
```json
{
  "status": "success",
  "payload": {
    "code": "TICKET-1707123456-ABC123DEF",
    "purchase_datetime": "2024-02-09T10:30:00Z",
    "amount": 11000,
    "purchaser": "usuario@example.com",
    "products": [...]
  }
}
```

**Respuesta si hay falta de stock:**
```json
{
  "status": "error",
  "message": "Algunos productos no tienen stock suficiente",
  "payload": {
    "productsWithoutStock": [
      {
        "product": "Producto X",
        "requested": 10,
        "available": 3
      }
    ],
    "productsToPurchase": [...]
  }
}
```

### 5.2 Obtener ticket
```
GET /api/tickets/<TICKET_ID>
Authorization: Bearer <TOKEN>
```

---

## 6️⃣ RECUPERACIÓN DE CONTRASEÑA

### 6.1 Solicitar recuperación
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@example.com"
}
```

**Respuesta:** (por seguridad, siempre devuelve éxito)
```json
{
  "status": "success",
  "message": "Si el email existe, recibirás un enlace para restablecer tu contraseña"
}
```

**⚠️ El email será enviado a `usuario@example.com` con el token.**

### 6.2 Restablecer contraseña
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "<TOKEN_DEL_EMAIL>",
  "password": "nueva_contraseña_123"
}
```

**Validaciones:**
- Token debe ser válido y no expirado (1 hora)
- Nueva contraseña NO puede ser igual a la anterior

---

## ⚠️ ERRORES COMUNES

### Error 401: Unauthorized
**Causa:** Token ausente, inválido o expirado
**Solución:** Login nuevamente para obtener token fresco

### Error 403: Forbidden
**Causa:** Usuario no tiene permisos (ej: solo admin puede crear productos)
**Solución:** Usar token de usuario admin

### Error 400: Bad Request
**Causa:** Datos inválidos o falta de validación
**Solución:** Revisar formato del body y parámetros

### Error 404: Not Found
**Causa:** Recurso no existe
**Solución:** Verificar IDs de productos, carritos, etc.

---

## 📊 FLUJO COMPLETO DE EJEMPLO

1. **Registrarse**
   - POST /api/auth/register → Obtener TOKEN y CART_ID

2. **Explorar productos**
   - GET /api/products?category=bolsos → Obtener PRODUCT_ID

3. **Agregar al carrito**
   - POST /api/carts/CART_ID/products/PRODUCT_ID → Confirmar

4. **Ver carrito**
   - GET /api/carts/CART_ID → Verificar productos

5. **Modificar cantidades**
   - PUT /api/carts/CART_ID/products/PRODUCT_ID → Cambiar cantidad

6. **Comprar**
   - POST /api/tickets → Generar TICKET_CODE

7. **Verificar compra**
   - GET /api/tickets/TICKET_ID → Ver detalles del ticket

---

## 🔐 NOTAS DE SEGURIDAD

1. **Token JWT:** 
   - Válido por 24 horas
   - Almacenado en localStorage en el frontend
   - Enviado en header: `Authorization: Bearer <token>`

2. **Roles:**
   - `user`: Comprador normal
   - `admin`: Gestor de productos

3. **Autorización de carrito:**
   - Solo el dueño del carrito puede modificarlo
   - Verificado por: `user.cart.toString() === cartId`

4. **Recuperación de contraseña:**
   - Token expira en 1 hora
   - No es posible restablecer a la misma contraseña
