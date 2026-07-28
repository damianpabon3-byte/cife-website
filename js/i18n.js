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
    "footer.tagline": "Center for Integral Formative Education — K-12 educational support in Vega Alta, Puerto Rico.",
    "footer.legalName": "Center for Integral Formative Education",
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
    "home.hero.titlePre": "Helping every student discover their ",
    "home.hero.titleHl": "potential",
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
    "home.cta.titlePre": "What ",
    "home.cta.titleHl": "families",
    "home.cta.titlePost": " say",
    "home.cta.sub": "Stories from families who trusted CIFE.",
    "home.cta.btn": "Read testimonials",

    // ---- Común / Shared ----
    "common.example.short": "Example text: a brief description.",

    // ---- Sobre Nosotros / About ----
    "about.eyebrow": "About Us",
    "about.titlePre": "Who we ",
    "about.titleHl": "are",
    "about.intro": "CIFE, Center for Integral Formative Education, is dedicated to reinforcing a variety of academic skills. We are driven by an educational and social commitment to our community. We aspire to cultivate an environment of respect within our center—one that promotes core values and a commitment to seeking new educational tools that contribute to intellectual growth. We strive to ensure our services adapt to generational changes and respond effectively to the needs of our clients.",
    "about.mission.title": "Mission",
    "about.mission.body": "To contribute to the holistic development of our students. To foster—through the use of diverse strategies adapted to our current reality—the continuous pursuit of expanding and reinforcing various skills that contribute to the development of more well-rounded individuals and institutions.",
    "about.vision.title": "Vision",
    "about.vision.body": "To become an Educational Center recognized and distinguished for the tools it provides toward the formation of critical thinkers, fully equipped to effectively exercise their social roles within the diverse environments in which they operate.",
    "about.values.title": "Our values",
    "about.value.compromiso": "Commitment",
    "about.value.compromiso.body": "We hold an unwavering pact with the future of our community, providing innovative tools to ensure the intellectual and personal growth of every student.",
    "about.value.respeto": "Respect",
    "about.value.respeto.body": "We foster an empathetic and inclusive learning ecosystem, honoring individuality and adapting to generational changes so our students can flourish with confidence.",
    "about.value.excelencia": "Excellence",
    "about.value.excelencia.body": "We relentlessly pursue the highest educational quality through innovative strategies, aiming to shape critical thinkers equipped for today's challenges.",

    // ---- Servicios / Services ----
    "services.eyebrow": "Services",
    "services.titlePre": "How we support your ",
    "services.titleHl": "student",
    "services.intro": "Example text: an introductory paragraph about CIFE's educational approach.",
    "services.s1.title": "K-12 Tutoring",
    "services.s1.desc": "Example text: a description of the tutoring service — subjects covered, grades served, individual or group format.",
    "services.s1.item": "Example text: subject or benefit included",
    "services.s2.title": "Homeschooling Program",
    "services.s2.desc": "Example text: a description of the home education program — curriculum, parent guidance, registration and documentation.",
    "services.s2.item": "Example text: program component",
    "services.s3.title": "Academic Preparation",
    "services.s3.desc": "Example text: a description of academic reinforcement, test preparation, and study skills.",
    "services.s3.item": "Example text: preparation area",
    "services.cta.titlePre": "Interested in ",
    "services.cta.titleHl": "enrolling",
    "services.cta.titlePost": " your student?",
    "services.cta.sub": "Example text: an invitation to reach out for a no-commitment orientation.",

    // ---- Por Qué Elegirnos / Why Us ----
    "why.eyebrow": "Why Choose Us?",
    "why.titlePre": "The ",
    "why.titleHl": "CIFE",
    "why.titlePost": " difference",
    "why.intro": "Example text: a brief paragraph about what sets CIFE apart from other educational options.",
    "why.f1.title": "Certified teachers",
    "why.f2.title": "Individualized attention",
    "why.f3.title": "Safe environment",
    "why.f4.title": "Flexible schedules",
    "why.f5.title": "A family feel",
    "why.f6.title": "Continuous follow-up",
    "why.stat.years": "Years of experience",
    "why.stat.students": "Students served",
    "why.stat.grades": "All grade levels",
    "why.stat.commit": "Commitment",
    "why.stats.note": "Example numbers — they will be updated with real data.",
    "why.cta.titlePre": "Meet us in ",
    "why.cta.titleHl": "person",
    "why.cta.sub": "Example text: an invitation to visit the center or ask for more information.",
    "why.cta.btn": "Go to Contact",

    // ---- Galería / Gallery ----
    "gallery.eyebrow": "Gallery",
    "gallery.titlePre": "Our center in ",
    "gallery.titleHl": "photos",
    "gallery.sub": "Example images — they will be replaced with real photos of the center.",

    // ---- Testimonios / Testimonials ----
    "testimonials.eyebrow": "Testimonials",
    "testimonials.titlePre": "What ",
    "testimonials.titleHl": "families",
    "testimonials.titlePost": " say",
    "testimonials.sub": "Example testimonials — they will be replaced with real ones.",
    "testimonials.cta.titlePre": "Become part of the ",
    "testimonials.cta.titleHl": "CIFE family",
    "testimonials.cta.sub": "Example text: an invitation to explore our services.",
    "testimonials.cta.btn": "See services",

    // ---- Contacto / Contact ----
    "contact.eyebrow": "Contact",
    "contact.titlePre": "We're here for ",
    "contact.titleHl": "you",
    "contact.sub": "Example text: an invitation to reach out through whichever channel you prefer.",
    "contact.phone": "Phone",
    "contact.phone.value": "(787) 000-0000 — example number",
    "contact.wa.link": "Message us on WhatsApp",
    "contact.note": "— example",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.address.value": "Example text: 123 Main Street, Vega Alta, PR 00692",
    "contact.hours": "Hours",
    "contact.hours.value": "Example text: Monday to Friday, 8:00 AM – 5:00 PM",
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
