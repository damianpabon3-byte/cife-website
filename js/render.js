/* Renderiza TESTIMONIALS y GALLERY (js/data.js) en sus páginas.
   No editar para añadir contenido — edita js/data.js. */
(() => {
  "use strict";

  const EMPTY_NOTE = '<p class="empty-note">Contenido próximamente.</p>';

  function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    const items = typeof GALLERY !== "undefined" && Array.isArray(GALLERY) ? GALLERY : [];
    if (items.length === 0) { grid.innerHTML = EMPTY_NOTE; return; }
    grid.innerHTML = items.map((item) => `
      <figure class="gallery-item">
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
        <figcaption>${item.caption}</figcaption>
      </figure>`).join("");
  }

  function renderTestimonials() {
    const list = document.getElementById("testimonials-list");
    if (!list) return;
    const items = typeof TESTIMONIALS !== "undefined" && Array.isArray(TESTIMONIALS) ? TESTIMONIALS : [];
    if (items.length === 0) { list.innerHTML = EMPTY_NOTE; return; }
    list.innerHTML = items.map((t) => `
      <blockquote class="testimonial-card">
        <p class="testimonial-quote">“${t.quote}”</p>
        <footer>
          <span class="testimonial-name">${t.name}</span>
          <span class="testimonial-role">${t.role}</span>
        </footer>
      </blockquote>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderGallery();
    renderTestimonials();
  });
})();
