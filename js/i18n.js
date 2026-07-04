/* ============================================================
   IDIOMA — ES/EN
   TODO el texto en inglés del sitio vive en este archivo.
   Para editar inglés: cambia el valor de la clave correspondiente.
   Para editar español: edita el HTML de la página (como siempre).
   ============================================================ */
(() => {
  "use strict";

  const I18N_EN = {
    // ---- Navegación / Navigation ----
    "nav.inicio": "Home",
    "nav.nosotros": "About Us",
    "nav.servicios": "Services",
    "nav.galeria": "Gallery",
    "nav.testimonios": "Testimonials",
    "nav.por-que": "Why Choose Us?",
    "nav.contacto": "Contact",

    // ---- Pie de página / Footer ----
    "footer.tagline": "Centro de Instrucciones y Formación Educativa — K-12 educational support in Vega Alta, Puerto Rico.",
    "footer.links": "Links",
    "footer.contact": "Contact",

    // ---- Títulos de pestaña / Tab titles ----
    "title.nosotros": "About Us | CIFE",
    "title.servicios": "Services | CIFE",
    "title.galeria": "Gallery | CIFE",
    "title.testimonios": "Testimonials | CIFE",
    "title.por-que": "Why Choose Us? | CIFE",
    "title.contacto": "Contact | CIFE",

    // ---- Inicio / Home ----
    "home.hero.title": "Helping every student discover their potential",
    "home.hero.sub": "At CIFE we walk alongside Vega Alta families with K-12 tutoring, homeschooling, and academic prep — in a warm, safe environment tailored to each child.",
    "home.hero.cta1": "Explore our services",
    "home.hero.cta2": "Contact us",
    "home.services.title": "Our services",
    "home.services.sub": "Support tailored to every student, at every stage of their learning.",
    "home.card.tutoring.title": "K-12 Tutoring",
    "home.card.tutoring.desc": "Example text: brief description of subject- and grade-level tutoring.",
    "home.card.homeschool.title": "Homeschooling",
    "home.card.homeschool.desc": "Example text: brief description of the home education program.",
    "home.card.prep.title": "Academic Preparation",
    "home.card.prep.desc": "Example text: brief description of reinforcement and test preparation.",
    "home.card.more": "Learn more →",
    "home.why.title": "Why CIFE?",
    "home.why.sub": "More than tutoring: we are an educational community committed to your children's success.",
    "home.why.cta": "See the reasons",
    "home.cta.title": "What families say",
    "home.cta.sub": "Stories from families who trusted CIFE.",
    "home.cta.btn": "Read testimonials",
  };

  const STORAGE_KEY = "cife-lang";
  let titleEs = null;

  function resolveLang() {
    const param = new URLSearchParams(location.search).get("lang");
    if (param === "en" || param === "es") {
      localStorage.setItem(STORAGE_KEY, param);
      return param;
    }
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es";
  }

  function apply(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (el.dataset.i18nEs === undefined) el.dataset.i18nEs = el.textContent;
      el.textContent = lang === "en" && I18N_EN[key] ? I18N_EN[key] : el.dataset.i18nEs;
    });

    if (titleEs === null) titleEs = document.title;
    const titleKey = "title." + document.body.dataset.page;
    document.title = lang === "en" && I18N_EN[titleKey] ? I18N_EN[titleKey] : titleEs;

    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-toggle button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    window.dispatchEvent(new CustomEvent("cife:lang", { detail: { lang } }));
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
  }

  // Leído por render.js para el contenido de data.js.
  window.cifeLang = () => (document.documentElement.lang === "en" ? "en" : "es");

  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-toggle button");
      if (btn) setLang(btn.dataset.lang);
    });
    apply(resolveLang());
  });
})();
