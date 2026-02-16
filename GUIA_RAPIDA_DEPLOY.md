# 🚀 Guía Rápida de Deployment

## Opción 1: Railway + Vercel (Más Fácil)

### Backend en Railway:

1. Ve a [railway.app](https://railway.app) y conecta con GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repo
4. Railway detectará Node.js automáticamente
5. En "Settings" → "Variables", agrega:
   ```
   MONGODB_URI=tu_connection_string
   JWT_SECRET=tu_secret_super_seguro
   FRONTEND_URL=https://tu-frontend.vercel.app
   NODE_ENV=production
   ```
6. Railway te dará una URL como: `https://vrbags-backend.railway.app`
7. Copia esa URL

### Frontend en Vercel:

1. Ve a [vercel.com](https://vercel.com) y conecta con GitHub
2. "Add New Project" → Importa tu repo
3. Configuración:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. En "Environment Variables", agrega:
   ```
   REACT_APP_API_URL=https://vrbags-backend.railway.app/api
   ```
5. Click "Deploy"
6. Vercel te dará una URL como: `https://vrbags.vercel.app`

### Actualizar URLs:

1. Vuelve a Railway → Variables → Cambia `FRONTEND_URL` a la URL de Vercel
2. Listo! 🎉

---

## Opción 2: Render + Netlify

### Backend en Render:

1. Ve a [render.com](https://render.com) y conecta con GitHub
2. "New" → "Web Service"
3. Conecta tu repo
4. Configuración:
   - **Name**: `vrbags-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Agrega las mismas variables de entorno que Railway
6. Render te dará una URL

### Frontend en Netlify:

1. Ve a [netlify.com](https://netlify.com) y conecta con GitHub
2. "Add new site" → "Import an existing project"
3. Configuración:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
4. Agrega variable: `REACT_APP_API_URL=https://tu-backend.onrender.com/api`
5. Deploy

---

## ⚠️ Importante antes de subir a GitHub:

1. **NUNCA subas archivos `.env`** - Ya están en `.gitignore`
2. **Verifica que `.gitignore` incluya**:
   - `.env`
   - `node_modules/`
   - `frontend/build/`

## 📝 Checklist antes de deploy:

- [ ] Archivos `.env` NO están en el repo
- [ ] `.gitignore` está configurado correctamente
- [ ] Código subido a GitHub
- [ ] MongoDB Atlas configurado (IP whitelist permite todas: `0.0.0.0/0`)
- [ ] Variables de entorno listas para copiar

## 🔗 URLs después del deploy:

- Backend: `https://tu-backend.railway.app`
- Frontend: `https://tu-frontend.vercel.app`
- Health check: `https://tu-backend.railway.app/health`

## 🆘 Problemas comunes:

**Error de CORS:**
- Verifica que `FRONTEND_URL` en backend sea la URL exacta del frontend

**No conecta a MongoDB:**
- En MongoDB Atlas → Network Access → Agrega IP `0.0.0.0/0` (permite todas)

**Frontend no carga:**
- Verifica que `REACT_APP_API_URL` tenga `/api` al final
- Revisa la consola del navegador (F12)
