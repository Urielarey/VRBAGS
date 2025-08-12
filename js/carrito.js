// Sistema de Carrito para VRBAGS
class Carrito {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('carrito')) || [];
    this.checkoutModalInitialized = false;
    this.init();
  }

  init() {
    this.actualizarContadorCarrito();
    this.configurarEventos();
    this.renderizarCarrito();
  }

  configurarEventos() {
    // Delegación robusta de eventos en todo el documento
    document.addEventListener('click', async (e) => {
      // Agregar al carrito
      const addBtn = e.target.closest('.add-to-cart-btn');
      if (addBtn) {
        this.agregarProducto(addBtn);
        return;
      }

      // Eliminar item
      const removeBtn = e.target.closest('.remove-item');
      if (removeBtn) {
        await this.solicitarEliminar(removeBtn);
        return;
      }

      // Actualizar cantidad
      const qtyBtn = e.target.closest('.update-quantity');
      if (qtyBtn) {
        const index = parseInt(qtyBtn.dataset.index);
        const action = qtyBtn.dataset.action;
        if (!Number.isNaN(index) && (action === 'increase' || action === 'decrease')) {
          this.actualizarCantidad(index, action);
        }
        return;
      }

      // Vaciar carrito
      const clearBtn = e.target.closest('.vaciar-carrito');
      if (clearBtn) {
        await this.solicitarVaciar();
        return;
      }

      // Checkout
      const checkoutBtn = e.target.closest('.checkout-btn');
      if (checkoutBtn) {
        this.procesarCompra();
        return;
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

  // Modal de confirmación (blanco y negro)
  ensureConfirmModal() {
    if (document.getElementById('confirmModal')) return;

    const modalHtml = `
      <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-light border border-light rounded-4">
            <div class="modal-header border-0">
              <h5 class="modal-title">Confirmar acción</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p id="confirmMessage" class="mb-0">¿Estás seguro?</p>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-outline-light" data-action="cancel">Cancelar</button>
              <button type="button" class="btn btn-light text-dark" data-action="ok">Aceptar</button>
            </div>
          </div>
        </div>
      </div>`;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);
  }

  confirmar(mensaje) {
    this.ensureConfirmModal();

    const modalEl = document.getElementById('confirmModal');
    const msgEl = document.getElementById('confirmMessage');
    if (msgEl) msgEl.textContent = mensaje || '¿Confirmás esta acción?';

    const Bootstrap = window.bootstrap;
    const modal = Bootstrap && Bootstrap.Modal
      ? Bootstrap.Modal.getOrCreateInstance(modalEl)
      : null;

    return new Promise((resolve) => {
      const okBtn = modalEl.querySelector('[data-action="ok"]');
      const cancelBtn = modalEl.querySelector('[data-action="cancel"]');

      const cleanup = () => {
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
        modalEl.removeEventListener('hidden.bs.modal', onCancel);
      };
      const onOk = () => { cleanup(); modal && modal.hide(); resolve(true); };
      const onCancel = () => { cleanup(); resolve(false); };

      okBtn.addEventListener('click', onOk);
      cancelBtn.addEventListener('click', onCancel);
      modalEl.addEventListener('hidden.bs.modal', onCancel, { once: true });

      if (modal) modal.show(); else { modalEl.style.display = 'block'; }
    });
  }

  async solicitarEliminar(indexOrBtn) {
    let indexNum = typeof indexOrBtn === 'number' ? indexOrBtn : NaN;
    if (typeof indexOrBtn !== 'number') {
      const btn = indexOrBtn;
      const fromAttr = Number.parseInt(btn?.dataset?.index, 10);
      if (!Number.isNaN(fromAttr)) indexNum = fromAttr;
      else {
        const container = btn?.closest('.carrito-item');
        const fromContainer = Number.parseInt(container?.getAttribute('data-index'), 10);
        if (!Number.isNaN(fromContainer)) indexNum = fromContainer;
      }
    }

    if (typeof indexNum !== 'number' || Number.isNaN(indexNum) || indexNum < 0 || indexNum >= this.items.length) {
      console.warn('No se pudo resolver el índice del item a eliminar');
      return;
    }

    const nombre = this.items[indexNum]?.nombre || 'este producto';
    const ok = await this.confirmar(`¿Estás seguro de que querés eliminar ${nombre}?`);
    if (!ok) return;
    const productoEliminado = this.items[indexNum].nombre;
    this.eliminarProducto(indexNum);
    this.mostrarNotificacion(`${productoEliminado} eliminado del carrito`, 'info');
  }

  async solicitarVaciar() {
    const ok = await this.confirmar('¿Querés vaciar el carrito por completo?');
    if (!ok) return;
    this.items = [];
    this.guardarCarrito();
    this.actualizarContadorCarrito();
    this.renderizarCarrito();
    this.mostrarNotificacion('Carrito vaciado', 'warning');
  }

  // Eliminar un producto por índice y refrescar UI
  eliminarProducto(index) {
    if (index < 0 || index >= this.items.length) return;
    this.items.splice(index, 1);
    this.guardarCarrito();
    this.actualizarContadorCarrito();
    this.renderizarCarrito();
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
    const subtotalEl = document.getElementById('subtotal');
    
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
      if (subtotalEl) subtotalEl.textContent = '$0';
      return;
    }

    let total = 0;

    this.items.forEach((producto, index) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;

      const div = document.createElement('div');
      div.classList.add('carrito-item', 'border-bottom', 'pb-3', 'mb-3', 'animate__animated', 'animate__fadeIn');
      div.setAttribute('data-index', String(index));
      div.setAttribute('data-id', producto.id || '');
      div.innerHTML = `
        <div class="row g-2 align-items-center">
          <div class="col-3 col-md-2">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded" style="max-height: 60px; object-fit: cover;">
          </div>
          <div class="col-9 col-md-6">
            <h6 class="mb-1">${producto.nombre}</h6>
            <p class="text-muted mb-0">$${producto.precio.toLocaleString()}</p>
          </div>
          <div class="col-7 col-md-2 mt-2 mt-md-0">
            <div class="btn-group btn-group-sm w-100" role="group">
              <button type="button" class="btn btn-outline-secondary update-quantity" data-index="${index}" data-action="decrease" title="Disminuir cantidad" data-id="${producto.id || ''}">
                <i class="bi bi-dash"></i>
              </button>
              <span class="btn btn-outline-secondary disabled flex-grow-1">${producto.cantidad}</span>
              <button type="button" class="btn btn-outline-secondary update-quantity" data-index="${index}" data-action="increase" title="Aumentar cantidad" data-id="${producto.id || ''}">
                <i class="bi bi-plus"></i>
              </button>
            </div>
          </div>
          <div class="col-5 col-md-2 text-end mt-2 mt-md-0">
            <p class="mb-1 fw-bold">$${subtotal.toLocaleString()}</p>
            <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}" data-id="${producto.id || ''}" title="Eliminar producto">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });

    if (subtotalEl) {
      subtotalEl.textContent = `$${total.toLocaleString()}`;
    }
    if (totalEl) {
      totalEl.textContent = `$${total.toLocaleString()}`;
      totalEl.classList.remove('text-primary');
      totalEl.classList.add('text-dark');
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

  ensureCheckoutModal() {
    if (this.checkoutModalInitialized) return;

    // Crear e inyectar modal si no existe
    if (!document.getElementById('checkoutModal')) {
      const modalHtml = `
      <div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form id="checkout-form">
              <div class="modal-header">
                <h5 class="modal-title">Finalizar compra</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre y apellido</label>
                  <input type="text" class="form-control" id="nombreCompleto" placeholder="Tu nombre" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Método de pago</label>
                  <select id="metodoPago" class="form-select" required>
                    <option value="Transferencia" selected>Transferencia</option>
                    <option value="Mercado Pago">Mercado Pago</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Envío o retiro</label>
                  <select id="tipoEnvio" class="form-select" required>
                    <option value="Envío a domicilio" selected>Envío a domicilio</option>
                    <option value="Retiro en sucursal">Retiro en sucursal</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Dirección / Detalle</label>
                  <textarea id="detalleEnvio" class="form-control" rows="2" placeholder="Dirección, localidad o punto de retiro"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Notas (opcional)</label>
                  <textarea id="notas" class="form-control" rows="2" placeholder="Instrucciones o comentarios"></textarea>
                </div>
                <div class="alert alert-light border">
                  <div class="d-flex justify-content-between">
                    <span>Productos</span>
                    <strong id="resumenCantidad">0</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Total</span>
                    <strong id="resumenTotal">$0</strong>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-success"><i class="bi bi-whatsapp"></i> Enviar por WhatsApp</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHtml;
      document.body.appendChild(wrapper);
    }

    // Listener submit (solo una vez)
    const form = document.getElementById('checkout-form');
    if (form && !form.dataset.bound) {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        this.enviarWhatsappDesdeFormulario();
      });
      form.dataset.bound = 'true';
    }

    this.checkoutModalInitialized = true;
  }

  abrirCheckoutModal() {
    // Actualizar resumen
    const resumenCantidad = document.getElementById('resumenCantidad');
    const resumenTotal = document.getElementById('resumenTotal');
    if (resumenCantidad) resumenCantidad.textContent = `${this.obtenerCantidadTotal()} ítems`;
    if (resumenTotal) resumenTotal.textContent = `$${this.obtenerTotal().toLocaleString('es-AR')}`;

    // Mostrar modal
    const modalEl = document.getElementById('checkoutModal');
    if (modalEl) {
      const Bootstrap = window.bootstrap;
      if (Bootstrap && Bootstrap.Modal) {
        const modal = Bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      } else {
        // Fallback simple
        modalEl.style.display = 'block';
        modalEl.classList.add('show');
      }
    }
  }

  enviarWhatsappDesdeFormulario() {
    const nombreCliente = document.getElementById('nombreCompleto')?.value?.trim() || 'Cliente';
    const metodoPago = document.getElementById('metodoPago')?.value || 'Transferencia';
    const tipoEnvio = document.getElementById('tipoEnvio')?.value || 'Envío a domicilio';
    const detalleEnvio = document.getElementById('detalleEnvio')?.value?.trim() || 'A coordinar';
    const notas = document.getElementById('notas')?.value?.trim();

    const lineas = [];
    lineas.push(`Hola, soy ${nombreCliente}. Quiero realizar una compra:`);
    lineas.push('');
    this.items.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      lineas.push(`- ${item.nombre} x${item.cantidad} = $${subtotal.toLocaleString('es-AR')}`);
    });
    lineas.push('');
    lineas.push(`Total: $${this.obtenerTotal().toLocaleString('es-AR')}`);
    lineas.push(`Método de pago: ${metodoPago}`);
    lineas.push(`${tipoEnvio}: ${detalleEnvio}`);
    if (notas) {
      lineas.push('');
      lineas.push(`Notas: ${notas}`);
    }
    lineas.push('');
    lineas.push('¿Me confirmás disponibilidad y coordinamos el envío? ¡Gracias!');

    const mensaje = lineas.join('\n');
    const numero = '5491168666761';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    // Cerrar modal (si existe)
    const modalEl = document.getElementById('checkoutModal');
    if (modalEl) {
      const Bootstrap = window.bootstrap;
      if (Bootstrap && Bootstrap.Modal) {
        const modal = Bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
      } else {
        modalEl.classList.remove('show');
        modalEl.style.display = 'none';
      }
    }

    // Abrir WhatsApp
    window.open(url, '_blank');
    this.mostrarNotificacion('Abriendo WhatsApp para finalizar la compra...', 'info');
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

    // Asegurar modal y abrirlo
    this.ensureCheckoutModal();
    this.abrirCheckoutModal();
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


