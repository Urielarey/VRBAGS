#!/bin/bash

echo "========================================"
echo "    INSTALADOR DE VRBAGS ECOMMERCE"
echo "========================================"
echo

echo "[1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado"
    echo "Por favor, instala Node.js desde: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js encontrado: $(node --version)"

echo
echo "[2/5] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Fallo al instalar dependencias"
    exit 1
fi
echo "✓ Dependencias instaladas"

echo
echo "[3/5] Creando archivo .env..."
if [ ! -f .env ]; then
    cat > .env << EOF
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
EOF
    echo "✓ Archivo .env creado"
else
    echo "✓ Archivo .env ya existe"
fi

echo
echo "[4/5] Verificando estructura del proyecto..."
if [ ! -f "pages/tienda.html" ]; then
    echo "ERROR: Estructura del proyecto incompleta"
    echo "Por favor, verifica que todos los archivos estén presentes"
    exit 1
fi
echo "✓ Estructura del proyecto verificada"

echo
echo "[5/5] Configuración completada!"
echo
echo "========================================"
echo "    PRÓXIMOS PASOS:"
echo "========================================"
echo
echo "1. Edita el archivo .env con tu token de Mercado Pago"
echo "2. Para obtener tu token visita: https://www.mercadopago.com.ar/developers/panel/credentials"
echo "3. Ejecuta: npm run dev"
echo "4. Abre: http://localhost:3000"
echo
echo "========================================"
echo "    ¡INSTALACIÓN COMPLETADA!"
echo "========================================"
echo
