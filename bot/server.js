import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "vrbags_verify_token";
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Texto de bienvenida y menú según pedido
const WELCOME_TEXT = `¡Bienvenido/a a VRBAGS!\n\nSi compraste y vas a pagar por Mercado Pago o transferencia, el alias es: Urielarey.2006\n\nSi querés pagar en efectivo, respondé con 1.\nEn unos instantes nos comunicamos con vos.\n\nSi es una consulta, respondé con 2.\nEn unos instantes nos comunicamos con vos.`;

app.get("/", (_, res) => res.send("VRBAGS WhatsApp Bot activo"));

// Verificación del webhook (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"]; 
  const token = req.query["hub.verify_token"]; 
  const challenge = req.query["hub.challenge"]; 
  if (mode === "subscribe" && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

// Recepción de mensajes (POST)
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (message?.from) {
      const from = message.from; // ej: 5491162712068
      const text = message.text?.body?.trim().toLowerCase() || "";

      let reply = WELCOME_TEXT;
      if (text === "1") {
        reply = "Perfecto. Registramos tu preferencia de pago en efectivo. En unos instantes nos comunicamos con vos.";
      } else if (text === "2") {
        reply = "¡Gracias por tu consulta! En unos instantes nos comunicamos con vos.";
      }

      await sendText(from, reply);
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(200);
  }
});

async function sendText(to, body) {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.warn("Faltan ACCESS_TOKEN o PHONE_NUMBER_ID");
    return;
  }
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      text: { body }
    })
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot VRBAGS escuchando en :${PORT}`));
