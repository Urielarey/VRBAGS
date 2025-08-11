require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'TU_ACCESS_TOKEN_AQUI',
});
const preference = new Preference(client);

// Datos en memoria
let productos = [
  { id: 1, nombre: 'Bolso 1', precio: 1000 },
  { id: 2, nombre: 'Bolso 2', precio: 1500 }
];
let pedidos = [];

// Rutas básicas
app.get('/productos', (req, res) => {
  res.json(productos);
});

app.post('/pedidos', (req, res) => {
  const pedido = req.body;
  pedido.id = pedidos.length + 1;
  pedidos.push(pedido);
  res.status(201).json(pedido);
});

// Ruta para crear preferencia de pago
app.post('/crear-preferencia', async (req, res) => {
  try {
    const { descripcion, precio, cantidad } = req.body;
    const body = {
      items: [
        {
          title: descripcion,
          unit_price: Number(precio),
          quantity: Number(cantidad),
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      auto_return: 'approved',
    };
    const respuesta = await preference.create({ body });
    res.json({ id: respuesta.id, init_point: respuesta.init_point });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
