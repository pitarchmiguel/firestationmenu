document.addEventListener("DOMContentLoaded", () => {
    const carta = document.getElementById("carta");
    let lastScrollY = window.scrollY;
  
    window.addEventListener("scroll", () => {
      if (window.scrollY > lastScrollY) {
        // Scroll hacia abajo: Mostrar la carta
        carta.classList.add("visible");
        carta.classList.remove("hidden");
      } else {
        // Scroll hacia arriba: Ocultar la carta
        carta.classList.remove("visible");
        carta.classList.add("hidden");
      }
      lastScrollY = window.scrollY; // Actualiza la posición del scroll
    });
  });
  