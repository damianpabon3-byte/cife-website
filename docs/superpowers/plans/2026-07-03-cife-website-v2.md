# CIFE Website v2 (Audit Response) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the client-audit changes — bigger logo, balanced brand-color pass, inspirational homepage copy, and an ES|EN language toggle — without changing any page's layout.

**Architecture:** Pure CSS recoloring/resizing (Task 1); a new `js/i18n.js` engine driven by `data-i18n` attributes with Spanish authored in HTML and all English in one dictionary (Tasks 2-3); `data.js`/`render.js` grow optional English fields with per-field Spanish fallback (Task 4).

**Tech Stack:** unchanged — HTML5, CSS3, vanilla JS, no build step. `color-mix()` is used for tints (fine in all modern browsers).

## Global Constraints

- Layout is untouched: no section added/removed/reordered except the two `index.html` background-class swaps and the `why-us.html` stats-band class named in the spec.
- Spanish stays authored in HTML; **all** English lives in `js/i18n.js` (`I18N_EN`). Placeholder EN strings read "Example text: …" mirroring "Texto de ejemplo: …".
- `data-i18n` may only sit on elements whose content is **pure text** (no element children). Mixed-content nodes (check-list `<li>` with inline SVG, contact values containing `<a>`) must have their text wrapped in a `<span data-i18n>` first. Violating this deletes the child elements on toggle.
- Script order on every page: `data.js → render.js → include.js → i18n.js` (only the pages that use each; `i18n.js` always last).
- Color tokens exactly: `--color-bg-alt: #FAF3F5`, `--color-hero-tint: #F7E9EE`, `--color-cta-tint: #F5DEE6`, `--color-teal-tint: #EAF7F5`, `--color-border: #EDDFE4`. No gradients, no shadows; lime never as large text.
- All paths stay relative. Working dir `/home/mellowfllow/cife-website`, branch off `main`. Commit per task with the Claude trailer.
- Verify with `node --check`, `curl` against `python -m http.server 8080`, and headless `chromium` (`--screenshot` / `--dump-dom`).

---

### Task 1: Visual pass — CSS v2 + recolored gallery SVGs + band class swaps

**Files:**
- Modify: `css/style.css`, `index.html` (2 class swaps), `why-us.html` (1 class swap)
- Regenerate: `assets/gallery/foto-01.svg` … `foto-06.svg`

**Interfaces:**
- Produces: classes consumed by Task 2's header/footer templates — `.header-actions`, `.lang-toggle` (+ `button[aria-pressed]`, `.sep`), `.logo-plate`. Everything else is restyling of existing classes.

- [ ] **Step 1: Apply CSS edits to `css/style.css`**

Token block — replace the Neutrals section and add tints (final state of those lines):

```css
  /* Neutrals & tints */
  --color-bg:         #FFFFFF;
  --color-bg-alt:     #FAF3F5;   /* soft pink wash (was gray) */
  --color-hero-tint:  #F7E9EE;
  --color-cta-tint:   #F5DEE6;
  --color-teal-tint:  #EAF7F5;
  --color-text:       #26222A;
  --color-text-muted: #6B6570;
  --color-border:     #EDDFE4;
```

Delete the now-unused `--color-secondary-tint` token. Change `--header-height: 76px` → `92px`.

Logo sizes: `.brand img { height: 46px; }` → `64px`. In the footer section, `.footer-brand img { height: 40px; ... margin-bottom: 14px; }` → height `52px`, margin-bottom `0`, and add:

```css
.logo-plate {
  display: inline-block;
  background: #fff;
  padding: 10px 14px;
  border-radius: var(--radius);
  margin-bottom: 14px;
}
```

Header right group + language toggle (new rules, after the `.nav-toggle` block):

```css
.header-actions { display: flex; align-items: center; gap: 8px; }
.site-nav { margin-left: auto; }

.lang-toggle { display: flex; align-items: center; gap: 2px; }
.lang-toggle button {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-radius: 6px;
  padding: 4px 6px;
  cursor: pointer;
}
.lang-toggle button:hover { color: var(--color-primary); }
.lang-toggle button[aria-pressed="true"] {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, white);
}
.lang-toggle .sep { color: var(--color-border); }
```

Bands:

```css
.hero { padding: 96px 0; text-align: center; background: var(--color-hero-tint); }
.cta-band { background: var(--color-cta-tint); text-align: center; }
.cta-band h2 { margin-bottom: 0.3em; color: var(--color-primary); }
.section-teal { background: var(--color-teal-tint); }
```

Eyebrow → pill (add to existing `.eyebrow` rule):

```css
  padding: 4px 14px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 10%, white);
```

Icon chips (new rule after `.icon-sm`):

```css
.card .icon, .feature .icon, .contact-list .icon, .service > .icon {
  width: 52px;
  height: 52px;
  padding: 12px;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 12%, white);
}
```

Card accent borders (after the `.card` rule):

```css
.card-grid .card { border-top: 3px solid var(--color-accent-teal); }
.card-grid .card:nth-child(3n+2) { border-top-color: var(--color-accent-lime); }
.card-grid .card:nth-child(3n)   { border-top-color: var(--color-primary); }
```

Stats alternation (after `.stat .stat-number`):

```css
.stat:nth-child(even) .stat-number { color: var(--color-accent-teal); }
```

Footer goes crimson — replace the footer block's color-bearing rules:

```css
#site-footer { background: var(--color-primary); }
.footer-brand p { color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; max-width: 320px; }
.footer-col h3 { font-size: 0.95rem; margin-bottom: 14px; color: #fff; }
.footer-col li { padding: 4px 0; font-size: 0.9rem; color: rgba(255, 255, 255, 0.85); }
.footer-col a { color: rgba(255, 255, 255, 0.85); }
.footer-col a:hover { color: #fff; text-decoration: underline; }
.footer-bottom { background: var(--color-primary-dark); border-top: none; text-align: center; padding: 18px 24px; }
.footer-bottom p { margin: 0; font-size: 0.82rem; color: rgba(255, 255, 255, 0.8); }
```

(Remove `border-top: 1px solid var(--color-border)` from `#site-footer`.)

Mobile logo cap — inside the existing `@media (max-width: 600px)` block add:

```css
  .brand img { height: 52px; }
```

- [ ] **Step 2: Band class swaps in HTML**

`index.html`: services-cards section `<section class="section-alt">` → `<section>`; the "¿Por qué CIFE?" section `<section>` → `<section class="section-alt">`.
`why-us.html`: stats section `<section class="section-alt">` → `<section class="section-teal">`.

- [ ] **Step 3: Regenerate gallery SVGs with rotating accent strips**

```bash
cd /home/mellowfllow/cife-website
colors=(DD92A8 4DC4C0 B6DD14 DD92A8 4DC4C0 B6DD14)
for i in 1 2 3 4 5 6; do
c=${colors[$((i-1))]}   # zsh: colors[$i] — verify indexing in the shell used
cat > "assets/gallery/foto-0$i.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#F7F7F8"/>
  <rect x="0" y="572" width="800" height="28" fill="#$c" opacity="0.45"/>
  <circle cx="400" cy="250" r="72" fill="#E9E4E7"/>
  <path d="M338 292 h124 l-36 -54 -28 30 -18 -16 z" fill="#FFFFFF"/>
  <circle cx="368" cy="222" r="10" fill="#FFFFFF"/>
  <text x="400" y="420" text-anchor="middle" font-family="sans-serif" font-size="34" fill="#6B6570">Foto de ejemplo $i</text>
</svg>
EOF
done
grep -h 'y="572"' assets/gallery/*.svg
```

Expected: six strip lines cycling `#DD92A8`, `#4DC4C0`, `#B6DD14` twice.

- [ ] **Step 4: Verify visually**

```bash
(python -m http.server 8080 &>/dev/null &) ; sleep 1
SHOTS=<session scratchpad>
chromium --headless --disable-gpu --hide-scrollbars --window-size=1440,1600 --screenshot="$SHOTS/v2-index.png" http://localhost:8080/index.html
chromium --headless --disable-gpu --hide-scrollbars --window-size=1440,900 --screenshot="$SHOTS/v2-whyus.png" http://localhost:8080/why-us.html
```

Check: 64px logo / taller header, pink hero, white cards band with rotating top borders + icon chips, pink alt band, deeper pink CTA with crimson heading, crimson footer with white text and logo on white plate, teal stats band on why-us. (Header still lacks the lang toggle — that's Task 2.)

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Apply v2 balanced color pass, bigger logo, accent gallery strips"
```

---

### Task 2: i18n engine + header/footer keys + homepage (working EN toggle on index)

**Files:**
- Create: `js/i18n.js`
- Modify: `js/include.js`, `index.html`

**Interfaces:**
- Consumes: `.header-actions` / `.lang-toggle` / `.logo-plate` CSS (Task 1).
- Produces: `window.cifeLang(): "es"|"en"` (read by Task 4's render.js); `cife:lang` CustomEvent on window after every language application; `I18N_EN` dictionary extended by Task 3; `data-i18n` attribute convention; localStorage key `"cife-lang"`; URL override `?lang=en|es`.

- [ ] **Step 1: Update `js/include.js`**

Header template — replace the `buildHeader` return with (nav links gain `data-i18n`, toggle+hamburger move into `.header-actions`):

```js
    return `
      <div class="header-inner container">
        <a href="index.html" class="brand">
          <img src="assets/logo.jpeg" alt="CIFE — Centro de Instrucciones y Formación Educativa">
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
```

with the link mapper becoming:

```js
    const links = NAV_LINKS.map(
      (l) => `<li><a href="${l.href}"${l.page === activePage ? ' class="active"' : ""} data-i18n="nav.${l.page}">${l.label}</a></li>`
    ).join("");
```

Footer template — brand image gains the plate, translatable strings gain keys (footer quick links reuse the `nav.*` keys):

```js
      <div class="footer-inner container">
        <div class="footer-col footer-brand">
          <div class="logo-plate"><img src="assets/logo.jpeg" alt="CIFE"></div>
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
```

(Everything else in include.js unchanged.)

- [ ] **Step 2: Write `js/i18n.js`** (dictionary shown with nav/footer/title/home keys; Task 3 appends the other pages' keys inside the same object)

```js
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
```

- [ ] **Step 3: Rewrite `index.html` `<main>` with final copy + `data-i18n`** (head/skeleton unchanged except the added script tag; band classes as set in Task 1)

```html
  <main>
    <section class="hero">
      <div class="container">
        <span class="eyebrow">Vega Alta, Puerto Rico</span>
        <h1 data-i18n="home.hero.title">Ayudamos a cada estudiante a descubrir su potencial</h1>
        <p class="hero-sub" data-i18n="home.hero.sub">En CIFE acompañamos a las familias de Vega Alta con tutorías K-12, homeschooling y preparación académica — en un ambiente cercano, seguro y hecho a la medida de cada niño.</p>
        <div class="hero-actions">
          <a href="services.html" class="btn" data-i18n="home.hero.cta1">Conoce nuestros servicios</a>
          <a href="contact.html" class="btn btn-outline" data-i18n="home.hero.cta2">Contáctanos</a>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-heading">
          <h2 data-i18n="home.services.title">Nuestros servicios</h2>
          <p data-i18n="home.services.sub">Apoyo a la medida de cada estudiante, en cada etapa de su aprendizaje.</p>
        </div>
        <div class="card-grid">
          <div class="card">
            [same teal book SVG as v1]
            <h3 data-i18n="home.card.tutoring.title">Tutorías K-12</h3>
            <p data-i18n="home.card.tutoring.desc">Texto de ejemplo: descripción breve del servicio de tutorías por materia y grado.</p>
            <a href="services.html" class="card-link" data-i18n="home.card.more">Ver más →</a>
          </div>
          <div class="card">
            [same lime home SVG as v1]
            <h3 data-i18n="home.card.homeschool.title">Homeschooling</h3>
            <p data-i18n="home.card.homeschool.desc">Texto de ejemplo: descripción breve del programa de educación en el hogar.</p>
            <a href="services.html" class="card-link" data-i18n="home.card.more">Ver más →</a>
          </div>
          <div class="card">
            [same crimson award SVG as v1]
            <h3 data-i18n="home.card.prep.title">Preparación académica</h3>
            <p data-i18n="home.card.prep.desc">Texto de ejemplo: descripción breve de refuerzo y preparación para exámenes.</p>
            <a href="services.html" class="card-link" data-i18n="home.card.more">Ver más →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="container">
        <div class="section-heading">
          <h2 data-i18n="home.why.title">¿Por qué CIFE?</h2>
          <p data-i18n="home.why.sub">Más que tutorías: somos una comunidad educativa comprometida con el éxito de tus hijos.</p>
          <a href="why-us.html" class="btn btn-outline" data-i18n="home.why.cta">Conoce las razones</a>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <h2 data-i18n="home.cta.title">Lo que dicen las familias</h2>
        <p data-i18n="home.cta.sub">Historias de familias que confiaron en CIFE.</p>
        <a href="testimonials.html" class="btn" data-i18n="home.cta.btn">Leer testimonios</a>
      </div>
    </section>
  </main>
```

Script block at the bottom becomes:

```html
  <script src="js/include.js" defer></script>
  <script src="js/i18n.js" defer></script>
```

- [ ] **Step 4: Verify**

```bash
node --check js/include.js && node --check js/i18n.js
chromium --headless --disable-gpu --dump-dom 'http://localhost:8080/index.html' | grep -c 'Ayudamos a cada estudiante'
chromium --headless --disable-gpu --dump-dom 'http://localhost:8080/index.html?lang=en' | grep -cE 'Helping every student discover their potential|Why Choose Us\?'
UD="<scratchpad>/chrome-profile"; rm -rf "$UD"
chromium --headless --disable-gpu --user-data-dir="$UD" --dump-dom 'http://localhost:8080/index.html?lang=en' >/dev/null
chromium --headless --disable-gpu --user-data-dir="$UD" --dump-dom 'http://localhost:8080/index.html' | grep -c 'Helping every student'
```

Expected: syntax clean; ES grep `1`; EN grep `2` (hero + nav); persistence grep `1` (no `?lang` param — localStorage carried EN).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add ES/EN i18n engine, language toggle, and bilingual inspirational homepage"
```

---

### Task 3: Wire the remaining six pages for i18n

**Files:**
- Modify: `about.html`, `services.html`, `why-us.html`, `gallery.html`, `testimonials.html`, `contact.html`, `js/i18n.js` (extend `I18N_EN`)

**Interfaces:**
- Consumes: `data-i18n` convention + `I18N_EN` from Task 2.
- Produces: nothing new; completes coverage.

- [ ] **Step 1: Add the script tag to all six pages**

Each page's script block gains `<script src="js/i18n.js" defer></script>` as the LAST script (gallery/testimonials keep `data.js → render.js → include.js` before it).

- [ ] **Step 2: Add `data-i18n` attributes per the key map**

Rules: attribute goes on the pure-text element (`h1/h2/h3/p/a/span`). Two mixed-content cases MUST be span-wrapped first:

1. `services.html` check-list items — each `<li><svg…/> Texto…</li>` becomes `<li><svg…/><span data-i18n="…">Texto…</span></li>`.
2. `contact.html` WhatsApp/Email values — split into link + note: `<span class="contact-value"><a href="…" data-i18n="contact.wa.link">Escríbenos por WhatsApp</a> <span data-i18n="contact.note">— enlace de ejemplo</span></span>` (email uses `data-i18n="contact.note"` on its note span too; the address text in the mailto link carries no key — it's the same in both languages).

Key map (element → key), shared keys deliberately reused:

- **about.html:** eyebrow→`about.eyebrow`, h1→`about.title`, intro p→`about.intro`, Misión h3→`about.mission.title`, p→`about.mission.body`, Visión h3→`about.vision.title`, p→`about.vision.body`, "Nuestros valores" h2→`about.values.title`, value h3s→`about.value.compromiso|respeto|excelencia`, all three value ps→`common.example.short`.
- **services.html:** eyebrow→`services.eyebrow`, h1→`services.title`, intro→`services.intro`, service h2s→`services.s1.title|s2.title|s3.title`, service ps→`services.s1.desc|s2.desc|s3.desc`, s1 items (3×)→`services.s1.item`, s2 items (3×)→`services.s2.item`, s3 items (2×)→`services.s3.item`, CTA h2→`services.cta.title`, p→`services.cta.sub`, btn→`home.hero.cta2` (reuses "Contáctanos"/"Contact us").
- **why-us.html:** eyebrow→`why.eyebrow`, h1→`why.title`, intro→`why.intro`, feature h3s→`why.f1..f6.title`, all six feature ps→`common.example.short`, stat labels→`why.stat.years|students|grades|commit`, note line→`why.stats.note`, CTA h2→`why.cta.title`, p→`why.cta.sub`, btn→`why.cta.btn`.
- **gallery.html:** eyebrow→`gallery.eyebrow`, h1→`gallery.title`, sub→`gallery.sub`.
- **testimonials.html:** eyebrow→`testimonials.eyebrow`, h1→`testimonials.title`, sub→`testimonials.sub`, CTA h2→`testimonials.cta.title`, p→`testimonials.cta.sub`, btn→`testimonials.cta.btn`.
- **contact.html:** eyebrow→`contact.eyebrow`, h1→`contact.title`, sub→`contact.sub`, labels→`contact.phone|wa|email|address|hours` (`.contact-label` spans), phone value→`contact.phone.value`, WhatsApp link/note per rule 2 above, address value→`contact.address.value`, hours value→`contact.hours.value`.

- [ ] **Step 3: Extend `I18N_EN` in `js/i18n.js`** — append inside the object, before the closing `};`:

```js
    // ---- Común / Shared ----
    "common.example.short": "Example text: a brief description.",

    // ---- Sobre Nosotros / About ----
    "about.eyebrow": "About Us",
    "about.title": "Who we are",
    "about.intro": "Example text: an introductory paragraph about CIFE's history, when it was founded, and the community it serves in Vega Alta.",
    "about.mission.title": "Mission",
    "about.mission.body": "Example text: CIFE's mission — to provide individualized educational support that helps every student reach their potential.",
    "about.vision.title": "Vision",
    "about.vision.body": "Example text: CIFE's vision — to be the leading center for educational support and homeschooling in the region.",
    "about.values.title": "Our values",
    "about.value.compromiso": "Commitment",
    "about.value.respeto": "Respect",
    "about.value.excelencia": "Excellence",

    // ---- Servicios / Services ----
    "services.eyebrow": "Services",
    "services.title": "How we support your student",
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
    "services.cta.title": "Interested in enrolling your student?",
    "services.cta.sub": "Example text: an invitation to reach out for a no-commitment orientation.",

    // ---- Por Qué Elegirnos / Why Us ----
    "why.eyebrow": "Why Choose Us?",
    "why.title": "The CIFE difference",
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
    "why.cta.title": "Meet us in person",
    "why.cta.sub": "Example text: an invitation to visit the center or ask for more information.",
    "why.cta.btn": "Go to Contact",

    // ---- Galería / Gallery ----
    "gallery.eyebrow": "Gallery",
    "gallery.title": "Our center in photos",
    "gallery.sub": "Example images — they will be replaced with real photos of the center.",

    // ---- Testimonios / Testimonials ----
    "testimonials.eyebrow": "Testimonials",
    "testimonials.title": "What families say",
    "testimonials.sub": "Example testimonials — they will be replaced with real ones.",
    "testimonials.cta.title": "Become part of the CIFE family",
    "testimonials.cta.sub": "Example text: an invitation to explore our services.",
    "testimonials.cta.btn": "See services",

    // ---- Contacto / Contact ----
    "contact.eyebrow": "Contact",
    "contact.title": "We're here for you",
    "contact.sub": "Example text: an invitation to reach out through whichever channel you prefer.",
    "contact.phone": "Phone",
    "contact.phone.value": "(787) 000-0000 — example number",
    "contact.wa": "WhatsApp",
    "contact.wa.link": "Message us on WhatsApp",
    "contact.note": "— example",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.address.value": "Example text: 123 Main Street, Vega Alta, PR 00692",
    "contact.hours": "Hours",
    "contact.hours.value": "Example text: Monday to Friday, 8:00 AM – 5:00 PM",
```

(Also change the two Spanish note spans in contact.html to the shared text "— ejemplo" so one `contact.note` key fits both, or keep distinct ES text and let both map to `contact.note` — the ES stash is per-element, so distinct Spanish restores correctly either way.)

- [ ] **Step 4: Verify every page in EN**

```bash
for p in about services why-us gallery testimonials contact; do
  chromium --headless --disable-gpu --dump-dom "http://localhost:8080/$p.html?lang=en" | grep -c 'Example\|Why Choose\|Who we are\|Gallery' | head -1
done
chromium --headless --disable-gpu --dump-dom 'http://localhost:8080/services.html?lang=en' | grep -c '<svg'
```

Expected: every page count ≥ 1; services SVG count unchanged from ES run (mixed-content wrap preserved icons — compare with `dump-dom services.html | grep -c '<svg'`).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Wire all pages for ES/EN with full English dictionary"
```

---

### Task 4: Bilingual data.js + language-aware render.js

**Files:**
- Modify: `js/data.js`, `js/render.js`

**Interfaces:**
- Consumes: `window.cifeLang()` + `cife:lang` event (Task 2).
- Produces: data entry shape `{ quote, quoteEn?, name, role, roleEn? }` and `{ src, alt, altEn?, caption, captionEn? }` — English fields optional, falling back to Spanish.

- [ ] **Step 1: Update `js/data.js`** — every entry gains EN fields; template comments become bilingual. Final shape (all 5 + 6 entries follow this pattern):

```js
/* --- TESTIMONIOS / TESTIMONIALS ---
   Para añadir uno: copia un bloque { ... }, pégalo antes del ] final y edita.
   Los campos ...En son el inglés; si falta uno, se muestra el español.
   To add one: copy a { ... } block, paste before the final ] and edit.
   The ...En fields are English; if missing, Spanish is shown.

   Plantilla / Template:
   { quote: "Testimonio en español…", quoteEn: "Testimonial in English…",
     name: "Nombre Apellido", role: "Madre de estudiante de X grado", roleEn: "Mother of an Xth-grade student" },
*/
const TESTIMONIALS = [
  { quote: "Texto de ejemplo: Mi hija mejoró muchísimo en matemáticas desde que empezó las tutorías. Las maestras son pacientes y dedicadas.",
    quoteEn: "Example text: My daughter improved tremendously in math since starting tutoring. The teachers are patient and dedicated.",
    name: "María Rivera", role: "Madre de estudiante de 4to grado", roleEn: "Mother of a 4th-grade student" },
  { quote: "Texto de ejemplo: El programa de homeschooling nos dio la flexibilidad que nuestra familia necesitaba, sin sacrificar calidad educativa.",
    quoteEn: "Example text: The homeschooling program gave our family the flexibility we needed without sacrificing educational quality.",
    name: "José Santiago", role: "Padre de estudiante de 7mo grado", roleEn: "Father of a 7th-grade student" },
  { quote: "Texto de ejemplo: Un ambiente seguro y familiar. Mi hijo va contento a sus tutorías y sus notas lo demuestran.",
    quoteEn: "Example text: A safe, family-like environment. My son is happy to attend his tutoring sessions and his grades show it.",
    name: "Carmen Ortiz", role: "Madre de estudiante de 2do grado", roleEn: "Mother of a 2nd-grade student" },
  { quote: "Texto de ejemplo: La comunicación con los padres es excelente. Siempre sabemos cómo va progresando nuestra hija.",
    quoteEn: "Example text: Communication with parents is excellent. We always know how our daughter is progressing.",
    name: "Luis Meléndez", role: "Padre de estudiante de 10mo grado", roleEn: "Father of a 10th-grade student" },
  { quote: "Texto de ejemplo: Después de un año en CIFE, mi hijo pasó de frustrarse con la lectura a disfrutarla.",
    quoteEn: "Example text: After a year at CIFE, my son went from being frustrated with reading to enjoying it.",
    name: "Ana Vázquez", role: "Madre de estudiante de kindergarten", roleEn: "Mother of a kindergarten student" },
];
```

GALLERY equivalently: `altEn` mirrors `alt`, `captionEn` mirrors `caption` ("Example text: educational activity", "Example text: tutoring session", "Example text: our facilities", "Example text: family event", "Example text: student project", "Example text: celebrating achievements"), with the bilingual template comment.

- [ ] **Step 2: Update `js/render.js`**

```js
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
```

- [ ] **Step 3: Verify**

```bash
node --check js/data.js && node --check js/render.js
chromium --headless --disable-gpu --dump-dom 'http://localhost:8080/testimonials.html?lang=en' | grep -c 'My daughter improved'
chromium --headless --disable-gpu --dump-dom 'http://localhost:8080/gallery.html?lang=en' | grep -c 'tutoring session'
# Fallback drill: remove ONE quoteEn temporarily
sed -i 's/quoteEn: "Example text: My daughter improved tremendously in math since starting tutoring. The teachers are patient and dedicated.",//' js/data.js
chromium --headless --disable-gpu --dump-dom 'http://localhost:8080/testimonials.html?lang=en' | grep -c 'Mi hija mejoró muchísimo'
git checkout js/data.js
```

Expected: `1`, `1`, then `1` (Spanish fallback shown in EN mode), then data.js restored.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add bilingual content fields and language-aware rendering"
```

---

### Task 5: Full verification pass

**Files:** none created; fixes applied wherever findings point.

- [ ] **Step 1: v1-style automated sweep**

```bash
cd /home/mellowfllow/cife-website
for f in js/*.js; do node --check "$f" || echo "SYNTAX FAIL: $f"; done
for p in index about services gallery testimonials why-us contact; do
  echo "$p: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/$p.html)"
done
grep -rn 'href="/\|src="/' --include='*.html' --include='*.js' . && echo "ABSOLUTE PATHS — FIX" || echo "paths OK"
```

Expected: all silent/200/paths OK.

- [ ] **Step 2: Screenshot sweep, both languages, desktop + mobile**

All 7 pages at 1440x900 (default ES) into scratchpad; index/gallery/testimonials/contact additionally at 390x844 and with `?lang=en`. Inspect: bigger logo, crimson footer + white plate, tinted bands, chips, rotating card borders, teal stats band, ES·EN toggle visible on mobile next to hamburger, no horizontal overflow, EN copy correct.

- [ ] **Step 3: Toggle persistence + file:// check**

```bash
UD="<scratchpad>/chrome-profile2"; rm -rf "$UD"
chromium --headless --disable-gpu --user-data-dir="$UD" --dump-dom 'http://localhost:8080/index.html?lang=en' >/dev/null
chromium --headless --disable-gpu --user-data-dir="$UD" --dump-dom 'http://localhost:8080/about.html' | grep -c 'Who we are'
chromium --headless --disable-gpu --hide-scrollbars --window-size=1440,900 --screenshot="<scratchpad>/v2-file.png" 'file:///home/mellowfllow/cife-website/index.html'
```

Expected: persistence grep `1`; file:// screenshot fully styled.

- [ ] **Step 4: data.js add-entry drill (bilingual template)**

Append one full bilingual testimonial entry per the template comment, confirm 6 cards in ES and EN, remove it, confirm 5.

- [ ] **Step 5: Stop server, commit any fixes, hand off**

```bash
pkill -f 'http.server 8080'
git status --short
```

Report to Damian with screenshots; remind: Spanish edits in HTML, English edits in `js/i18n.js`, testimonials/photos in `js/data.js`, and `?lang=en` links force English for demoing.
