// assets/js/catalogo.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/data/catalogo.json")
    .then(response => response.json())
    .then(data => {
      const contenedor = document.querySelector(".productos");

      data.forEach(item => {
        const producto = document.createElement("div");
        producto.classList.add("producto");

        producto.innerHTML = `
          <img src="images/${item.imagen}" alt="${item.nombre}">
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <span class="precio">${item.precio}</span>
        `;

        contenedor.appendChild(producto);
      });
    })
    .catch(error => console.error("Error cargando catálogo:", error));
});
