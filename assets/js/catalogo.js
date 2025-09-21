document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector("#catalogo .productos");

  // Si no existe la sección, no hacemos nada
  if (!contenedor) return;

  fetch("assets/data/catalogo.json")
    .then(response => response.json())
    .then(data => {
      data.forEach((item, index) => {
        const producto = document.createElement("div");
        producto.classList.add("producto");

        producto.innerHTML = `
          <img src="images/${item.imagen}" alt="${item.nombre}">
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <span class="precio">${item.precio}</span>
        `;

        contenedor.appendChild(producto);

        // Animación fade-in
        setTimeout(() => {
          producto.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          producto.style.opacity = 1;
          producto.style.transform = "translateY(0)";
        }, 100 * index);
      });
    })
    .catch(error => console.error("Error cargando catálogo:", error));
});
