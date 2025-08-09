const express = require('express');
const mercadopago = require('mercadopago');
const router = express.Router();

// Middleware para validar datos de entrada
const validarOrden = (req, res, next) => {
  const { items, total } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      error: 'Datos de orden inválidos',
      message: 'La orden debe contener al menos un producto'
    });
  }

  if (!total || total <= 0) {
    return res.status(400).json({ 
      error: 'Total inválido',
      message: 'El total debe ser mayor a 0'
    });
  }

  // Validar cada item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.title || !item.unit_price || !item.quantity) {
      return res.status(400).json({ 
        error: 'Producto inválido',
        message: `El producto ${i + 1} no tiene todos los campos requeridos`
      });
    }
    
    if (item.unit_price <= 0 || item.quantity <= 0) {
      return res.status(400).json({ 
        error: 'Valores inválidos',
        message: `El producto ${i + 1} tiene precio o cantidad inválidos`
      });
    }
  }

  next();
};

// Ruta para crear una orden de pago
router.post('/crear-orden', validarOrden, async (req, res) => {
  try {
    const { items, total, customer } = req.body;
    
    console.log('📦 Creando orden:', { items: items.length, total, customer });

    // Crear preferencia de Mercado Pago
    const preference = {
      items: items.map(item => ({
        title: item.title,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        picture_url: item.picture_url || '',
        currency_id: 'ARS',
        description: item.description || item.title
      })),
      back_urls: {
        success: `${req.protocol}://${req.get('host')}/success`,
        failure: `${req.protocol}://${req.get('host')}/failure`,
        pending: `${req.protocol}://${req.get('host')}/pending`
      },
      auto_return: 'approved',
      external_reference: `VRBAGS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `${req.protocol}://${req.get('host')}/api/webhook`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      statement_descriptor: 'VRBAGS',
      binary_mode: true, // Solo acepta pagos aprobados o rechazados
      payment_methods: {
        excluded_payment_types: [
          { id: 'ticket' } // Excluir pagos en efectivo para simplificar
        ],
        installments: 12 // Permitir hasta 12 cuotas
      }
    };

    // Agregar información del cliente si está disponible
    if (customer) {
      preference.payer = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      };
    }

    console.log('🔧 Creando preferencia en Mercado Pago...');
    const response = await mercadopago.preferences.create(preference);
    
    console.log('✅ Preferencia creada:', response.body.id);
    
    res.json({
      success: true,
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point,
      external_reference: preference.external_reference,
      message: 'Orden creada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al crear orden:', error);
    
    let errorMessage = 'Error al procesar la orden';
    let statusCode = 500;

    if (error.name === 'MercadoPagoError') {
      errorMessage = error.message;
      statusCode = 400;
    }

    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Webhook para notificaciones de Mercado Pago
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    console.log('🔔 Webhook recibido:', { type, data });
    
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obtener información del pago
      const payment = await mercadopago.payment.get(paymentId);
      
      const paymentInfo = {
        id: payment.body.id,
        status: payment.body.status,
        status_detail: payment.body.status_detail,
        amount: payment.body.transaction_amount,
        external_reference: payment.body.external_reference,
        payment_method: payment.body.payment_method?.type,
        installments: payment.body.installments,
        date_created: payment.body.date_created,
        date_approved: payment.body.date_approved
      };
      
      console.log('💳 Información del pago:', paymentInfo);

      // Aquí puedes agregar lógica para actualizar tu base de datos
      // Por ejemplo, marcar la orden como pagada, enviar email de confirmación, etc.
      
      // Simular procesamiento de la orden
      await procesarOrdenPagada(paymentInfo);
    }

    res.status(200).json({ 
      success: true,
      received: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error en webhook',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Función para procesar orden pagada
async function procesarOrdenPagada(paymentInfo) {
  try {
    console.log('🔄 Procesando orden pagada:', paymentInfo.external_reference);
    
    // Aquí implementarías la lógica de tu negocio:
    // 1. Actualizar estado de la orden en tu base de datos
    // 2. Enviar email de confirmación al cliente
    // 3. Actualizar inventario
    // 4. Generar factura
    // 5. Notificar al equipo de logística
    
    console.log('✅ Orden procesada exitosamente');
    
    return true;
  } catch (error) {
    console.error('❌ Error procesando orden:', error);
    throw error;
  }
}

// Ruta para obtener el estado de un pago
router.get('/payment-status/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    if (!paymentId) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de pago requerido' 
      });
    }
    
    console.log('🔍 Consultando estado del pago:', paymentId);
    
    const payment = await mercadopago.payment.get(paymentId);
    
    const paymentStatus = {
      id: payment.body.id,
      status: payment.body.status,
      status_detail: payment.body.status_detail,
      amount: payment.body.transaction_amount,
      external_reference: payment.body.external_reference,
      payment_method: payment.body.payment_method?.type,
      installments: payment.body.installments,
      date_created: payment.body.date_created,
      date_approved: payment.body.date_approved,
      last_updated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      payment: paymentStatus
    });
  } catch (error) {
    console.error('❌ Error al obtener estado del pago:', error);
    
    let errorMessage = 'Error al obtener estado del pago';
    let statusCode = 500;

    if (error.name === 'MercadoPagoError') {
      errorMessage = 'Pago no encontrado';
      statusCode = 404;
    }

    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Ruta para obtener productos (opcional, para futuras expansiones)
router.get('/productos', (req, res) => {
  try {
    const productos = [
      {
        id: 'miri-grande-amarillo',
        nombre: 'Bolso Miri Grande Amarillo',
        precio: 45000,
        categoria: 'Bolsos Miri',
        imagen: '/assets/Bolso Miri Grande Amarillo.jpg',
        descripcion: 'Bolso elegante y espacioso, perfecto para el día a día.',
        stock: 10
      },
      {
        id: 'miri-grande-marron',
        nombre: 'Bolso Miri Grande Marrón',
        precio: 45000,
        categoria: 'Bolsos Miri',
        imagen: '/assets/Bolso Miri Grande Marron.jpg',
        descripcion: 'Bolso clásico en marrón, ideal para cualquier ocasión.',
        stock: 8
      },
      {
        id: 'caktus-beige',
        nombre: 'Caktus Beige',
        precio: 42000,
        categoria: 'Bolsos Caktus',
        imagen: '/assets/Caktus Beige.jpg',
        descripcion: 'Bolso elegante en beige, perfecto para looks minimalistas.',
        stock: 5
      }
    ];
    
    res.json({
      success: true,
      productos,
      total: productos.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener productos',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Ruta de estado de la API
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mercadopago: 'Conectado'
  });
});

module.exports = router;
