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
        const producto = document.createElement("div");
        producto.classList.add("producto");
        producto.style.opacity = 0; // Para animación

        // Generar nombre de archivo a partir del nombre del producto
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

        producto.innerHTML = `
          <img src="images/${item.imagen}" alt="${item.nombre}">
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <span class="precio">${item.precio}</span>
          <a href="${nombreArchivo}" class="button">Ver más</a>
        `;

        contenedor.appendChild(producto);

        // Animación fade-in con retraso por índice
        setTimeout(() => {
          producto.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          producto.style.opacity = 1;
          producto.style.transform = "translateY(0)";
        }, 100 * index);
      });
    })
    .catch((error) => console.error("Error cargando catálogo:", error));
});
