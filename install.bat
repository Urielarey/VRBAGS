@echo off
echo ========================================
echo    INSTALADOR DE VRBAGS ECOMMERCE
echo ========================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado
    echo Por favor, instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

echo.
echo [2/5] Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)
echo ✓ Dependencias instaladas

echo.
echo [3/5] Creando archivo .env...
if not exist .env (
    echo # Configuración de Mercado Pago > .env
    echo # Para pruebas usa: TEST-1234567890123456789012345678901234567890 >> .env
    echo # Para producción obtén tu token real desde: https://www.mercadopago.com.ar/developers/panel/credentials >> .env
    echo MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890123456789012345678901234567890 >> .env
    echo. >> .env
    echo # Configuración del servidor >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # Configuración de seguridad >> .env
    echo SESSION_SECRET=vrbags-session-secret-key-2024 >> .env
    echo. >> .env
    echo # URLs de la aplicación >> .env
    echo BASE_URL=http://localhost:3000 >> .env
    echo ✓ Archivo .env creado
) else (
    echo ✓ Archivo .env ya existe
)

echo.
echo [4/5] Verificando estructura del proyecto...
if not exist "pages\tienda.html" (
    echo ERROR: Estructura del proyecto incompleta
    echo Por favor, verifica que todos los archivos estén presentes
    pause
    exit /b 1
)
echo ✓ Estructura del proyecto verificada

echo.
echo [5/5] Configuración completada!
echo.
echo ========================================
echo    PRÓXIMOS PASOS:
echo ========================================
echo.
echo 1. Edita el archivo .env con tu token de Mercado Pago
echo 2. Para obtener tu token visita: https://www.mercadopago.com.ar/developers/panel/credentials
echo 3. Ejecuta: npm run dev
echo 4. Abre: http://localhost:3000
echo.
echo ========================================
echo    ¡INSTALACIÓN COMPLETADA!
echo ========================================
echo.
pause
