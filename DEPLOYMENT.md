# 🚀 Guía de Deployment - VRBAGS

Esta guía te ayudará a subir tu aplicación a producción.

## 📋 Requisitos Previos

1. **Cuenta de GitHub** (ya la tienes)
2. **Cuenta de MongoDB Atlas** (ya configurada)
3. **Cuentas en servicios de hosting:**
   - **Backend**: Railway, Render, o Vercel
   - **Frontend**: Vercel o Netlify

## 🔧 Paso 1: Preparar el Código

### 1.1 Verificar .gitignore
Asegúrate de que `.gitignore` incluya:
- `.env` (archivos de configuración)
- `node_modules/`
- `frontend/build/`

### 1.2 Crear archivo .env.example
Este archivo muestra qué variables necesitas sin exponer valores sensibles.

## 📤 Paso 2: Subir a GitHub

```bash
# Si aún no tienes repositorio inicializado
git init
git add .
git commit -m "Initial commit - VRBAGS Ecommerce"

# Crear repositorio en GitHub y luego:
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

## 🌐 Paso 3: Desplegar Backend

### Opción A: Railway (Recomendado - Gratis con límites)

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Selecciona tu repositorio
6. Railway detectará automáticamente que es Node.js
7. Configura las variables de entorno (ver abajo)
8. Railway asignará una URL automáticamente (ej: `https://tu-backend.railway.app`)

### Opción B: Render

1. Ve a [render.com](https://render.com)
2. Inicia sesión con GitHub
3. Click en "New" → "Web Service"
4. Conecta tu repositorio
5. Configuración:
   - **Name**: `vrbags-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (si tu estructura lo requiere)
6. Configura variables de entorno
7. Click "Create Web Service"

### Variables de Entorno para Backend:

```
MONGODB_URI=tu_connection_string_de_mongodb
PORT=3000 (o el que asigne el servicio)
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://tu-frontend.vercel.app (o netlify)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password-de-aplicacion
EMAIL_FROM=noreply@vrbags.com
```

## 🎨 Paso 4: Desplegar Frontend

### Opción A: Vercel (Recomendado - Gratis)

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click en "Add New Project"
4. Importa tu repositorio
5. Configuración:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Agrega variable de entorno:
   - `REACT_APP_API_URL=https://tu-backend.railway.app/api`
7. Click "Deploy"

### Opción B: Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Inicia sesión con GitHub
3. Click en "Add new site" → "Import an existing project"
4. Conecta tu repositorio
5. Configuración:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Agrega variable de entorno:
   - `REACT_APP_API_URL=https://tu-backend.railway.app/api`
7. Click "Deploy site"

## 🔄 Paso 5: Actualizar URLs

Después de desplegar:

1. **Actualiza el backend** con la URL del frontend:
   - En las variables de entorno del backend, cambia `FRONTEND_URL` a la URL de Vercel/Netlify

2. **Actualiza el frontend** con la URL del backend:
   - En las variables de entorno del frontend, cambia `REACT_APP_API_URL` a la URL del backend

## ✅ Verificación

1. Verifica que el backend responda: `https://tu-backend.railway.app/health`
2. Verifica que el frontend cargue correctamente
3. Prueba login, registro, y funcionalidades principales

## 📝 Notas Importantes

- **MongoDB Atlas**: Ya está configurado, solo asegúrate de que la IP del servicio de hosting esté en la whitelist (o permite todas las IPs `0.0.0.0/0`)
- **CORS**: El backend ya está configurado para aceptar requests del frontend
- **Variables de Entorno**: NUNCA subas archivos `.env` a GitHub
- **Build**: El frontend se construye automáticamente en cada deploy

## 🆘 Troubleshooting

### Error de CORS
- Verifica que `FRONTEND_URL` en el backend sea la URL correcta del frontend

### Error de conexión a MongoDB
- Verifica que la IP del servicio esté en la whitelist de MongoDB Atlas
- Verifica que `MONGODB_URI` sea correcta

### Frontend no carga productos
- Verifica que `REACT_APP_API_URL` apunte al backend correcto
- Revisa la consola del navegador para errores
