# Backend Ecommerce VRBAGS

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:
   ```env
   MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
   PORT=4000
   ```
   Reemplaza `TU_ACCESS_TOKEN_AQUI` por tu access token de Mercado Pago.

3. Inicia el servidor:
   ```bash
   node index.js
   ```

## Endpoints principales

- `GET /productos` — Lista los productos
- `POST /pedidos` — Crea un pedido
- `POST /crear-preferencia` — Crea una preferencia de pago de Mercado Pago




