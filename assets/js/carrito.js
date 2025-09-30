// Este evento se asegura de que el script se ejecute solo cuando todo el HTML esté cargado.
document.addEventListener('DOMContentLoaded', () => {

    // El carrito será un array de productos. Lo obtenemos de sessionStorage o lo iniciamos vacío.
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    // ==================================================================
    // --- CAMBIO: AÑADIMOS UN FORMATEADOR PARA PESOS COLOMBIANOS (COP) ---
    // ==================================================================
    const formatoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0 // No queremos decimales para COP
    });

    // Seleccionamos los elementos del DOM que necesitaremos
    const carritoItemsContainer = document.getElementById('carrito-items');
    const carritoTotalSpan = document.getElementById('carrito-total');
    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    const botonFinalizarCompra = document.getElementById('finalizar-compra');

    // --- FUNCIÓN PARA RENDERIZAR EL CARRITO ---
    function renderizarCarrito() {
        if (!carritoItemsContainer || !carritoTotalSpan) {
            return;
        }

        carritoItemsContainer.innerHTML = '';
        if (carrito.length === 0) {
            carritoItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
            carritoTotalSpan.textContent = formatoCOP.format(0); // <-- CAMBIO AQUÍ
            return;
        }

        let total = 0;
        carrito.forEach(item => {
            const subtotal = parseFloat(item.precio) * item.cantidad; // Calculamos el subtotal
            const itemElement = document.createElement('div');
            itemElement.classList.add('carrito-item');
            itemElement.innerHTML = `
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>${formatoCOP.format(subtotal)}</span> 
            `;// <-- CAMBIO AQUÍ
            carritoItemsContainer.appendChild(itemElement);
            total += subtotal;
        });
        
        // Formateamos el total final a COP
        carritoTotalSpan.textContent = formatoCOP.format(total); // <-- CAMBIO AQUÍ
    }

    // --- FUNCIÓN PARA AÑADIR UN ITEM AL CARRITO ---
    function agregarAlCarrito(id, nombre, precio) {
        const itemExistente = carrito.find(item => item.id === id);
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
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
    }
    
    // --- MANEJO DE EVENTOS ---

    document.addEventListener('click', (evento) => {
        if (evento.target.classList.contains('agregar-carrito')) {
            const boton = evento.target;
            const id = boton.dataset.id;
            const nombre = boton.dataset.nombre;
            const precio = parseFloat(boton.dataset.precio);
            
            agregarAlCarrito(id, nombre, precio);
        }
    });

    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', vaciarCarrito);
    }

    if (botonFinalizarCompra) {
        botonFinalizarCompra.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. Añade productos antes de finalizar la compra.");
                return;
            }

            const tuNumero = "573193740550"; 

            let mensaje = "¡Hola! Quisiera hacer el siguiente pedido:\n\n";
            let totalPedido = 0;

            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                mensaje += `*Producto:* ${item.nombre}\n`;
                mensaje += `*Cantidad:* ${item.cantidad}\n`;
                // Formateamos el subtotal en el mensaje de WhatsApp también
                mensaje += `*Subtotal:* ${formatoCOP.format(subtotal)}\n\n`; // <-- CAMBIO AQUÍ
                totalPedido += subtotal;
            });

            // Formateamos el total en el mensaje de WhatsApp
            mensaje += `*TOTAL DEL PEDIDO:* ${formatoCOP.format(totalPedido)}`; // <-- CAMBIO AQUÍ

            const mensajeCodificado = encodeURIComponent(mensaje);
            const urlWhatsApp = `https://wa.me/${tuNumero}?text=${mensajeCodificado}`;

            window.open(urlWhatsApp, '_blank');
        });
    }

    // --- INICIALIZACIÓN ---
    renderizarCarrito();

});