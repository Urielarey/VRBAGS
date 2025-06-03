/*contador y botones*/
function actualizarContadorCarrito() {
  const cartCountElements = document.querySelectorAll("#cart-count");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  cartCountElements.forEach(el => el.textContent = carrito.length);
}

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();

  const botonesComprar = document.querySelectorAll(".comprar-btn");

  botonesComprar.forEach(boton => {
    boton.addEventListener("click", () => {
      const producto = {
        id: boton.dataset.id,
        nombre: boton.dataset.nombre,
        precio: parseInt(boton.dataset.precio),
        cantidad: 1
      };
      agregarAlCarrito(producto);
      alert(`${producto.nombre} agregado al carrito`);
    });
  });
});


/*carrito (mailito)*/
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const contenedor = document.getElementById('carrito-container');
    const totalEl = document.getElementById('total');

    function renderizarCarrito() {
      contenedor.innerHTML = '';
      let total = 0;

        totalEl.textContent = total;
  actualizarBotonEmail(); // ← actualiza el enlace mailto


      carrito.forEach((producto, index) => {
        total += producto.precio;

        const div = document.createElement('div');
        div.classList.add('carrito-item');
        div.innerHTML = `
          <span>${producto.nombre} - $${producto.precio}</span>
          <button class="button" onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        contenedor.appendChild(div);
      });

      totalEl.textContent = total;
    }

    function eliminarProducto(index) {
      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      renderizarCarrito();
    }

    function vaciarCarrito() {
      if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
        carrito = [];
        localStorage.removeItem('carrito');
        renderizarCarrito();
      }
    }
          function generarMensajeEmail() {
        if (carrito.length === 0) return '';

        let mensaje = 'Hola! Quiero hacer este pedido:%0D%0A%0D%0A';
        let total = 0;

        carrito.forEach(item => {
          mensaje += `• ${item.nombre} - $${item.precio}%0D%0A`;
          total += item.precio;
        });

        mensaje += `%0D%0ATotal: $${total}`;
        return mensaje;
      }

      function actualizarBotonEmail() {
        const link = document.getElementById('mail-btn');
        const asunto = encodeURIComponent('Pedido desde la tienda BYuro');
        const mensaje = generarMensajeEmail();
        const destino = 'contact.byuro@gmail.com'; // ← reemplazá por tu mail

        link.href = `mailto:${destino}?subject=${asunto}&body=${mensaje}`;
      }
    renderizarCarrito();


