# 🔧 Comandos para PowerShell

## ⚠️ Importante: PowerShell NO usa `&&`

En PowerShell, usa `;` en lugar de `&&` para separar comandos.

## ✅ Comandos Correctos

### Instalar Dependencias

**Opción 1: Usar el script**
```powershell
.\install-dependencies.ps1
```

**Opción 2: Manualmente**
```powershell
# Backend
npm install

# Frontend (cambiar de directorio primero)
cd frontend
npm install
cd ..
```

### Poblar Base de Datos

```powershell
node backend/scripts/populateProducts.js
```

### Iniciar Aplicación

```powershell
# Desarrollo (backend + frontend)
npm run dev

# O por separado:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm start
```

### Verificar Conexión MongoDB

```powershell
npm run server
```

## 📝 Sintaxis PowerShell vs Bash

| Bash/Linux | PowerShell |
|------------|------------|
| `&&` | `;` |
| `\` (continuación) | `` ` `` (backtick) |
| `$VAR` | `$VAR` (igual) |

## Ejemplos

❌ **Incorrecto:**
```powershell
cd frontend && npm install && cd ..
```

✅ **Correcto:**
```powershell
cd frontend; npm install; cd ..
```

O mejor aún, usar comandos separados:
```powershell
cd frontend
npm install
cd ..
```
