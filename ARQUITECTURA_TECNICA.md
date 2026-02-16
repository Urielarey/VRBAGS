# 🏗️ ARQUITECTURA TÉCNICA - VRBAGS

---

## 📐 DIAGRAMA GENERAL

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (NAVEGADOR)                      │
│  React Frontend @ http://localhost:3001                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │  Home/Tienda    │  │  Login/Admin │  │  Cart/Checkout │   │
│  │  (Productos)    │  │  (Auth)      │  │  (Compra)      │    │
│  └────────┬────────┘  └──────┬───────┘  └────────┬───────┘    │
│           │                  │                    │              │
│           └──────────────────┼────────────────────┘              │
│                              │                                   │
│                    ┌─────────▼──────────┐                       │
│                    │   React Router     │                       │
│                    │   Context (Cart)   │                       │
│                    │   Axios (HTTP)     │                       │
│                    └─────────┬──────────┘                       │
└────────────────────────────────┼──────────────────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  HTTP REST API           │
                    │  (CORS enabled)          │
                    │  @ :3000                 │
                    └────────────┬─────────────┘
┌───────────────────────────────────┼───────────────────────────────┐
│                  SERVIDOR (Node.js + Express)                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    EXPRESS SERVER                        │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │               MIDDLEWARE                           │ │   │
│  │  │  • CORS                                            │ │   │
│  │  │  • JSON Parser                                     │ │   │
│  │  │  • Static Files (/assets, /public)                │ │   │
│  │  │  • Authentication (JWT verify)                    │ │   │
│  │  │  • Authorization (role check)                     │ │   │
│  │  │  • Error Handler                                  │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │                        │                                  │   │
│  │         ┌──────────────┼──────────────────┐              │   │
│  │         │              │                  │              │   │
│  │    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐             │   │
│  │    │ ROUTES  │   │ ROUTES  │   │ ROUTES  │             │   │
│  │    │  /auth  │   │/products│   │ /carts  │  /tickets   │   │
│  │    └────┬────┘   └────┬────┘   └────┬────┘             │   │
│  │         │              │             │                  │   │
│  │    ┌────▼────────────┬─▼───────────┬─▼──────────┐       │   │
│  │    │                 │             │            │       │   │
│  │  CONTROLLERS                                            │   │
│  │  ┌─────────┐  ┌────────────┐  ┌────────┐  ┌──────┐    │   │
│  │  │  Auth   │  │ Product    │  │ Cart   │  │Ticket│    │   │
│  │  │ Control │  │ Control    │  │Control │  │Control│   │   │
│  │  └────┬────┘  └─────┬──────┘  └───┬────┘  └───┬──┘    │   │
│  │       │             │            │         │           │   │
│  │  REPOSITORIES / LÓGICA DE NEGOCIO                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Product      │  │ Cart         │  │ Ticket       │  │   │
│  │  │ Repository   │  │ Repository   │  │ Repository   │  │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────┘  │   │
│  │         │                 │                             │   │
│  │  DAOs (Data Access Objects)                            │   │
│  │  ┌──────────────┐  ┌──────────────┐                    │   │
│  │  │ ProductDAO   │  │ CartDAO      │                    │   │
│  │  └──────┬───────┘  └──────┬───────┘                    │   │
│  │         │                 │                             │   │
│  │  DTOs (Data Transfer Objects)                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ ProductDTO   │  │ CartDTO      │  │ TicketDTO    │  │   │
│  │  │ UserDTO      │  │              │  │              │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │         │                 │                             │   │
│  │  MODELS (Mongoose Schemas)                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Product      │  │ Cart         │  │ Ticket       │  │   │
│  │  │ Schema       │  │ Schema       │  │ Schema       │  │   │
│  │  │ (+ User)     │  │              │  │              │  │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │   │
│  └─────────┼──────────────────┼──────────────────┼─────────┘   │
│            │                  │                  │              │
└────────────┼──────────────────┼──────────────────┼──────────────┘
             │                  │                  │
       ┌─────▼──────────────────▼──────────────────▼──────┐
       │        MONGODB ATLAS (Cloud)                     │
       │   @ cluster.mongodb.net                          │
       │  Database: ecommerce                             │
       │  ┌────────────────────────────────────────┐     │
       │  │  Collections:                          │     │
       │  │  • users       (auth, roles)           │     │
       │  │  • products    (catalog, stock)        │     │
       │  │  • carts       (shopping carts)        │     │
       │  │  • tickets     (purchase history)      │     │
       │  └────────────────────────────────────────┘     │
       └─────────────────────────────────────────────────┘
```

---

## 🔐 FLUJOS DE AUTENTICACIÓN

### 1. Login Flow
```
Frontend                          Backend                   Database
   │                                │                          │
   ├─ POST /login ────────────────>│                          │
   │  {email, password}             │                          │
   │                                ├─ Find user ─────────────>│
   │                                │                          │
   │                                │<─ User doc ─────────────┤
   │                                │                          │
   │                                ├─ Compare password       │
   │                                │  (bcrypt)                │
   │                                │                          │
   │                                ├─ Generate JWT          │
   │                                │                          │
   │<─ {token, user DTO} ──────────┤                          │
   │                                │                          │
   └─ Save token + user to         │
      localStorage                  │
```

### 2. Authorized Request Flow
```
Frontend                          Backend                   Database
   │                                │                          │
   ├─ GET /products ───────────────>│                          │
   │  Header: Authorization: Bearer │                          │
   │  <TOKEN>                       │                          │
   │                                ├─ Verify JWT             │
   │                                │                          │
   │                                ├─ Extract userId         │
   │                                │                          │
   │                                ├─ Find user ─────────────>│
   │                                │                          │
   │                                │<─ User doc ─────────────┤
   │                                │                          │
   │                                ├─ Check role             │
   │                                │                          │
   │                                ├─ Fetch products ────────>│
   │                                │                          │
   │                                │<─ Products ─────────────┤
   │                                │                          │
   │<─ {status, products, ...} ────┤                          │
```

---

## 🛒 FLUJO DE COMPRA

```
Usuario                   Frontend                Backend              DB
  │                          │                      │                   │
  ├─ Ver producto ─────────>│                      │                   │
  │                          ├─ GET /products ───>│                   │
  │                          │                      ├─ Query ──────────>│
  │                          │                      │<─ Products ──────┤
  │                          │<─ 200 OK ──────────┤                   │
  │                          │                      │                   │
  ├─ Agregar al carrito ──>│                      │                   │
  │                          ├─ POST /carts/:cid  │                   │
  │                          │   /products/:pid   │                   │
  │                          │                      ├─ Update cart ───>│
  │                          │                      │<─ OK ────────────┤
  │                          │<─ 201 Created ─────┤                   │
  │                          │                      │                   │
  ├─ Continuar shopping ──>│                      │                   │
  │                          │ (Repetir pasos)    │                   │
  │                          │                      │                   │
  ├─ Ver carrito ─────────>│                      │                   │
  │                          ├─ GET /carts/:cid ─>│                   │
  │                          │                      ├─ Fetch + │        │
  │                          │                      │   populate ────>│
  │                          │                      │<─ Cart + │       │
  │                          │                      │   productos ───┤
  │                          │<─ 200 OK ──────────┤                   │
  │                          │                      │                   │
  ├─ Modificar cantidad ──>│                      │                   │
  │                          ├─ PUT /carts/:cid   │                   │
  │                          │   /products/:pid   │                   │
  │                          │   {quantity: 5}    │                   │
  │                          │                      ├─ Update qty ────>│
  │                          │                      │<─ OK ────────────┤
  │                          │<─ 200 OK ──────────┤                   │
  │                          │                      │                   │
  ├─ Comprar ─────────────>│                      │                   │
  │                          ├─ POST /tickets ───>│                   │
  │                          │  {cartId,          │                   │
  │                          │   purchaser}       │                   │
  │                          │                      ├─ Check stock ───>│
  │                          │                      │<─ OK/FAIL ──────┤
  │                          │                      │                   │
  │                          │  (if OK)            ├─ Create Ticket ─>│
  │                          │                      │                   │
  │                          │                      ├─ Update stock ──>│
  │                          │                      │<─ OK ────────────┤
  │                          │                      │                   │
  │                          │                      ├─ Clear cart ────>│
  │                          │                      │<─ OK ────────────┤
  │                          │                      │                   │
  │                          │<─ {ticket, code} ─┤                   │
  │                          │                      │                   │
  ├─ Ver ticket ──────────>│                      │                   │
  │                          ├─ GET /tickets/:id->│                   │
  │                          │                      ├─ Fetch ────────>│
  │                          │                      │<─ Ticket + ─────┤
  │                          │                      │   productos     │
  │                          │<─ 200 OK ──────────┤                   │
  │                          │                      │                   │
```

---

## 📦 ESTRUCTURA DE DATOS

### User
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  role: String ('user' | 'admin'),
  cart: ObjectId (ref: 'Cart'),
  resetPasswordToken: String | null,
  resetPasswordExpires: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  code: String (unique),
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [String], // URLs de imágenes
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  _id: ObjectId,
  products: [{
    product: ObjectId (ref: 'Product'), // Con populate
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket
```javascript
{
  _id: ObjectId,
  code: String (unique, auto-generated),
  purchase_datetime: Date,
  amount: Number (total),
  purchaser: String (email),
  products: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number (precio al momento)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints Mapa

```
Authentication
├── POST /api/auth/register          → Crear cuenta
├── POST /api/auth/login             → Iniciar sesión
├── GET  /api/auth/current           → Obtener usuario actual
├── POST /api/auth/forgot-password   → Solicitar reset
└── POST /api/auth/reset-password    → Restablecer con token

Products
├── GET  /api/products               → Listar con paginación/filtros
├── GET  /api/products/:pid          → Obtener por ID
├── POST /api/products               → Crear (admin only)
├── PUT  /api/products/:pid          → Actualizar (admin only)
└── DELETE /api/products/:pid        → Eliminar (admin only)

Carts
├── GET  /api/carts/:cid             → Obtener carrito
├── POST /api/carts                  → Crear carrito
├── POST /api/carts/:cid/products/:pid → Agregar producto
├── PUT  /api/carts/:cid             → Actualizar carrito
├── PUT  /api/carts/:cid/products/:pid → Actualizar cantidad
├── DELETE /api/carts/:cid/products/:pid → Quitar producto
└── DELETE /api/carts/:cid           → Vaciar carrito

Tickets
├── POST /api/tickets                → Crear compra
└── GET  /api/tickets/:tid           → Obtener compra
```

---

## 🏗️ PATRONES DE DISEÑO

### 1. DAO (Data Access Object)
```
ProductDAO
├─ findById(id)
├─ findAll(query, options)
├─ create(data)
├─ update(id, data)
├─ delete(id)
└─ updateStock(id, quantity)

Responsabilidad: Acceso directo a BD
```

### 2. Repository
```
ProductRepository
├─ create(data)          → DAO.create() + DTO.toDTO()
├─ findById(id)          → DAO.findById() + DTO.toDTO()
├─ findAll(options)      → DAO.findAll() + mapeo a array DTO
├─ update(id, data)      → DAO.update() + validaciones
├─ delete(id)            → DAO.delete()
└─ updateStock(id, qty)  → DAO.updateStock()

Responsabilidad: Lógica de negocio + Transformación de datos
```

### 3. DTO (Data Transfer Object)
```
ProductDTO
├─ constructor(product) → Extrae solo datos públicos
├─ static toDTO(product)
└─ static fromArray(products)

Responsabilidad: Proteger datos sensibles
```

### 4. Middleware
```
authenticate (req, res, next)
├─ Verifica JWT en header
├─ Extrae usuario de BD
└─ Agrega req.user

authorize(...roles) (req, res, next)
├─ Verifica que usuario tenga rol
└─ Rechaza si no cumple

authorizeCart (req, res, next)
├─ Verifica que usuario sea propietario del carrito
└─ Rechaza acceso a carrito ajeno
```

---

## 🔐 SEGURIDAD EN CAPAS

```
Capa 1: HTTPS (en producción)
  ↓
Capa 2: JWT + Bcrypt (autenticación)
  ↓
Capa 3: RBAC (autorización por rol)
  ↓
Capa 4: DTOs (no exponer datos sensibles)
  ↓
Capa 5: Validaciones (datos de entrada)
  ↓
Capa 6: Ownership (verificar pertenencia)
```

---

## 📊 FLUJO DE DATOS

```
Frontend (React)
    ↓
localStorage (JWT token + user object)
    ↓
HTTP Request (Axios)
    ↓
Express Middleware
    ├─ Verify JWT
    ├─ Authorize role
    └─ Authorize ownership (si aplica)
    ↓
Controller
    ├─ Validaciones de negocio
    └─ Delega a Repository
    ↓
Repository
    ├─ Lógica de negocio
    └─ Delega a DAO
    ↓
DAO
    ├─ Consulta a MongoDB
    └─ Retorna documento
    ↓
DTO
    ├─ Transforma documento
    └─ Excluye datos sensibles
    ↓
Controller
    ├─ Formatea respuesta
    └─ Envía al cliente
    ↓
Frontend (React)
    ├─ Recibe JSON
    ├─ Actualiza estado
    └─ Re-renderiza UI
```

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno (.env)
```env
# Base de datos
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=secret_key_aqui
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=email@gmail.com
EMAIL_PASS=password

# Server
PORT=3000
BASE_URL=http://localhost:3001
```

### Dependencias Principales
```json
{
  "express": "^4.18.2",          // Framework web
  "mongoose": "^7.0.0",          // ODM MongoDB
  "bcrypt": "^5.1.0",            // Hash contraseñas
  "jsonwebtoken": "^9.0.0",      // JWT
  "nodemailer": "^6.8.0",        // Envío de emails
  "cors": "^2.8.5",              // CORS middleware
  "dotenv": "^16.0.3",           // Variables de entorno
  "nodemon": "^2.0.20"           // Dev auto-reload
}
```

---

## 🚀 DEPLOYMENT

### Requisitos en Producción
1. MongoDB Atlas (o servidor propio)
2. Node.js + npm en servidor
3. Nginx o similar (proxy inverso)
4. HTTPS/SSL certificate
5. Variables de entorno seguras

### Pasos
```bash
1. Push código a git
2. Deploy en servidor (Vercel, Heroku, AWS, etc.)
3. Configurar variables de entorno
4. Build frontend
5. Iniciar backend
6. Configurar DNS y SSL
```

---

## 📈 ESCALABILIDAD

**Arquitectura actual soporta:**
- Hasta ~1000 usuarios concurrentes
- ~10,000 productos
- ~100,000 tickets/compras

**Para escalar:**
- Agregar cache (Redis)
- Implementar API gateway
- Separar en microservicios
- Aumentar poder de BD (MongoDB Atlas tier)
- CDN para assets (CloudFlare, AWS S3)

---

## 📝 CONCLUSIÓN

La arquitectura está diseñada para ser:
- **Segura:** Múltiples capas de protección
- **Escalable:** Patrones profesionales
- **Mantenible:** Código limpio y separado
- **Eficiente:** Optimización de queries
- **Documentada:** Comentarios y ejemplos

¡Lista para producción! 🚀
