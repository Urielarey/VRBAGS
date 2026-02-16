# Script para instalar dependencias en PowerShell
# Ejecutar: .\install-dependencies.ps1

Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Cyan
npm install

Write-Host "`n📦 Instalando dependencias del frontend..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

Write-Host "`n✅ Todas las dependencias instaladas correctamente!" -ForegroundColor Green
Write-Host "`nPróximos pasos:" -ForegroundColor Yellow
Write-Host "1. Poblar base de datos: node backend/scripts/populateProducts.js"
Write-Host "2. Iniciar aplicación: npm run dev"
