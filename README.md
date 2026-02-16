# 🛍️ VRBAGS - Ecommerce Platform

Ecommerce completo desarrollado con React y Node.js + MongoDB.

## 🚀 Características

- ✅ Catálogo de productos con categorías
- ✅ Carrito de compras
- ✅ Autenticación de usuarios (login/registro)
- ✅ Panel de administración
- ✅ Gestión de pedidos y estados
- ✅ Checkout con WhatsApp
- ✅ Sistema de tickets/órdenes

## 🛠️ Tecnologías

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Autenticación**: JWT
- **Base de Datos**: MongoDB Atlas

## 📦 Instalación Local

### Requisitos
- Node.js 16+ 
- MongoDB Atlas (o MongoDB local)

### Pasos

1. Clonar repositorio:
```bash
git clone https://github.com/TU_USUARIO/vrbags.git
cd vrbags
```

2. Instalar dependencias:
```bash
npm run install-all
```

3. Configurar variables de entorno:
- Copia `.env.example` a `.env` en la raíz
- Configura tus variables (MongoDB, JWT_SECRET, etc.)

4. Iniciar desarrollo:
```bash
npm run dev
```

- Frontend: http://localhost:3001
- Backend: http://localhost:3000

## 🌐 Deployment

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones completas de deployment.

### Resumen rápido:
1. Backend: Railway o Render
2. Frontend: Vercel o Netlify
3. MongoDB: MongoDB Atlas (ya configurado)

## 📁 Estructura del Proyecto

```
vrbags/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── dto/
│   ├── middleware/
│   ├── models/
│   ├── repository/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── package.json
```

## 🔐 Variables de Entorno

Ver `.env.example` para la lista completa de variables necesarias.

## 📝 Scripts Disponibles

- `npm run dev` - Inicia frontend y backend en desarrollo
- `npm run build` - Construye el frontend para producción
- `npm start` - Inicia solo el backend
- `npm run install-all` - Instala dependencias de raíz y frontend

## 👤 Autor

VRBAGS

## 📄 Licencia

MIT
