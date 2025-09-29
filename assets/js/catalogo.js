document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/data/catalogo.json")
    .then((response) => response.json())
    .then((data) => {
      const contenedor = document.querySelector(".productos");

      if (!contenedor) {
        console.error("No se encontró el contenedor .productos en tu HTML.");
        return;
      }

      data.forEach((item, index) => {
        // --- CAMBIO IMPORTANTE ---
        // Asegúrate de que tu archivo catalogo.json tenga un campo "id" único para cada producto.
        // Si no lo tienes, puedes usar 'index' temporalmente, pero un 'id' es mejor.
        const productoId = item.id || index;
        
        // --- CAMBIO IMPORTANTE ---
        // Limpiamos el precio para asegurarnos de que sea un número válido para el carrito.
        // Esto quita el símbolo '$', comas, y espacios. Ej: "$ 1,500.00" -> "1500.00"
        const precioNumerico = String(item.precio).replace(/[$,\s]/g, '').trim();

        const producto = document.createElement("div");
        producto.classList.add("producto");
        producto.style.opacity = 0; // Para animación

        // Generar nombre de archivo a partir del nombre del producto (tu lógica original)
        const nombreArchivo =
          "producto-" +
          item.nombre
            .toLowerCase()
            .replace(/[áàäâ]/g, "a")
            .replace(/[éèëê]/g, "e")
            .replace(/[íìïî]/g, "i")
            .replace(/[óòöô]/g, "o")
            .replace(/[úùüû]/g, "u")
            .replace(/ñ/g, "n")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          ".html";
        
        // --- HTML DEL PRODUCTO MODIFICADO ---
        // Se ha añadido el botón "Añadir al Carrito" con los atributos data-* necesarios.
        producto.innerHTML = `
          <img src="images/${item.imagen}" alt="${item.nombre}">
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <span class="precio">$ ${precioNumerico}</span>
          <a href="${nombreArchivo}" class="button">Ver más</a>
          <button class="button agregar-carrito" 
                  data-id="${productoId}" 
                  data-nombre="${item.nombre}" 
                  data-precio="${precioNumerico}">
              Añadir al Carrito
          </button>
        `;

        contenedor.appendChild(producto);

        // Animación fade-in con retraso por índice (tu lógica original)
        setTimeout(() => {
          producto.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          producto.style.opacity = 1;
          producto.style.transform = "translateY(0)";
        }, 100 * index);
      });
    })
    .catch((error) => console.error("Error cargando catálogo:", error));
});