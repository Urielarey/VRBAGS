# VRBAGS - WhatsApp Bot (Cloud API)

Este bot responde automáticamente en WhatsApp con el flujo solicitado.

## Requisitos
- Cuenta de Meta Developers (`developers.facebook.com`)
- App con producto WhatsApp + número asignado (Cloud API)
- Variables: `ACCESS_TOKEN`, `PHONE_NUMBER_ID`, `VERIFY_TOKEN`

## Variables de entorno
Crear un archivo `.env` (no subido) con:

```
ACCESS_TOKEN=TU_TOKEN_LARGO_DE_META
VERIFY_TOKEN=vrbags_verify_token
PHONE_NUMBER_ID=ID_DEL_NUMERO_DE_WHATSAPP
PORT=3000
```

## Iniciar
```
cd bot
npm i
npm run start
```
Despliega la URL pública del webhook (ej. Vercel, Railway, Render) y configúrala en la app de Meta: `https://TU_URL/webhook`.

## Webhook
- Verificación: `GET /webhook`
- Recepción de mensajes: `POST /webhook`
