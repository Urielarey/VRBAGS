require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

/**
 * Script para poblar la base de datos con productos iniciales
 */
const products = [
  {
    title: 'Bolso Miri Grande Amarillo',
    description: 'Bolso Miri tamaño grande en color amarillo',
    code: 'MIRI-GRANDE-AMARILLO',
    price: 105000,
    status: true,
    stock: 10,
    category: 'Miri',
    thumbnails: ['/assets/Bolso Miri Grande Amarillo.jpg']
  },
  {
    title: 'Bolso Miri Grande Marrón',
    description: 'Bolso Miri tamaño grande en color marrón',
    code: 'MIRI-GRANDE-MARRON',
    price: 105000,
    status: true,
    stock: 10,
    category: 'Miri',
    thumbnails: ['/assets/Bolso Miri Grande Marron.jpg']
  },
  {
    title: 'Bolso Miri Grande Violeta',
    description: 'Bolso Miri tamaño grande en color violeta',
    code: 'MIRI-GRANDE-VIOLETA',
    price: 105000,
    status: true,
    stock: 10,
    category: 'Miri',
    thumbnails: ['/assets/Bolso Miri Grande Violeta.jpg']
  },
  {
    title: 'Bolso Miri Mediano Marrón',
    description: 'Bolso Miri tamaño mediano en color marrón',
    code: 'MIRI-MEDIANO-MARRON',
    price: 95000,
    status: true,
    stock: 10,
    category: 'Miri',
    thumbnails: ['/assets/Bolso Miri Mediano Marron.jpg']
  },
  {
    title: 'Bolso Miri Mediano Rojo',
    description: 'Bolso Miri tamaño mediano en color rojo',
    code: 'MIRI-MEDIANO-ROJO',
    price: 95000,
    status: true,
    stock: 10,
    category: 'Miri',
    thumbnails: ['/assets/Bolso Miri Mediano Rojo.jpg']
  },
  {
    title: 'Bolso Miri Mediano Verde',
    description: 'Bolso Miri tamaño mediano en color verde',
    code: 'MIRI-MEDIANO-VERDE',
    price: 95000,
    status: true,
    stock: 10,
    category: 'Miri',
    thumbnails: ['/assets/Bolso Miri Mediano Verde.jpg']
  },
  {
    title: 'Caktus Beige',
    description: 'Bolso Caktus en color beige',
    code: 'CAKTUS-BEIGE',
    price: 80000,
    status: true,
    stock: 10,
    category: 'Caktus',
    thumbnails: ['/assets/Caktus Beige.jpg']
  },
  {
    title: 'Caktus Marrón',
    description: 'Bolso Caktus en color marrón',
    code: 'CAKTUS-MARRON',
    price: 80000,
    status: true,
    stock: 10,
    category: 'Caktus',
    thumbnails: ['/assets/Caktus Marron.jpg']
  },
  {
    title: 'Cata Marrón',
    description: 'Bolso Cata en color marrón',
    code: 'CATA-MARRON',
    price: 73000,
    status: true,
    stock: 10,
    category: 'Cata',
    thumbnails: ['/assets/Cata Marron.jpg']
  },
  {
    title: 'Cata Negra',
    description: 'Bolso Cata en color negro',
    code: 'CATA-NEGRA',
    price: 73000,
    status: true,
    stock: 10,
    category: 'Cata',
    thumbnails: ['/assets/Cata Negra.jpg']
  },
  {
    title: 'Emilia Small Marrón',
    description: 'Bolso Emilia tamaño pequeño en color marrón',
    code: 'EMILIA-SMALL-MARRON',
    price: 70000,
    status: true,
    stock: 10,
    category: 'Emilia',
    thumbnails: ['/assets/Emilio Smail Marron.jpg']
  },
  {
    title: 'Golfera Marrón',
    description: 'Bolso Golfera en color marrón',
    code: 'GOLFERA-MARRON',
    price: 55000,
    status: true,
    stock: 10,
    category: 'Golfera',
    thumbnails: ['/assets/Golfera Marron.jpg']
  },
  {
    title: 'Golfera Negra',
    description: 'Bolso Golfera en color negro',
    code: 'GOLFERA-NEGRA',
    price: 55000,
    status: true,
    stock: 10,
    category: 'Golfera',
    thumbnails: ['/assets/Golfera Negra.jpg']
  },
  {
    title: 'Golfera Roja',
    description: 'Bolso Golfera en color rojo',
    code: 'GOLFERA-ROJA',
    price: 55000,
    status: true,
    stock: 10,
    category: 'Golfera',
    thumbnails: ['/assets/Golfera Roja.jpg']
  },
  {
    title: 'Mini Chini',
    description: 'Bolso Mini Chini en color marrón',
    code: 'MINI-CHINI',
    price: 75000,
    status: true,
    stock: 10,
    category: 'Mini Chini',
    thumbnails: ['/assets/Mini Chini Marron Frente.jpg']
  },
  {
    title: 'Mochila Jackie Amarilla',
    description: 'Mochila Jackie en color amarillo',
    code: 'MOCHILA-JACKIE-AMARILLA',
    price: 85000,
    status: true,
    stock: 10,
    category: 'Mochilas',
    thumbnails: ['/assets/Mochila Jackie Amarilla.jpg']
  },
  {
    title: 'Monedero Bordo',
    description: 'Monedero en color bordo',
    code: 'MONEDERO-BORDO',
    price: 30000,
    status: true,
    stock: 10,
    category: 'Monederos',
    thumbnails: ['/assets/Monedero Bordo.jpg']
  },
  {
    title: 'Monedero Marrón',
    description: 'Monedero en color marrón',
    code: 'MONEDERO-MARRON',
    price: 30000,
    status: true,
    stock: 10,
    category: 'Monederos',
    thumbnails: ['/assets/Monedero Marron.jpg']
  },
  {
    title: 'Riñonera 3 Cierres Marrón Claro',
    description: 'Riñonera con 3 cierres en color marrón claro',
    code: 'RINONERA-MARRON-CLARO',
    price: 75000,
    status: true,
    stock: 10,
    category: 'Riñoneras',
    thumbnails: ['/assets/Riñonera 3 cierres Marron Claro.jpg']
  },
  {
    title: 'Riñonera 3 Cierres Marrón Oscuro',
    description: 'Riñonera con 3 cierres en color marrón oscuro',
    code: 'RINONERA-MARRON-OSCURO',
    price: 75000,
    status: true,
    stock: 10,
    category: 'Riñoneras',
    thumbnails: ['/assets/Riñonera 3 cierres Marron Oscuro.jpg']
  },
  {
    title: 'Paris Dorada',
    description: 'Bolso Paris en color dorado',
    code: 'PARIS-DORADA',
    price: 80000,
    status: true,
    stock: 10,
    category: 'Paris',
    thumbnails: ['/assets/Paris Dorada.jpg']
  },
  {
    title: 'Roma Marrón',
    description: 'Bolso Roma en color marrón',
    code: 'ROMA-MARRON',
    price: 85000,
    status: true,
    stock: 10,
    category: 'Roma',
    thumbnails: ['/assets/Roma Marron.jpg']
  },
  {
    title: 'Troya Marrón',
    description: 'Bolso Troya en color marrón',
    code: 'TROYA-MARRON',
    price: 110000,
    status: true,
    stock: 10,
    category: 'Troya',
    thumbnails: ['/assets/troyamarron.jpg']
  },
  {
    title: 'Troya Azul',
    description: 'Bolso Troya en color azul',
    code: 'TROYA-AZUL',
    price: 110000,
    status: true,
    stock: 10,
    category: 'Troya',
    thumbnails: ['/assets/troyaazul.jpg']
  }
];

async function populateProducts() {
  try {
    await connectDB();
    
    // Eliminar productos existentes (opcional)
    // await Product.deleteMany({});
    
    // Insertar productos
    for (const productData of products) {
      const existingProduct = await Product.findOne({ code: productData.code });
      if (!existingProduct) {
        await Product.create(productData);
        console.log(`✅ Producto creado: ${productData.title}`);
      } else {
        console.log(`⏭️  Producto ya existe: ${productData.title}`);
      }
    }
    
    console.log('✅ Base de datos poblada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
    process.exit(1);
  }
}

populateProducts();
