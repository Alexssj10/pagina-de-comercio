// Este evento se asegura de que el script se ejecute solo cuando todo el HTML esté cargado.
document.addEventListener("DOMContentLoaded", () => {
  // El carrito será un array de productos. Lo obtenemos de sessionStorage o lo iniciamos vacío.
  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

  // Seleccionamos los elementos del DOM que necesitaremos
  const carritoItemsContainer = document.getElementById("carrito-items");
  const carritoTotalSpan = document.getElementById("carrito-total");
  const botonVaciarCarrito = document.getElementById("vaciar-carrito");
  const botonFinalizarCompra = document.getElementById("finalizar-compra");

  // --- FUNCIÓN PARA RENDERIZAR EL CARRITO ---
  function renderizarCarrito() {
    // Solo intentamos renderizar si los elementos del carrito existen en la página
    if (!carritoItemsContainer || !carritoTotalSpan) {
      return;
    }

    carritoItemsContainer.innerHTML = "";
    if (carrito.length === 0) {
      carritoItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
      carritoTotalSpan.textContent = "0.00";
      return;
    }

    let total = 0;
    carrito.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("carrito-item");
      itemElement.innerHTML = `
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>$${(parseFloat(item.precio) * item.cantidad).toFixed(
                  2
                )}</span>
            `;
      carritoItemsContainer.appendChild(itemElement);
      total += parseFloat(item.precio) * item.cantidad;
    });
    carritoTotalSpan.textContent = total.toFixed(2);
  }

  // --- FUNCIÓN PARA AÑADIR UN ITEM AL CARRITO ---
  function agregarAlCarrito(id, nombre, precio) {
    const itemExistente = carrito.find((item) => item.id === id);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    guardarCarritoEnStorage();
    renderizarCarrito();
  }

  // --- FUNCIÓN PARA VACIAR EL CARRITO ---
  function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    renderizarCarrito();
  }

  // --- FUNCIÓN PARA GUARDAR EL CARRITO EN SESSIONSTORAGE ---
  function guardarCarritoEnStorage() {
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // ==================================================================
  // --- MANEJO DE EVENTOS ---
  // ==================================================================

  // Event listener universal para los botones "Añadir al Carrito"
  document.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("agregar-carrito")) {
      const boton = evento.target;
      const id = boton.dataset.id;
      const nombre = boton.dataset.nombre;
      const precio = parseFloat(boton.dataset.precio);

      agregarAlCarrito(id, nombre, precio);
    }
  });

  // Event listener para el botón "Vaciar Carrito" (si existe en la página)
  if (botonVaciarCarrito) {
    botonVaciarCarrito.addEventListener("click", vaciarCarrito);
  }

  // Event listener para el botón "Finalizar Compra" (si existe en la página)
  if (botonFinalizarCompra) {
    botonFinalizarCompra.addEventListener("click", () => {
      if (carrito.length === 0) {
        alert(
          "Tu carrito está vacío. Añade productos antes de finalizar la compra."
        );
        return;
      }

      // Reemplaza con tu número de WhatsApp en formato internacional (ej: 57 para Colombia)
      const tuNumero = "573193740550";

      let mensaje = "¡Hola! Quisiera hacer el siguiente pedido:\n\n";
      let totalPedido = 0;

      carrito.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `*Producto:* ${item.nombre}\n`;
        mensaje += `*Cantidad:* ${item.cantidad}\n`;
        mensaje += `*Subtotal:* $${subtotal.toFixed(2)}\n\n`;
        totalPedido += subtotal;
      });

      mensaje += `*TOTAL DEL PEDIDO:* $${totalPedido.toFixed(2)}`;

      const mensajeCodificado = encodeURIComponent(mensaje);
      const urlWhatsApp = `https://wa.me/${tuNumero}?text=${mensajeCodificado}`;

      window.open(urlWhatsApp, "_blank");
    });
  }

  // --- INICIALIZACIÓN ---
  // Renderizamos el carrito por primera vez al cargar cualquier página
  renderizarCarrito();
});
