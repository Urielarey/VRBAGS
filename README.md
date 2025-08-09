# 🛍️ VRBAGS Ecommerce

Ecommerce completo para VRBAGS con integración de Mercado Pago, desarrollado en Node.js y JavaScript.

## ✨ Características

- 🛒 **Sistema de Carrito Completo**: Agregar, eliminar y modificar productos
- 💳 **Integración con Mercado Pago**: Pagos seguros y confiables
- 📱 **Diseño Responsivo**: Funciona perfectamente en todos los dispositivos
- 🎨 **Interfaz Moderna**: UI/UX atractiva con animaciones
- 🔒 **Seguridad**: Middleware de seguridad con Helmet
- 📊 **Logging**: Sistema de logs para monitoreo
- 🔔 **Webhooks**: Notificaciones automáticas de pagos
- 📦 **Gestión de Productos**: Catálogo organizado por categorías

## 🚀 Instalación

### Prerrequisitos

- Node.js 16.0.0 o superior
- npm o yarn
- Cuenta de Mercado Pago (para obtener las credenciales)

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd VRBAGS
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Configuración de Mercado Pago
# Para pruebas usa: TEST-1234567890123456789012345678901234567890
# Para producción obtén tu token real desde: https://www.mercadopago.com.ar/developers/panel/credentials
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890123456789012345678901234567890

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de seguridad
SESSION_SECRET=vrbags-session-secret-key-2024

# URLs de la aplicación
BASE_URL=http://localhost:3000
```

### 4. Obtener credenciales de Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel/credentials)
2. Crea una aplicación o usa una existente
3. Copia el **Access Token** (público)
4. Para pruebas usa el token de **TEST**
5. Para producción usa el token de **PRODUCCIÓN**

### 5. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
VRBAGS/
├── assets/                 # Imágenes y recursos estáticos
├── css/                   # Estilos compilados
├── js/                    # JavaScript del frontend
│   └── carrito.js        # Lógica del carrito de compras
├── pages/                 # Páginas HTML
│   ├── tienda.html       # Catálogo de productos
│   ├── carrito.html      # Carrito de compras
│   ├── success.html      # Página de pago exitoso
│   ├── failure.html      # Página de pago fallido
│   └── pending.html      # Página de pago pendiente
├── routes/                # Rutas de la API
│   └── api.js            # Endpoints de la API
├── scss/                  # Archivos SCSS fuente
├── server.js              # Servidor principal
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

## 🔧 API Endpoints

### Crear Orden de Pago
```http
POST /api/crear-orden
Content-Type: application/json

{
  "items": [
    {
      "title": "Bolso Miri Grande Amarillo",
      "unit_price": 45000,
      "quantity": 1,
      "picture_url": "/assets/Bolso Miri Grande Amarillo.jpg"
    }
  ],
  "total": 45000
}
```

### Estado de un Pago
```http
GET /api/payment-status/:id
```

### Webhook (Notificaciones)
```http
POST /api/webhook
```

### Estado de la API
```http
GET /api/status
```

### Productos Disponibles
```http
GET /api/productos
```

### Estado del Servidor
```http
GET /health
```

## 💳 Flujo de Pago

1. **Usuario agrega productos** al carrito desde la tienda
2. **Usuario procede al checkout** desde el carrito
3. **Sistema crea orden** en Mercado Pago
4. **Usuario es redirigido** a Mercado Pago para completar el pago
5. **Mercado Pago procesa** el pago y notifica al webhook
6. **Sistema actualiza** el estado de la orden
7. **Usuario es redirigido** a la página de éxito/fallo/pendiente

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm run dev

# Iniciar en modo producción
npm start

# Ejecutar tests (cuando se implementen)
npm test
```

### Estructura del Carrito

El carrito se almacena en `localStorage` y tiene la siguiente estructura:

```javascript
{
  id: "miri-grande-amarillo",
  nombre: "Bolso Miri Grande Amarillo",
  precio: 45000,
  imagen: "/assets/Bolso Miri Grande Amarillo.jpg",
  cantidad: 1
}
```

### Personalización

#### Agregar Nuevos Productos

1. Agregar la imagen en `assets/`
2. Agregar el producto en `pages/tienda.html`
3. Actualizar la API en `routes/api.js` si es necesario

#### Modificar Estilos

1. Editar archivos SCSS en `scss/`
2. Compilar con: `npm run build:css` (cuando se implemente)
3. O editar directamente `css/style.css`

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de Cross-Origin Resource Sharing
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validación de Entrada**: Sanitización de datos de usuario
- **HTTPS**: Recomendado para producción

## 📱 Responsive Design

El ecommerce está optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1200px+)

## 🚀 Despliegue

### Opciones de Despliegue

1. **Heroku**: Fácil despliegue con Git
2. **Vercel**: Despliegue automático desde GitHub
3. **DigitalOcean**: VPS personalizable
4. **AWS**: Escalabilidad empresarial

### Variables de Entorno para Producción

```env
NODE_ENV=production
MERCADOPAGO_ACCESS_TOKEN=APP-1234567890123456789012345678901234567890
SESSION_SECRET=tu-session-secret-super-seguro
BASE_URL=https://tu-dominio.com
```

## 📊 Monitoreo

### Logs del Servidor

El servidor registra:
- Requests HTTP
- Errores y excepciones
- Creación de órdenes
- Webhooks recibidos
- Estado de pagos

### Métricas Recomendadas

- Tiempo de respuesta de la API
- Tasa de éxito de pagos
- Errores por endpoint
- Uso de memoria y CPU

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de Mercado Pago**
   - Verificar que el token sea válido
   - Confirmar que esté en modo TEST o PRODUCCIÓN correcto

2. **Webhook no funciona**
   - Verificar que la URL sea accesible públicamente
   - Confirmar que el endpoint responda correctamente

3. **Carrito no persiste**
   - Verificar que localStorage esté habilitado
   - Revisar la consola del navegador

### Logs de Debug

Para activar logs detallados:

```bash
NODE_ENV=development npm run dev
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- 📧 Email: soporte@vrbags.com
- 🌐 Website: https://vrbags.com
- 📱 WhatsApp: +54 9 11 1234-5678

## 🙏 Agradecimientos

- **Mercado Pago** por la API de pagos
- **Bootstrap** por el framework CSS
- **Node.js** por el runtime de JavaScript
- **Express.js** por el framework web

---

**Desarrollado con ❤️ por [VRBAGS](https://vrbags.com)**

*Powered by [byurodev.site](https://www.byurodev.site)*
