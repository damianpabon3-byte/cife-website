# CIFE Website v1 (Client Draft) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete 7-page CIFE static website draft (Spanish placeholder content) ready for local review and later push to GitHub → Porkbun.

**Architecture:** Plain HTML pages sharing a JS-injected header/footer (`js/include.js`). Gallery and testimonials render from plain arrays in `js/data.js` via `js/render.js`. One stylesheet with all design tokens as CSS variables.

**Tech Stack:** HTML5, CSS3, vanilla JS. Only external resource: Google Fonts (Poppins + Inter). No build step, no dependencies.

## Global Constraints

- All copy in **Spanish**; placeholder body paragraphs must read as explicit examples ("Texto de ejemplo: …") while headlines stay natural.
- All paths **relative** — never a leading `/` (must work on file://, http.server, and Porkbun).
- Brand colors ONLY via CSS variables, exact values: `--color-primary: #D2344A`, `--color-primary-dark: #B12A3E`, `--color-secondary: #DD92A8`, `--color-accent-lime: #B6DD14`, `--color-accent-teal: #4DC4C0`.
- Lime/teal never as large blocks — icon strokes, hovers, small details only. No box-shadows, no gradients.
- `index.html` stays at repo root (repo root = deploy root).
- Mobile nav breakpoint is **900px** (spec said 768px, but 7 Spanish nav labels don't fit at 800px wide; spec updated to match).
- Working dir: `/home/mellowfllow/cife-website`. Commit at the end of every task with the Claude co-author trailer.
- Verification baseline per task: `node --check` for any JS written, then `curl` against `python -m http.server 8080` for page markers.

---

### Task 1: Asset layout + CSS foundation

**Files:**
- Move: `logo.jpeg` → `assets/logo.jpeg`; `colors.jpeg` → `docs/colors.jpeg`
- Create: `css/style.css`

**Interfaces:**
- Produces: every class used by later tasks — `.container`, `.eyebrow`, `.section-alt`, `.section-heading`, `.btn`/`.btn-outline`, `.card-grid`/`.card`, `.icon`/`.icon-teal`/`.icon-lime`/`.icon-primary`, header/footer/nav classes consumed by `include.js` (Task 2), `.gallery-grid`/`.gallery-item`, `.testimonials-grid`/`.testimonial-card`, `.empty-note`, `.contact-layout`, `.stats-row`/`.stat`, `.hero`, `.feature-list`/`.feature`, `.two-up`.

- [ ] **Step 1: Rearrange assets**

```bash
cd /home/mellowfllow/cife-website
mkdir -p assets css js docs
git mv logo.jpeg assets/logo.jpeg 2>/dev/null || mv logo.jpeg assets/logo.jpeg
mv colors.jpeg docs/colors.jpeg
```

(logo.jpeg/colors.jpeg are untracked at this point, so plain `mv` is the expected path.)

- [ ] **Step 2: Write `css/style.css`**

```css
/* ==========================================================================
   CIFE — Centro de Instrucciones y Formación Educativa
   Single stylesheet, all pages. Tokens first, then base, then components.
   ========================================================================== */

:root {
  /* Brand palette (from client) */
  --color-primary:        #D2344A;
  --color-primary-dark:   #B12A3E;
  --color-secondary:      #DD92A8;
  --color-secondary-tint: #FBF1F4;
  --color-accent-lime:    #B6DD14;
  --color-accent-teal:    #4DC4C0;

  /* Neutrals */
  --color-bg:         #FFFFFF;
  --color-bg-alt:     #F7F7F8;
  --color-text:       #26222A;
  --color-text-muted: #6B6570;
  --color-border:     #E9E4E7;

  /* Type */
  --font-heading: "Poppins", system-ui, -apple-system, sans-serif;
  --font-body:    "Inter", system-ui, -apple-system, sans-serif;

  /* Layout */
  --container: 1100px;
  --radius: 8px;
  --header-height: 76px;
}

/* ---------- Base ---------- */
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.65;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

img { max-width: 100%; display: block; }

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 0.5em;
}

h1 { font-size: 2.4rem; }
h2 { font-size: 1.7rem; }
h3 { font-size: 1.1rem; }

p { margin: 0 0 1em; }
p:last-child { margin-bottom: 0; }

a { color: var(--color-primary); text-decoration: none; }
a:hover { color: var(--color-accent-teal); }

.container { max-width: var(--container); margin: 0 auto; padding: 0 24px; }

main section { padding: 72px 0; }
.section-alt { background: var(--color-bg-alt); }

.section-heading { text-align: center; max-width: 640px; margin: 0 auto 48px; }
.section-heading p { color: var(--color-text-muted); }

.eyebrow {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.text-muted { color: var(--color-text-muted); }

/* ---------- Buttons ---------- */
.btn {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: var(--radius);
  border: 2px solid var(--color-primary);
  background: var(--color-primary);
  color: #fff;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.btn:hover { background: var(--color-primary-dark); border-color: var(--color-primary-dark); color: #fff; }

.btn-outline { background: transparent; color: var(--color-primary); }
.btn-outline:hover { background: var(--color-primary); color: #fff; }

/* ---------- Icons (inline SVG, feather-style strokes) ---------- */
.icon { width: 28px; height: 28px; flex-shrink: 0; }
.icon-teal    { color: var(--color-accent-teal); }
.icon-lime    { color: var(--color-accent-lime); }
.icon-primary { color: var(--color-primary); }
.icon-sm { width: 20px; height: 20px; }

/* ---------- Header / nav ---------- */
#site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: var(--header-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: var(--header-height);
}

.brand img { height: 46px; width: auto; }

.site-nav ul { display: flex; gap: 22px; list-style: none; margin: 0; padding: 0; }
.site-nav a {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text);
  padding: 6px 0;
  border-bottom: 2px solid transparent;
}
.site-nav a:hover { color: var(--color-primary); }
.site-nav a.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
}
.nav-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--color-text);
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.nav-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle.open span:nth-child(2) { opacity: 0; }
.nav-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 900px) {
  .nav-toggle { display: flex; }
  .site-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }
  .site-nav.open { display: block; }
  .site-nav ul { flex-direction: column; gap: 0; padding: 8px 24px 16px; }
  .site-nav a { display: block; padding: 12px 0; border-bottom: none; }
}

/* ---------- Hero (index) ---------- */
.hero { padding: 96px 0; text-align: center; }
.hero h1 { max-width: 720px; margin: 0 auto 0.4em; }
.hero .hero-sub { max-width: 560px; margin: 0 auto 32px; color: var(--color-text-muted); font-size: 1.1rem; }
.hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* ---------- Cards ---------- */
.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 32px 28px;
}
.card .icon { margin-bottom: 16px; }
.card p { color: var(--color-text-muted); font-size: 0.95rem; }
.card-link { font-weight: 600; font-size: 0.9rem; }

/* ---------- Two-up blocks (misión / visión) ---------- */
.two-up { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.two-up .card { border-top: 3px solid var(--color-secondary); }

/* ---------- Feature list (why-us, services bullets) ---------- */
.feature-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px 24px; }
.feature { display: flex; gap: 16px; align-items: flex-start; }
.feature h3 { margin-bottom: 0.25em; }
.feature p { color: var(--color-text-muted); font-size: 0.95rem; }

.check-list { list-style: none; padding: 0; margin: 0; }
.check-list li { display: flex; align-items: center; gap: 10px; padding: 6px 0; color: var(--color-text-muted); }

/* ---------- Stats row ---------- */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 40px 0;
}
.stat .stat-number {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 6px;
}
.stat .stat-label { color: var(--color-text-muted); font-size: 0.9rem; }

/* ---------- Service sections ---------- */
.service { display: grid; grid-template-columns: auto 1fr; gap: 24px; max-width: 780px; margin: 0 auto 48px; }
.service:last-child { margin-bottom: 0; }
.service p { color: var(--color-text-muted); }

/* ---------- Gallery ---------- */
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.gallery-item { margin: 0; }
.gallery-item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
}
.gallery-item figcaption { font-size: 0.88rem; color: var(--color-text-muted); padding-top: 10px; }

/* ---------- Testimonials ---------- */
.testimonials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.testimonial-card {
  margin: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-secondary);
  border-radius: var(--radius);
  padding: 28px;
}
.testimonial-quote { font-size: 1.02rem; }
.testimonial-card footer { display: flex; flex-direction: column; margin-top: 16px; }
.testimonial-name { font-weight: 600; font-size: 0.95rem; }
.testimonial-role { color: var(--color-text-muted); font-size: 0.85rem; }

.empty-note { text-align: center; color: var(--color-text-muted); padding: 40px 0; grid-column: 1 / -1; }

/* ---------- Contact ---------- */
.contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
.contact-list { list-style: none; padding: 0; margin: 0; }
.contact-list li { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; }
.contact-list .contact-label { display: block; font-weight: 600; font-size: 0.9rem; }
.contact-list .contact-value { color: var(--color-text-muted); font-size: 0.95rem; }
.map-embed { width: 100%; height: 380px; border: 1px solid var(--color-border); border-radius: var(--radius); }

/* ---------- CTA band ---------- */
.cta-band { background: var(--color-secondary-tint); text-align: center; }
.cta-band h2 { margin-bottom: 0.3em; }
.cta-band p { color: var(--color-text-muted); margin-bottom: 24px; }

/* ---------- Footer ---------- */
#site-footer { background: var(--color-bg-alt); border-top: 1px solid var(--color-border); margin-top: 0; }
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  padding: 56px 24px 40px;
}
.footer-brand img { height: 40px; width: auto; margin-bottom: 14px; }
.footer-brand p { color: var(--color-text-muted); font-size: 0.9rem; max-width: 320px; }
.footer-col h3 { font-size: 0.95rem; margin-bottom: 14px; }
.footer-col ul { list-style: none; padding: 0; margin: 0; }
.footer-col li { padding: 4px 0; font-size: 0.9rem; color: var(--color-text-muted); }
.footer-col a { color: var(--color-text-muted); }
.footer-col a:hover { color: var(--color-primary); }
.footer-bottom { border-top: 1px solid var(--color-border); text-align: center; padding: 18px 24px; }
.footer-bottom p { margin: 0; font-size: 0.82rem; color: var(--color-text-muted); }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  h1 { font-size: 2rem; }
  main section { padding: 56px 0; }
  .hero { padding: 64px 0; }
  .card-grid, .feature-list, .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .footer-inner { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .card-grid, .feature-list, .gallery-grid, .testimonials-grid,
  .two-up, .contact-layout, .stats-row { grid-template-columns: 1fr; }
  .footer-inner { grid-template-columns: 1fr; }
  .service { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify layout**

Run: `ls assets css docs js && grep -c 'var(--color-' css/style.css`
Expected: `assets/` contains `logo.jpeg`, `docs/` contains `colors.jpeg` + subfolders, `css/` contains `style.css`, `js/` empty; grep count > 40.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add asset layout and CSS foundation with brand design tokens"
```

---

### Task 2: Shared layout (`js/include.js`) + `index.html`

**Files:**
- Create: `js/include.js`, `index.html`

**Interfaces:**
- Consumes: header/nav/footer classes from `css/style.css` (Task 1).
- Produces: the shared page skeleton contract every later page copies: `<body data-page="...">`, `<header id="site-header"></header>`, `<footer id="site-footer"></footer>`, `<script src="js/include.js" defer></script>`. Valid `data-page` values: `inicio`, `nosotros`, `servicios`, `galeria`, `testimonios`, `por-que`, `contacto`.

- [ ] **Step 1: Write `js/include.js`**

```js
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
      (l) => `<li><a href="${l.href}"${l.page === activePage ? ' class="active"' : ""}>${l.label}</a></li>`
    ).join("");
    return `
      <div class="header-inner container">
        <a href="index.html" class="brand">
          <img src="assets/logo.jpeg" alt="CIFE — Centro de Instrucciones y Formación Educativa">
        </a>
        <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="site-nav">
          <ul>${links}</ul>
        </nav>
      </div>`;
  }

  function buildFooter() {
    return `
      <div class="footer-inner container">
        <div class="footer-col footer-brand">
          <img src="assets/logo.jpeg" alt="CIFE">
          <p>Centro de Instrucciones y Formación Educativa — apoyo educativo K-12 en Vega Alta, Puerto Rico.</p>
        </div>
        <div class="footer-col">
          <h3>Enlaces</h3>
          <ul>
            <li><a href="services.html">Servicios</a></li>
            <li><a href="gallery.html">Galería</a></li>
            <li><a href="testimonials.html">Testimonios</a></li>
            <li><a href="contact.html">Contacto</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contacto</h3>
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
```

- [ ] **Step 2: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CIFE — Centro de Instrucciones y Formación Educativa</title>
  <meta name="description" content="Apoyo educativo K-12, tutorías y homeschooling en Vega Alta, Puerto Rico.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="inicio">
  <header id="site-header"></header>

  <main>
    <section class="hero">
      <div class="container">
        <span class="eyebrow">Vega Alta, Puerto Rico</span>
        <h1>Apoyo educativo K-12 para el éxito de tus hijos</h1>
        <p class="hero-sub">Texto de ejemplo: aquí irá una breve descripción de CIFE — quiénes somos, a quién servimos y qué nos hace diferentes.</p>
        <div class="hero-actions">
          <a href="services.html" class="btn">Conoce nuestros servicios</a>
          <a href="contact.html" class="btn btn-outline">Contáctanos</a>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="container">
        <div class="section-heading">
          <h2>Nuestros servicios</h2>
          <p>Texto de ejemplo: resumen corto de las áreas de apoyo que ofrece CIFE.</p>
        </div>
        <div class="card-grid">
          <div class="card">
            <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <h3>Tutorías K-12</h3>
            <p>Texto de ejemplo: descripción breve del servicio de tutorías por materia y grado.</p>
            <a href="services.html" class="card-link">Ver más →</a>
          </div>
          <div class="card">
            <svg class="icon icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <h3>Homeschooling</h3>
            <p>Texto de ejemplo: descripción breve del programa de educación en el hogar.</p>
            <a href="services.html" class="card-link">Ver más →</a>
          </div>
          <div class="card">
            <svg class="icon icon-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <h3>Preparación académica</h3>
            <p>Texto de ejemplo: descripción breve de refuerzo y preparación para exámenes.</p>
            <a href="services.html" class="card-link">Ver más →</a>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-heading">
          <h2>¿Por qué CIFE?</h2>
          <p>Texto de ejemplo: dos o tres oraciones sobre la experiencia, el trato individualizado y el ambiente seguro que distingue a CIFE.</p>
          <a href="why-us.html" class="btn btn-outline">Conoce las razones</a>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <h2>Lo que dicen las familias</h2>
        <p>“Texto de ejemplo: cita corta de una madre o padre satisfecho con el progreso de su estudiante.”</p>
        <a href="testimonials.html" class="btn">Leer testimonios</a>
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>
  <script src="js/include.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Verify**

```bash
node --check js/include.js
(python -m http.server 8080 &>/dev/null &) ; sleep 1
curl -s http://localhost:8080/index.html | grep -c 'data-page="inicio"'
```

Expected: `node --check` silent (exit 0); grep prints `1`.

- [ ] **Step 4: Update spec breakpoint**

In `docs/superpowers/specs/2026-07-03-cife-website-v1-design.md`, change both mentions of the 768px nav breakpoint to 900px (Shared Layout Mechanism section and Responsive Behavior section) — 7 Spanish labels don't fit at 800px.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add shared header/footer injection and home page"
```

---

### Task 3: Static pages — `about.html`, `services.html`, `why-us.html`

**Files:**
- Create: `about.html`, `services.html`, `why-us.html`

**Interfaces:**
- Consumes: page skeleton contract from Task 2 (`data-page` values `nosotros`, `servicios`, `por-que`), CSS classes from Task 1.
- Produces: nothing consumed later.

Every page uses the same `<head>` as index.html with only `<title>`/`<meta name="description">` changed.

- [ ] **Step 1: Write `about.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sobre Nosotros | CIFE</title>
  <meta name="description" content="Conoce la misión, visión y valores de CIFE en Vega Alta, Puerto Rico.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="nosotros">
  <header id="site-header"></header>

  <main>
    <section>
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">Sobre Nosotros</span>
          <h1>Quiénes somos</h1>
          <p>Texto de ejemplo: párrafo introductorio sobre la historia de CIFE, cuándo se fundó y la comunidad a la que sirve en Vega Alta.</p>
        </div>
        <div class="two-up">
          <div class="card">
            <h3>Misión</h3>
            <p>Texto de ejemplo: la misión de CIFE — brindar apoyo educativo individualizado que ayude a cada estudiante a alcanzar su potencial.</p>
          </div>
          <div class="card">
            <h3>Visión</h3>
            <p>Texto de ejemplo: la visión de CIFE — ser el centro de referencia en apoyo educativo y homeschooling en la región.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="container">
        <div class="section-heading">
          <h2>Nuestros valores</h2>
        </div>
        <div class="card-grid">
          <div class="card">
            <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <h3>Compromiso</h3>
            <p>Texto de ejemplo: breve descripción de este valor.</p>
          </div>
          <div class="card">
            <svg class="icon icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3>Respeto</h3>
            <p>Texto de ejemplo: breve descripción de este valor.</p>
          </div>
          <div class="card">
            <svg class="icon icon-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <h3>Excelencia</h3>
            <p>Texto de ejemplo: breve descripción de este valor.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>
  <script src="js/include.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Write `services.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Servicios | CIFE</title>
  <meta name="description" content="Tutorías K-12, homeschooling y preparación académica en Vega Alta, Puerto Rico.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="servicios">
  <header id="site-header"></header>

  <main>
    <section>
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">Servicios</span>
          <h1>Cómo apoyamos a tu estudiante</h1>
          <p>Texto de ejemplo: párrafo introductorio sobre el enfoque educativo de CIFE.</p>
        </div>

        <div class="service">
          <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <div>
            <h2>Tutorías K-12</h2>
            <p>Texto de ejemplo: descripción del servicio de tutorías — materias cubiertas, grados atendidos, modalidad individual o grupal.</p>
            <ul class="check-list">
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: materia o beneficio incluido</li>
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: materia o beneficio incluido</li>
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: materia o beneficio incluido</li>
            </ul>
          </div>
        </div>

        <div class="service">
          <svg class="icon icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <div>
            <h2>Programa de Homeschooling</h2>
            <p>Texto de ejemplo: descripción del programa de educación en el hogar — currículo, acompañamiento a padres, registro y documentación.</p>
            <ul class="check-list">
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: componente del programa</li>
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: componente del programa</li>
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: componente del programa</li>
            </ul>
          </div>
        </div>

        <div class="service">
          <svg class="icon icon-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          <div>
            <h2>Preparación académica</h2>
            <p>Texto de ejemplo: descripción de refuerzo académico, preparación para exámenes y destrezas de estudio.</p>
            <ul class="check-list">
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: área de preparación</li>
              <li><svg class="icon icon-sm icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Texto de ejemplo: área de preparación</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <h2>¿Interesado en matricular a tu estudiante?</h2>
        <p>Texto de ejemplo: invitación a comunicarse para orientación sin compromiso.</p>
        <a href="contact.html" class="btn">Contáctanos</a>
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>
  <script src="js/include.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Write `why-us.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¿Por Qué Elegirnos? | CIFE</title>
  <meta name="description" content="Razones para elegir CIFE: maestros certificados, atención individualizada y un ambiente seguro.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="por-que">
  <header id="site-header"></header>

  <main>
    <section>
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">¿Por Qué Elegirnos?</span>
          <h1>La diferencia CIFE</h1>
          <p>Texto de ejemplo: párrafo breve sobre lo que distingue a CIFE de otras opciones educativas.</p>
        </div>
        <div class="feature-list">
          <div class="feature">
            <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <div><h3>Maestros certificados</h3><p>Texto de ejemplo: breve descripción.</p></div>
          </div>
          <div class="feature">
            <svg class="icon icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <div><h3>Atención individualizada</h3><p>Texto de ejemplo: breve descripción.</p></div>
          </div>
          <div class="feature">
            <svg class="icon icon-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div><h3>Ambiente seguro</h3><p>Texto de ejemplo: breve descripción.</p></div>
          </div>
          <div class="feature">
            <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div><h3>Horarios flexibles</h3><p>Texto de ejemplo: breve descripción.</p></div>
          </div>
          <div class="feature">
            <svg class="icon icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <div><h3>Trato familiar</h3><p>Texto de ejemplo: breve descripción.</p></div>
          </div>
          <div class="feature">
            <svg class="icon icon-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <div><h3>Seguimiento continuo</h3><p>Texto de ejemplo: breve descripción.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="container">
        <div class="stats-row">
          <div class="stat"><div class="stat-number">10+</div><div class="stat-label">Años de experiencia</div></div>
          <div class="stat"><div class="stat-number">200+</div><div class="stat-label">Estudiantes atendidos</div></div>
          <div class="stat"><div class="stat-number">K-12</div><div class="stat-label">Todos los grados</div></div>
          <div class="stat"><div class="stat-number">100%</div><div class="stat-label">Compromiso</div></div>
        </div>
        <p class="text-muted" style="text-align:center; margin-top:16px; font-size:0.85rem;">Números de ejemplo — se actualizarán con datos reales.</p>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <h2>Conócenos en persona</h2>
        <p>Texto de ejemplo: invitación a visitar el centro o pedir más información.</p>
        <a href="contact.html" class="btn">Ir a Contacto</a>
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>
  <script src="js/include.js" defer></script>
</body>
</html>
```

- [ ] **Step 4: Verify**

```bash
for p in about services why-us; do curl -s http://localhost:8080/$p.html | grep -o 'data-page="[a-z-]*"'; done
```

Expected output, one per line: `data-page="nosotros"`, `data-page="servicios"`, `data-page="por-que"`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add about, services, and why-us pages"
```

---

### Task 4: Data-driven pages — `data.js`, `render.js`, gallery SVGs, `gallery.html`, `testimonials.html`

**Files:**
- Create: `js/data.js`, `js/render.js`, `assets/gallery/foto-01.svg` … `foto-06.svg`, `gallery.html`, `testimonials.html`

**Interfaces:**
- Consumes: page skeleton contract (Task 2), CSS grid classes (Task 1).
- Produces: globals `TESTIMONIALS` and `GALLERY` (const arrays, defined in `data.js`, read by `render.js`); container IDs `#gallery-grid`, `#testimonials-list`. Script order on both pages: `data.js` → `render.js` → `include.js`, all `defer`.

- [ ] **Step 1: Generate placeholder gallery SVGs**

```bash
mkdir -p assets/gallery
for i in 1 2 3 4 5 6; do
cat > "assets/gallery/foto-0$i.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#F7F7F8"/>
  <rect x="0" y="572" width="800" height="28" fill="#DD92A8" opacity="0.4"/>
  <circle cx="400" cy="250" r="72" fill="#E9E4E7"/>
  <path d="M338 292 h124 l-36 -54 -28 30 -18 -16 z" fill="#FFFFFF"/>
  <circle cx="368" cy="222" r="10" fill="#FFFFFF"/>
  <text x="400" y="420" text-anchor="middle" font-family="sans-serif" font-size="34" fill="#6B6570">Foto de ejemplo $i</text>
</svg>
EOF
done
ls assets/gallery
```

Expected: `foto-01.svg` … `foto-06.svg` listed.

- [ ] **Step 2: Write `js/data.js`**

```js
/* ============================================================
   CONTENIDO EDITABLE — Testimonios y Galería
   Este es el ÚNICO archivo que hay que tocar para añadir contenido.
   ============================================================ */

/* --- TESTIMONIOS ---
   Para añadir uno: copia un bloque { ... }, pégalo antes del corchete
   final ] y edita el texto. No olvides la coma al final del bloque.

   Plantilla:
   { quote: "El testimonio aquí…", name: "Nombre Apellido", role: "Madre de estudiante de X grado" },
*/
const TESTIMONIALS = [
  { quote: "Texto de ejemplo: Mi hija mejoró muchísimo en matemáticas desde que empezó las tutorías. Las maestras son pacientes y dedicadas.", name: "María Rivera", role: "Madre de estudiante de 4to grado" },
  { quote: "Texto de ejemplo: El programa de homeschooling nos dio la flexibilidad que nuestra familia necesitaba, sin sacrificar calidad educativa.", name: "José Santiago", role: "Padre de estudiante de 7mo grado" },
  { quote: "Texto de ejemplo: Un ambiente seguro y familiar. Mi hijo va contento a sus tutorías y sus notas lo demuestran.", name: "Carmen Ortiz", role: "Madre de estudiante de 2do grado" },
  { quote: "Texto de ejemplo: La comunicación con los padres es excelente. Siempre sabemos cómo va progresando nuestra hija.", name: "Luis Meléndez", role: "Padre de estudiante de 10mo grado" },
  { quote: "Texto de ejemplo: Después de un año en CIFE, mi hijo pasó de frustrarse con la lectura a disfrutarla.", name: "Ana Vázquez", role: "Madre de estudiante de kindergarten" },
];

/* --- GALERÍA ---
   Para añadir una foto: guarda la imagen en assets/gallery/ y copia un
   bloque { ... } aquí con el nombre del archivo.

   Plantilla:
   { src: "assets/gallery/mi-foto.jpg", alt: "Descripción para accesibilidad", caption: "Título visible de la foto" },
*/
const GALLERY = [
  { src: "assets/gallery/foto-01.svg", alt: "Foto de ejemplo 1", caption: "Texto de ejemplo: actividad educativa" },
  { src: "assets/gallery/foto-02.svg", alt: "Foto de ejemplo 2", caption: "Texto de ejemplo: sesión de tutoría" },
  { src: "assets/gallery/foto-03.svg", alt: "Foto de ejemplo 3", caption: "Texto de ejemplo: nuestras facilidades" },
  { src: "assets/gallery/foto-04.svg", alt: "Foto de ejemplo 4", caption: "Texto de ejemplo: evento familiar" },
  { src: "assets/gallery/foto-05.svg", alt: "Foto de ejemplo 5", caption: "Texto de ejemplo: proyecto estudiantil" },
  { src: "assets/gallery/foto-06.svg", alt: "Foto de ejemplo 6", caption: "Texto de ejemplo: celebración de logros" },
];
```

- [ ] **Step 3: Write `js/render.js`**

```js
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
```

- [ ] **Step 4: Write `gallery.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galería | CIFE</title>
  <meta name="description" content="Galería de fotos de CIFE — actividades, facilidades y eventos.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="galeria">
  <header id="site-header"></header>

  <main>
    <section>
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">Galería</span>
          <h1>Nuestro centro en fotos</h1>
          <p>Imágenes de ejemplo — serán reemplazadas por fotos reales del centro.</p>
        </div>
        <div class="gallery-grid" id="gallery-grid"></div>
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>
  <script src="js/data.js" defer></script>
  <script src="js/render.js" defer></script>
  <script src="js/include.js" defer></script>
</body>
</html>
```

- [ ] **Step 5: Write `testimonials.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Testimonios | CIFE</title>
  <meta name="description" content="Lo que dicen las familias sobre CIFE.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="testimonios">
  <header id="site-header"></header>

  <main>
    <section>
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">Testimonios</span>
          <h1>Lo que dicen las familias</h1>
          <p>Testimonios de ejemplo — serán reemplazados por testimonios reales.</p>
        </div>
        <div class="testimonials-grid" id="testimonials-list"></div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <h2>Sé parte de la familia CIFE</h2>
        <p>Texto de ejemplo: invitación a conocer los servicios.</p>
        <a href="services.html" class="btn">Ver servicios</a>
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>
  <script src="js/data.js" defer></script>
  <script src="js/render.js" defer></script>
  <script src="js/include.js" defer></script>
</body>
</html>
```

- [ ] **Step 6: Verify**

```bash
node --check js/data.js && node --check js/render.js
curl -s http://localhost:8080/gallery.html | grep -c 'id="gallery-grid"'
curl -s http://localhost:8080/testimonials.html | grep -c 'id="testimonials-list"'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/assets/gallery/foto-01.svg
```

Expected: both `node --check` silent; both greps print `1`; HTTP code `200`.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Add data-driven gallery and testimonials pages"
```

---

### Task 5: `contact.html`

**Files:**
- Create: `contact.html`

**Interfaces:**
- Consumes: page skeleton contract (Task 2, `data-page="contacto"`), `.contact-layout`/`.contact-list`/`.map-embed` (Task 1).

- [ ] **Step 1: Write `contact.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contacto | CIFE</title>
  <meta name="description" content="Contacta a CIFE en Vega Alta, Puerto Rico — teléfono, WhatsApp, email y dirección.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="contacto">
  <header id="site-header"></header>

  <main>
    <section>
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">Contacto</span>
          <h1>Estamos para servirte</h1>
          <p>Texto de ejemplo: invitación a comunicarse por el medio que prefieran.</p>
        </div>

        <div class="contact-layout">
          <ul class="contact-list">
            <li>
              <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div>
                <span class="contact-label">Teléfono</span>
                <span class="contact-value">(787) 000-0000 — número de ejemplo</span>
              </div>
            </li>
            <li>
              <svg class="icon icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <div>
                <span class="contact-label">WhatsApp</span>
                <span class="contact-value"><a href="https://wa.me/17870000000">Escríbenos por WhatsApp</a> — enlace de ejemplo</span>
              </div>
            </li>
            <li>
              <svg class="icon icon-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <div>
                <span class="contact-label">Email</span>
                <span class="contact-value"><a href="mailto:info@centroeducativocife.com">info@centroeducativocife.com</a> — dirección de ejemplo</span>
              </div>
            </li>
            <li>
              <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <span class="contact-label">Dirección</span>
                <span class="contact-value">Texto de ejemplo: Calle Principal #123, Vega Alta, PR 00692</span>
              </div>
            </li>
            <li>
              <svg class="icon icon-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <span class="contact-label">Horario</span>
                <span class="contact-value">Texto de ejemplo: lunes a viernes, 8:00 AM – 5:00 PM</span>
              </div>
            </li>
          </ul>

          <!-- Mapa genérico de Vega Alta; sustituir por el embed de la dirección exacta cuando se confirme. -->
          <iframe class="map-embed" src="https://maps.google.com/maps?q=Vega%20Alta%2C%20Puerto%20Rico&output=embed" loading="lazy" title="Mapa — Vega Alta, Puerto Rico" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <!-- v2: formulario de contacto vía servicio externo (p. ej. Formspree) — el hosting es estático, sin backend. -->
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>
  <script src="js/include.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
curl -s http://localhost:8080/contact.html | grep -c 'map-embed'
```

Expected: `1` (the iframe's class attribute).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "Add contact page with info list and map embed"
```

---

### Task 6: Full verification pass

**Files:** none created; fixes applied wherever findings point.

- [ ] **Step 1: Automated sweep**

```bash
cd /home/mellowfllow/cife-website
for f in js/*.js; do node --check "$f"; done
for p in index about services gallery testimonials why-us contact; do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/$p.html)
  echo "$p: $code"
done
grep -rn 'href="/\|src="/' --include='*.html' --include='*.js' . && echo "ABSOLUTE PATHS FOUND — FIX" || echo "paths OK"
```

Expected: all `node --check` silent, all pages `200`, `paths OK`.

- [ ] **Step 2: Browser-level verification (screenshots if chromium available)**

If `chromium` (or `google-chrome`) exists, screenshot every page at desktop (1440x900) and mobile (390x844) widths into the session scratchpad and inspect them:

```bash
SHOTS="$CLAUDE_SCRATCHPAD_OR_SESSION_SCRATCH_DIR"   # executor: substitute the session scratchpad path
for p in index about services gallery testimonials why-us contact; do
  chromium --headless --disable-gpu --window-size=1440,900 --screenshot="$SHOTS/$p-desktop.png" "http://localhost:8080/$p.html" 2>/dev/null
  chromium --headless --disable-gpu --window-size=390,844  --screenshot="$SHOTS/$p-mobile.png"  "http://localhost:8080/$p.html" 2>/dev/null
done
```

Check: header/nav/footer present on all pages, correct active link, gallery shows 6 images, testimonials shows 5 cards, no horizontal overflow at 390px. If no headless browser is available, ask Damian to click through in his own browser instead.

Also confirm the spec's `file://` requirement: open `file:///home/mellowfllow/cife-website/index.html` (headless screenshot works for this too) and verify CSS + logo load, proving relative paths hold without a server.

- [ ] **Step 3: data.js add-entry drill (the spec's key usability requirement)**

Append a 6th test testimonial to `TESTIMONIALS` in `js/data.js`, re-screenshot (or reload) testimonials.html, confirm 6 cards render with no other file touched, then remove the test entry.

- [ ] **Step 4: Stop the server, final commit if fixes were made**

```bash
kill %1 2>/dev/null || pkill -f 'http.server 8080'
git status --short   # commit any fixes with a descriptive message
```

- [ ] **Step 5: Hand off to Damian**

Point him at `python -m http.server` for a click-through and remind him: content edits go in `js/data.js`; everything is placeholder pending client content; push to GitHub + Porkbun Connect is the deploy step when he's ready.
