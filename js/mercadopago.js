// Script para agregar al carrito desde la Home (sin backend, flujo por WhatsApp)

document.addEventListener('DOMContentLoaded', function () {
  const botonesComprar = document.querySelectorAll('.comprar-btn');
  botonesComprar.forEach(boton => {
    boton.addEventListener('click', function () {
      const producto = {
        id: (this.getAttribute('data-nombre') || 'producto').toLowerCase().replace(/\s+/g, '-'),
        nombre: this.getAttribute('data-nombre') || 'Producto',
        precio: Number(this.getAttribute('data-precio')) || 0,
        imagen: ''
      };

      if (window.agregarAlCarrito) {
        window.agregarAlCarrito(producto);
        alert('Producto agregado al carrito. Podés finalizar la compra desde el carrito.');
      } else if (window.carrito) {
        // Fallback si no existe helper
        const botonTemp = document.createElement('button');
        botonTemp.dataset.id = producto.id;
        botonTemp.dataset.nombre = producto.nombre;
        botonTemp.dataset.precio = producto.precio;
        botonTemp.dataset.imagen = producto.imagen;
        window.carrito.agregarProducto(botonTemp);
        alert('Producto agregado al carrito. Podés finalizar la compra desde el carrito.');
      } else {
        alert('No se pudo agregar al carrito. Recargá la página.');
      }
    });
  });
});



