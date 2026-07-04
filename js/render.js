/* Renderiza TESTIMONIALS y GALLERY (js/data.js) en sus páginas.
   No editar para añadir contenido — edita js/data.js. */
(() => {
  "use strict";

  const lang = () => (typeof window.cifeLang === "function" ? window.cifeLang() : "es");
  const pick = (item, field) => (lang() === "en" && item[field + "En"] ? item[field + "En"] : item[field]);
  const emptyNote = () =>
    `<p class="empty-note">${lang() === "en" ? "Coming soon." : "Contenido próximamente."}</p>`;

  function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    const items = typeof GALLERY !== "undefined" && Array.isArray(GALLERY) ? GALLERY : [];
    if (items.length === 0) { grid.innerHTML = emptyNote(); return; }
    grid.innerHTML = items.map((item) => `
      <figure class="gallery-item">
        <img src="${item.src}" alt="${pick(item, "alt")}" loading="lazy">
        <figcaption>${pick(item, "caption")}</figcaption>
      </figure>`).join("");
  }

  function renderTestimonials() {
    const list = document.getElementById("testimonials-list");
    if (!list) return;
    const items = typeof TESTIMONIALS !== "undefined" && Array.isArray(TESTIMONIALS) ? TESTIMONIALS : [];
    if (items.length === 0) { list.innerHTML = emptyNote(); return; }
    list.innerHTML = items.map((t) => `
      <blockquote class="testimonial-card">
        <p class="testimonial-quote">“${pick(t, "quote")}”</p>
        <footer>
          <span class="testimonial-name">${t.name}</span>
          <span class="testimonial-role">${pick(t, "role")}</span>
        </footer>
      </blockquote>`).join("");
  }

  function renderAll() { renderGallery(); renderTestimonials(); }

  document.addEventListener("DOMContentLoaded", renderAll);
  window.addEventListener("cife:lang", renderAll);
})();
