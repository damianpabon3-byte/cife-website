/* v3.1: fade-in sutil al entrar en el viewport. Sin dependencias.
   Mejora progresiva — si este archivo no corre, el sitio se ve estático (v3). */
(() => {
  "use strict";

  const SELECTOR = [
    ".hero-text", ".hero-photo", ".page-head", ".card", ".feature",
    ".service-text", ".service-media", ".gallery-item", ".testimonial-card",
    ".cta-coupon", ".stat", ".section-heading",
  ].join(", ");

  document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(SELECTOR).forEach((el) => {
      const pos = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = Math.min(pos * 70, 280) + "ms";
      el.classList.add("reveal");
      io.observe(el);
    });
  });
})();
