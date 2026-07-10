/* Shared header/footer for all pages. Edit nav links or footer text HERE only. */
(() => {
  "use strict";

  const NAV_LINKS = [
    { page: "inicio",      href: "index.html",        label: "Inicio" },
    { page: "nosotros",    href: "about.html",        label: "Sobre Nosotros" },
    { page: "servicios",   href: "services.html",     label: "Servicios" },
    { page: "galeria",     href: "gallery.html",      label: "Galería" },
    { page: "testimonios", href: "testimonials.html", label: "Testimonios" },
    { page: "por-que",     href: "why-us.html",       label: "¿Por Qué Elegirnos?" },
    { page: "contacto",    href: "contact.html",      label: "Contacto" },
  ];

  function buildHeader(activePage) {
    const links = NAV_LINKS.map(
      (l) => `<li><a href="${l.href}"${l.page === activePage ? ' class="active"' : ""} data-i18n="nav.${l.page}">${l.label}</a></li>`
    ).join("");
    return `
      <div class="header-inner container">
        <a href="index.html" class="brand">
          <img src="assets/logo.png" alt="CIFE — Centro de Instrucciones y Formación Educativa">
        </a>
        <nav class="site-nav">
          <ul>${links}</ul>
        </nav>
        <div class="header-actions">
          <div class="lang-toggle" role="group" aria-label="Idioma / Language">
            <button type="button" data-lang="es" aria-pressed="true">ES</button>
            <span class="sep">·</span>
            <button type="button" data-lang="en" aria-pressed="false">EN</button>
          </div>
          <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>`;
  }

  function buildFooter() {
    return `
      <div class="footer-inner container">
        <div class="footer-col footer-brand">
          <img class="footer-logo" src="assets/logo.png" alt="CIFE">
          <p data-i18n="footer.tagline">Centro de Instrucciones y Formación Educativa — apoyo educativo K-12 en Vega Alta, Puerto Rico.</p>
        </div>
        <div class="footer-col">
          <h3 data-i18n="footer.links">Enlaces</h3>
          <ul>
            <li><a href="services.html" data-i18n="nav.servicios">Servicios</a></li>
            <li><a href="gallery.html" data-i18n="nav.galeria">Galería</a></li>
            <li><a href="testimonials.html" data-i18n="nav.testimonios">Testimonios</a></li>
            <li><a href="contact.html" data-i18n="nav.contacto">Contacto</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 data-i18n="footer.contact">Contacto</h3>
          <ul>
            <li>Vega Alta, Puerto Rico</li>
            <li>(787) 000-0000</li>
            <li>info@centroeducativocife.com</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} CIFE — Centro de Instrucciones y Formación Educativa</p>
      </div>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    if (header) header.innerHTML = buildHeader(document.body.dataset.page);
    if (footer) footer.innerHTML = buildFooter();

    const toggle = header ? header.querySelector(".nav-toggle") : null;
    const nav = header ? header.querySelector(".site-nav") : null;
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
  });
})();
