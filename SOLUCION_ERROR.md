# 🔧 Solución al Error "No se puede obtener /"

## ❌ Problema

Estás accediendo a `localhost:3000` que es el **BACKEND** (solo API REST).
El backend no tiene una página web, solo endpoints de API.

## ✅ Solución

Debes acceder al **FRONTEND** que está en `localhost:3001`.

## 🚀 Cómo Iniciar la Aplicación

### Opción 1: Iniciar Todo Junto (Recomendado)

```powershell
npm run dev
```

Esto iniciará:
- **Backend** en `http://localhost:3000` (API)
- **Frontend** en `http://localhost:3001` (React App)

### Opción 2: Iniciar por Separado

**Terminal 1 - Backend:**
```powershell
npm run server
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

## 🌐 URLs Correctas

- ✅ **Frontend (React App)**: http://localhost:3001 ← **USA ESTA**
- ⚙️ **Backend (API)**: http://localhost:3000/api ← Solo para desarrollo
- 🔍 **Health Check**: http://localhost:3000/health

## 📝 Nota

He agregado una ruta raíz al backend que ahora muestra información útil cuando accedes a `localhost:3000`, pero la aplicación web real está en `localhost:3001`.
