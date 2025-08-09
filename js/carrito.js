// Sistema de Carrito para VRBAGS
class Carrito {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('carrito')) || [];
    this.init();
  }

  init() {
    this.actualizarContadorCarrito();
    this.configurarEventos();
    this.renderizarCarrito();
  }

  configurarEventos() {
    // Eventos para botones de agregar al carrito
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        this.agregarProducto(e.target);
      }
    });

    // Eventos para botones del carrito
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        const index = parseInt(e.target.dataset.index);
        this.eliminarProducto(index);
      }
      
      if (e.target.classList.contains('update-quantity')) {
        const index = parseInt(e.target.dataset.index);
        const action = e.target.dataset.action;
        this.actualizarCantidad(index, action);
      }
      
      if (e.target.classList.contains('vaciar-carrito')) {
        this.vaciarCarrito();
      }
      
      if (e.target.classList.contains('checkout-btn')) {
        this.procesarCompra();
      }
    });
  }

  agregarProducto(boton) {
    const producto = {
      id: boton.dataset.id,
      nombre: boton.dataset.nombre,
      precio: parseInt(boton.dataset.precio),
      imagen: boton.dataset.imagen,
      cantidad: 1
    };

    // Verificar si el producto ya está en el carrito
    const itemExistente = this.items.find(item => item.id === producto.id);
    
    if (itemExistente) {
      itemExistente.cantidad += 1;
      this.mostrarNotificacion(`${producto.nombre} - Cantidad actualizada`, 'success');
    } else {
      this.items.push(producto);
      this.mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
    }

    this.guardarCarrito();
    this.actualizarContadorCarrito();
    this.renderizarCarrito();
  }

  eliminarProducto(index) {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
      const productoEliminado = this.items[index].nombre;
      this.items.splice(index, 1);
      this.guardarCarrito();
      this.actualizarContadorCarrito();
      this.renderizarCarrito();
      this.mostrarNotificacion(`${productoEliminado} eliminado del carrito`, 'info');
    }
  }

  actualizarCantidad(index, action) {
    if (action === 'increase') {
      this.items[index].cantidad += 1;
      this.mostrarNotificacion(`Cantidad de ${this.items[index].nombre} aumentada`, 'success');
    } else if (action === 'decrease') {
      if (this.items[index].cantidad > 1) {
        this.items[index].cantidad -= 1;
        this.mostrarNotificacion(`Cantidad de ${this.items[index].nombre} disminuida`, 'info');
      } else {
        this.eliminarProducto(index);
        return;
      }
    }
    
    this.guardarCarrito();
    this.actualizarContadorCarrito();
    this.renderizarCarrito();
  }

  vaciarCarrito() {
    if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
      this.items = [];
      this.guardarCarrito();
      this.actualizarContadorCarrito();
      this.renderizarCarrito();
      this.mostrarNotificacion('Carrito vaciado', 'warning');
    }
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.items));
  }

  actualizarContadorCarrito() {
    const cartCountElements = document.querySelectorAll("#cart-count");
    const totalItems = this.items.reduce((total, item) => total + item.cantidad, 0);
    
    cartCountElements.forEach(el => {
      el.textContent = totalItems;
      
      // Agregar animación cuando hay productos
      if (totalItems > 0) {
        el.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
          el.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
      }
    });
  }

  renderizarCarrito() {
    const contenedor = document.getElementById('carrito-container');
    const totalEl = document.getElementById('total');
    
    if (!contenedor) return;

    contenedor.innerHTML = '';
    
    if (this.items.length === 0) {
      contenedor.innerHTML = `
        <div class="text-center text-muted py-5">
          <i class="bi bi-cart-x" style="font-size: 3rem; color: #ccc;"></i>
          <p class="mt-3">Tu carrito está vacío</p>
          <a href="tienda.html" class="btn btn-primary">Ir a la tienda</a>
        </div>
      `;
      if (totalEl) totalEl.textContent = '$0';
      return;
    }

    let total = 0;

    this.items.forEach((producto, index) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;

      const div = document.createElement('div');
      div.classList.add('carrito-item', 'border-bottom', 'pb-3', 'mb-3', 'animate__animated', 'animate__fadeIn');
      div.innerHTML = `
        <div class="row align-items-center">
          <div class="col-2">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded" style="max-height: 60px; object-fit: cover;">
          </div>
          <div class="col-6">
            <h6 class="mb-1">${producto.nombre}</h6>
            <p class="text-muted mb-0">$${producto.precio.toLocaleString()}</p>
          </div>
          <div class="col-2">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-secondary update-quantity" data-index="${index}" data-action="decrease" title="Disminuir cantidad">
                <i class="bi bi-dash"></i>
              </button>
              <span class="btn btn-outline-secondary disabled">${producto.cantidad}</span>
              <button type="button" class="btn btn-outline-secondary update-quantity" data-index="${index}" data-action="increase" title="Aumentar cantidad">
                <i class="bi bi-plus"></i>
              </button>
            </div>
          </div>
          <div class="col-2 text-end">
            <p class="mb-1 fw-bold">$${subtotal.toLocaleString()}</p>
            <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}" title="Eliminar producto">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });

    if (totalEl) {
      totalEl.textContent = `$${total.toLocaleString()}`;
      totalEl.classList.add('animate__animated', 'animate__pulse');
      setTimeout(() => {
        totalEl.classList.remove('animate__animated', 'animate__pulse');
      }, 1000);
    }

    // Actualizar botón de checkout
    this.actualizarBotonCheckout();
  }

  actualizarBotonCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = this.items.length === 0;
      
      if (this.items.length > 0) {
        checkoutBtn.innerHTML = `
          <i class="bi bi-credit-card"></i>
          Proceder al Pago ($${this.obtenerTotal().toLocaleString()})
        `;
      } else {
        checkoutBtn.innerHTML = `
          <i class="bi bi-cart-x"></i>
          Carrito Vacío
        `;
      }
    }
  }

  mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear notificación toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    
    const alertClass = tipo === 'success' ? 'alert-success' : 
                      tipo === 'warning' ? 'alert-warning' : 
                      tipo === 'info' ? 'alert-info' : 'alert-danger';
    
    toast.innerHTML = `
      <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        <i class="bi bi-${tipo === 'success' ? 'check-circle' : 
                          tipo === 'warning' ? 'exclamation-triangle' : 
                          tipo === 'info' ? 'info-circle' : 'x-circle'}"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    // Agregar estilos
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remover después de 4 segundos
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }
    }, 4000);
  }

  async procesarCompra() {
    if (this.items.length === 0) {
      this.mostrarNotificacion('Tu carrito está vacío', 'warning');
      return;
    }

    try {
      // Mostrar loading
      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Procesando...';
      }

      // Crear orden para Mercado Pago
      const orden = {
        items: this.items.map(item => ({
          title: item.nombre,
          unit_price: item.precio,
          quantity: item.cantidad,
          picture_url: item.imagen,
          description: item.nombre
        })),
        total: this.obtenerTotal()
      };

      console.log('📦 Enviando orden:', orden);

      // Enviar al backend
      const response = await fetch('/api/crear-orden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orden)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la orden');
      }

      const data = await response.json();
      
      if (data.success && data.init_point) {
        this.mostrarNotificacion('Redirigiendo a Mercado Pago...', 'info');
        
        // Limpiar carrito antes de redirigir
        this.items = [];
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
        
        // Redirigir a Mercado Pago
        setTimeout(() => {
          window.location.href = data.init_point;
        }, 1500);
      } else {
        throw new Error('No se recibió el enlace de pago');
      }

    } catch (error) {
      console.error('❌ Error al procesar la compra:', error);
      
      // Restaurar botón de checkout
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        this.actualizarBotonCheckout();
      }
      
      this.mostrarNotificacion(
        `Error al procesar la compra: ${error.message}`, 
        'danger'
      );
    }
  }

  obtenerTotal() {
    return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  obtenerCantidadTotal() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  // Método para verificar si el carrito está vacío
  estaVacio() {
    return this.items.length === 0;
  }

  // Método para obtener resumen del carrito
  obtenerResumen() {
    return {
      items: this.items.length,
      cantidadTotal: this.obtenerCantidadTotal(),
      total: this.obtenerTotal()
    };
  }
}

// Inicializar carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  window.carrito = new Carrito();
  
  // Agregar estilos CSS para las animaciones
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    .animate__animated {
      animation-duration: 0.3s;
    }
    
    .carrito-item {
      transition: all 0.3s ease;
    }
    
    .carrito-item:hover {
      background-color: rgba(0,0,0,0.02);
      transform: translateX(5px);
    }
  `;
  document.head.appendChild(style);
});

// Función para exportar (compatibilidad con código existente)
function actualizarContadorCarrito() {
  if (window.carrito) {
    window.carrito.actualizarContadorCarrito();
  }
}

function agregarAlCarrito(producto) {
  if (window.carrito) {
    // Crear botón temporal para usar el método existente
    const botonTemp = document.createElement('button');
    botonTemp.dataset.id = producto.id;
    botonTemp.dataset.nombre = producto.nombre;
    botonTemp.dataset.precio = producto.precio;
    botonTemp.dataset.imagen = producto.imagen || '';
    
    window.carrito.agregarProducto(botonTemp);
  }
}


