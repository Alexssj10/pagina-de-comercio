// Este evento se asegura de que el script se ejecute solo cuando todo el HTML esté cargado.
document.addEventListener('DOMContentLoaded', () => {

    // El carrito será un array de productos. Lo obtenemos de sessionStorage o lo iniciamos vacío.
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    // Seleccionamos los elementos del DOM que necesitaremos
    const carritoItemsContainer = document.getElementById('carrito-items');
    const carritoTotalSpan = document.getElementById('carrito-total');
    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    
    // --- FUNCIÓN PARA RENDERIZAR EL CARRITO (Sin cambios) ---
    function renderizarCarrito() {
        carritoItemsContainer.innerHTML = '';
        if (carrito.length === 0) {
            carritoItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
            carritoTotalSpan.textContent = '0.00';
            return;
        }
        let total = 0;
        carrito.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('carrito-item');
            itemElement.innerHTML = `
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>$${(parseFloat(item.precio) * item.cantidad).toFixed(2)}</span>
            `;
            carritoItemsContainer.appendChild(itemElement);
            total += parseFloat(item.precio) * item.cantidad;
        });
        carritoTotalSpan.textContent = total.toFixed(2);
    }

    // --- FUNCIÓN PARA AÑADIR UN ITEM AL CARRITO (Sin cambios) ---
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
    
    // --- FUNCIÓN PARA VACIAR EL CARRITO (Sin cambios) ---
    function vaciarCarrito() {
        carrito = [];
        guardarCarritoEnStorage();
        renderizarCarrito();
    }

    // --- FUNCIÓN PARA GUARDAR EL CARRITO EN SESSIONSTORAGE (Sin cambios) ---
    function guardarCarritoEnStorage() {
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
    }
    
    // ==================================================================
    // --- MANEJO DE EVENTOS (AQUÍ ESTÁ EL CAMBIO IMPORTANTE) ---
    // ==================================================================

    // En lugar de vigilar solo la sección '.productos', ahora vigilamos TODA la página.
    // Esto funciona tanto en el catálogo como en las páginas de producto individuales.
    document.addEventListener('click', (evento) => {
        // Verificamos si el elemento clickeado tiene la clase 'agregar-carrito'
        if (evento.target.classList.contains('agregar-carrito')) {
            const boton = evento.target;
            const id = boton.dataset.id;
            const nombre = boton.dataset.nombre;
            const precio = parseFloat(boton.dataset.precio);
            
            agregarAlCarrito(id, nombre, precio);
        }
    });

    // El evento para vaciar el carrito no necesita cambios, pero nos aseguramos que no falle si no está en la página.
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', vaciarCarrito);
    }

    // --- INICIALIZACIÓN ---
    // Renderizamos el carrito por primera vez al cargar la página (si el contenedor existe)
    if (carritoItemsContainer) {
        renderizarCarrito();
    }
});