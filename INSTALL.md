# 📦 Guía de Instalación - VRBAGS Ecommerce

## Requisitos Previos

1. **Node.js** (v16 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **MongoDB** 
   - Opción 1: MongoDB Local
     - Descargar desde: https://www.mongodb.com/try/download/community
     - Instalar y ejecutar el servicio
   - Opción 2: MongoDB Atlas (Cloud)
     - Crear cuenta en: https://www.mongodb.com/cloud/atlas
     - Obtener connection string

3. **Git** (opcional)
   - Para clonar el repositorio

## Pasos de Instalación

### 1. Clonar o Descargar el Proyecto

```bash
git clone <url-del-repositorio>
cd VRBAGS
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del backend
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

O usar el script combinado:

```bash
npm run install-all
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB (ajustar según tu configuración)
MONGODB_URI=mongodb://localhost:27017/vrbags
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/vrbags

# JWT (cambiar por un secreto seguro)
JWT_SECRET=tu-jwt-secret-super-seguro-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# Email (opcional, para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password-de-aplicacion
EMAIL_FROM=noreply@vrbags.com

# Frontend
REACT_APP_API_URL=http://localhost:3000/api

# Base URL
BASE_URL=http://localhost:3000
```

### 4. Copiar Assets al Frontend

Los assets (imágenes) deben estar accesibles desde el frontend:

```bash
# Opción 1: Crear enlace simbólico (Linux/Mac)
ln -s ../assets frontend/public/assets

# Opción 2: Copiar carpeta (Windows)
# Copiar manualmente la carpeta assets/ a frontend/public/
```

### 5. Copiar CSS al Frontend

```bash
# Opción 1: Crear enlace simbólico (Linux/Mac)
ln -s ../css frontend/public/css

# Opción 2: Copiar carpeta (Windows)
# Copiar manualmente la carpeta css/ a frontend/public/
```

### 6. Iniciar MongoDB

**Si usas MongoDB local:**

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# o
mongod
```

**Si usas MongoDB Atlas:**
- No necesitas iniciar nada, solo asegúrate de tener la connection string correcta

### 7. Poblar Base de Datos

```bash
node backend/scripts/populateProducts.js
```

Esto creará los productos iniciales en la base de datos.

### 8. Iniciar la Aplicación

**Opción 1: Desarrollo (Backend + Frontend simultáneamente)**

```bash
npm run dev
```

**Opción 2: Por separado**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

### 9. Acceder a la Aplicación

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Verificación

1. **Backend funcionando:**
   ```bash
   curl http://localhost:3000/health
   ```
   Debe responder: `{"status":"ok","message":"Servidor funcionando correctamente"}`

2. **Productos cargados:**
   ```bash
   curl http://localhost:3000/api/products?limit=5
   ```
   Debe devolver un JSON con productos

3. **Frontend funcionando:**
   - Abrir http://localhost:3001 en el navegador
   - Debe mostrar la página de inicio

## Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install
```

### Error: "MongoDB connection failed"
- Verificar que MongoDB esté corriendo
- Verificar la URI en `.env`
- Si usas Atlas, verificar que la IP esté en la whitelist

### Error: "Port already in use"
- Cambiar el puerto en `.env` (PORT=3001)
- O cerrar el proceso que usa el puerto

### Frontend no encuentra assets
- Verificar que la carpeta `assets/` esté en `frontend/public/`
- Verificar que las rutas en los componentes usen `/assets/...`

## Estructura de Carpetas Final

```
VRBAGS/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── dto/
│   ├── middleware/
│   ├── models/
│   ├── repository/
│   ├── routes/
│   ├── scripts/
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── assets/     # ← Copiar aquí
│   │   ├── css/        # ← Copiar aquí
│   │   └── index.html
│   └── src/
├── assets/              # Original
├── css/                 # Original
├── .env                 # Crear este archivo
└── package.json
```

## Próximos Pasos

1. Crear un usuario administrador (manual o por script)
2. Configurar email para recuperación de contraseña
3. Personalizar productos según necesidad
4. Configurar dominio y SSL para producción

---

¡Listo! Tu aplicación debería estar funcionando. 🚀
