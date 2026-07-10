# CIFE Website v3 — "Papel Cuadriculado" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved "Papel Cuadriculado" design refresh (spec: `docs/superpowers/specs/2026-07-10-cife-website-v3-design.md`) to all 7 pages: graph-paper background, teal-ink structural color, Fraunces headings, lime highlighter accents, paper-cutout shadows, doodles, plate-free transparent footer logo.

**Architecture:** Plain HTML/CSS/JS static site, no build step. One stylesheet (`css/style.css`) is rewritten wholesale in Task 2; subsequent tasks restructure each page's HTML to adopt the new classes and split highlighted headlines into i18n-safe spans. Shared header/footer live in `js/include.js`; all English text lives in `I18N_EN` in `js/i18n.js`.

**Tech Stack:** HTML5, CSS (custom properties, `color-mix`), vanilla JS, Google Fonts (Fraunces + Inter), ImageMagick (asset generation), Python `http.server` + headless Chromium (verification).

## Global Constraints

- **No build step, no framework, no npm.** Repo root = deploy root. All paths relative.
- **i18n contract:** Spanish lives in HTML; English only in `I18N_EN` (`js/i18n.js`). `data-i18n` only on pure-text elements — an element with child nodes gets its children deleted by the swap.
- **Engine truthiness rule:** `apply()` does `lang === "en" && I18N_EN[key] ? I18N_EN[key] : dataset.i18nEs`. Therefore **every EN value must be non-empty**. A span may have empty Spanish text (write it as `<span data-i18n="…"></span>` with zero inner whitespace) only when its EN value is non-empty. Never the reverse.
- **Placeholder copy stays verbatim** — every "Texto de ejemplo…" string is preserved character-for-character. Only markup around it changes.
- **`js/render.js` and `js/data.js` are untouched.**
- **Verification browser:** `timeout 30 chromium --headless --disable-gpu --screenshot=<path> --window-size=<WxH> <url>` — always wrap in `timeout 30` (Google Fonts once stalled a batch). Serve via `python -m http.server 8017` from repo root; pages break on `file://`.
- **Commits:** small, imperative voice matching `git log --oneline` (e.g. "Apply v3 balanced color pass…").
- Work happens on branch **`build/v3-papel-cuadriculado`**; merge to `main` only in Task 9.

---

### Task 1: Branch, assets, fonts, logo swap

**Files:**
- Create: `assets/logo.png`, `assets/hero-placeholder.svg`
- Modify: `js/include.js:22` (header logo), `js/include.js:44` (footer logo plate), all 7 `*.html` (font `<link>`)

**Interfaces:**
- Produces: `assets/logo.png` (transparent, 800px wide) referenced by `include.js`; `assets/hero-placeholder.svg` consumed by Task 3; Fraunces+Inter font faces consumed by Task 2's CSS (`--font-heading: "Fraunces"`).

- [ ] **Step 1: Create branch**

```bash
cd ~/cife-website && git checkout -b build/v3-papel-cuadriculado
```

- [ ] **Step 2: Generate transparent logo**

```bash
cd ~/cife-website && magick assets/logo.jpeg -fuzz 15% -fill none \
  -draw 'alpha 0,0 floodfill' -draw 'alpha 1599,0 floodfill' \
  -draw 'alpha 0,651 floodfill' -draw 'alpha 1599,651 floodfill' \
  -channel A -morphology Erode Disk:2.5 -blur 0x0.7 -level 40%,90% +channel \
  -resize 800x assets/logo.png
identify -format '%wx%h %[channels]\n' assets/logo.png
```

Expected: `800x326 srgba` (alpha channel present).

- [ ] **Step 3: Verify knockout visually**

```bash
magick -size 900x400 xc:'#0F4F4C' \( assets/logo.png -resize 700x \) -gravity center -composite /tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/logo-on-ink.png
```

Read the PNG. Expected: logo floats clean on deep teal — no white box, no gray fringe, book pages show teal through page-line gaps.

- [ ] **Step 4: Create hero placeholder SVG**

Write `assets/hero-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" role="img" aria-label="Imagen de ejemplo">
  <rect width="1000" height="800" fill="#EAF7F5"/>
  <circle cx="830" cy="130" r="190" fill="#D9F1EF"/>
  <circle cx="170" cy="680" r="230" fill="#F7E9EE"/>
  <rect x="320" y="290" width="360" height="220" rx="16" fill="#FFFFFF" stroke="#4DC4C0" stroke-width="6"/>
  <text x="500" y="408" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#157874">Foto del centro</text>
  <text x="500" y="452" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#5B6663">imagen de ejemplo</text>
</svg>
```

- [ ] **Step 5: Swap font link on all 7 pages**

Every page has the identical line 10. Replace Poppins with Fraunces and add Inter 700:

```bash
cd ~/cife-website && sed -i 's|family=Poppins:wght@600;700&family=Inter:wght@400;600|family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,650\&family=Inter:wght@400;600;700|' \
  index.html about.html services.html why-us.html gallery.html testimonials.html contact.html
grep -c 'Fraunces' *.html
```

Expected: each file reports `1`.

- [ ] **Step 6: Point include.js at the new logo, drop the plate**

In `js/include.js` header (line 22):

```js
          <img src="assets/logo.png" alt="CIFE — Centro de Instrucciones y Formación Educativa">
```

Footer (line 44) — plate div replaced by a bare image:

```js
          <img class="footer-logo" src="assets/logo.png" alt="CIFE">
```

- [ ] **Step 7: Smoke-check in browser**

```bash
cd ~/cife-website && (python -m http.server 8017 >/dev/null 2>&1 &) && sleep 1
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t1-index.png --window-size=1366,2000 http://localhost:8017/index.html
```

Read the PNG. Expected: site renders as v2 except headings now serif (Fraunces), transparent logo in header, footer logo has no white plate (still on crimson — teal comes in Task 2).

- [ ] **Step 8: Commit**

```bash
git add assets/logo.png assets/hero-placeholder.svg js/include.js *.html
git commit -m "Add transparent logo + hero placeholder, swap Poppins for Fraunces"
```

---

### Task 2: Rewrite css/style.css (v3 stylesheet)

**Files:**
- Modify: `css/style.css` (full replacement)

**Interfaces:**
- Consumes: Fraunces/Inter font faces (Task 1), `assets/logo.png` sizing context.
- Produces: class contract for Tasks 3–7 — `.hl`, `.page-head`, `.hero-grid`, `.hero-text`, `.hero-photo`, `.cutout`, `.cta-coupon`, `.section-ink`, `.service-text`, `.service-media`, `.footer-logo`, doodle hosts `.doodle-pencil/.doodle-ruler/.doodle-book/.doodle-plane`. Retains `.section-heading`, `.section-alt`, `.card`, `.card-grid`, `.two-up`, `.feature-list`, `.feature`, `.check-list`, `.stats-row`, `.stat`, `.gallery-grid`, `.gallery-item`, `.testimonials-grid`, `.testimonial-card`, `.contact-layout`, `.contact-list`, `.map-embed` (restyled, same markup).

**Transitional note:** After this task and before Tasks 3–7, `services.html` service rows and the CTA bands render plainly (old markup, new CSS). That's expected mid-branch; nothing deploys until Task 9.

- [ ] **Step 1: Replace the entire file with:**

```css
/* ==========================================================================
   CIFE — Centro de Instrucciones y Formación Educativa
   v3 "Papel Cuadriculado". Tokens first, then base, then components.
   ========================================================================== */

:root {
  /* Brand palette (from client, docs/colors.jpeg) */
  --color-primary:        #D2344A;
  --color-primary-dark:   #B12A3E;
  --color-secondary:      #DD92A8;
  --color-accent-lime:    #B6DD14;
  --color-accent-teal:    #4DC4C0;

  /* Structural teal ink */
  --color-ink:        #0F4F4C;
  --color-ink-dark:   #0B3D3A;
  --color-heading:    #123B39;

  /* Neutrals — paper, not pure white */
  --color-bg:         #FEFDFB;
  --color-card:       #FFFFFF;
  --color-teal-tint:  #EAF7F5;
  --color-lime-wash:  #F4F9DC;
  --color-text:       #26222A;
  --color-text-muted: #5B6663;
  --color-border:     #D8E7E4;

  /* Graph-paper grid */
  --grid-line: rgba(20, 110, 106, 0.11);
  --grid-size: 26px;

  /* Type */
  --font-heading: "Fraunces", Georgia, serif;
  --font-body:    "Inter", system-ui, -apple-system, sans-serif;

  /* Layout */
  --container: 1100px;
  --radius: 10px;
  --header-height: 92px;
}

/* ---------- Base ---------- */
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.65;
  color: var(--color-text);
  background-color: var(--color-bg);
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
  -webkit-font-smoothing: antialiased;
}

img { max-width: 100%; display: block; }

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 650;
  line-height: 1.15;
  margin: 0 0 0.5em;
  color: var(--color-heading);
}

h1 { font-size: 2.6rem; }
h2 { font-size: 1.9rem; }
h3 { font-size: 1.15rem; font-weight: 600; }

p { margin: 0 0 1em; }
p:last-child { margin-bottom: 0; }

a { color: var(--color-primary); text-decoration: none; }
a:hover { color: var(--color-accent-teal); }

a:focus-visible, button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

.container { max-width: var(--container); margin: 0 auto; padding: 0 24px; }

main section { padding: 72px 0; }
.section-alt { background: var(--color-teal-tint); }

.section-heading { text-align: center; max-width: 640px; margin: 0 auto 48px; }
.section-heading p { color: var(--color-text-muted); }

.text-muted { color: var(--color-text-muted); }

/* ---------- Highlighter swipe ---------- */
.hl {
  background: linear-gradient(104deg, transparent 1%,
    rgba(182, 221, 20, 0.6) 5%, rgba(182, 221, 20, 0.6) 95%, transparent 99%);
  padding: 0 0.08em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

/* ---------- Eyebrow ---------- */
.eyebrow {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink);
  margin-bottom: 12px;
  padding: 4px 14px;
  border-radius: 999px;
  border: 1.5px solid var(--color-accent-teal);
  background: var(--color-card);
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 8px;
  border: 2px solid var(--color-primary);
  background: var(--color-primary);
  color: #fff;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.btn:hover { background: var(--color-primary-dark); border-color: var(--color-primary-dark); color: #fff; }

.btn-outline { background: var(--color-card); border-color: var(--color-ink); color: var(--color-ink); }
.btn-outline:hover { background: var(--color-ink); border-color: var(--color-ink); color: #fff; }

/* ---------- Icons ---------- */
.icon { width: 28px; height: 28px; flex-shrink: 0; }
.icon-teal    { color: var(--color-accent-teal); }
.icon-lime    { color: var(--color-accent-lime); }
.icon-primary { color: var(--color-primary); }
.icon-sm { width: 20px; height: 20px; }

.card .icon, .feature .icon, .contact-list .icon, .service-text .icon {
  width: 52px;
  height: 52px;
  padding: 12px;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 12%, white);
}

.check-list .icon { color: var(--color-accent-teal); }

/* ---------- Doodles (school-supply line art) ---------- */
.doodle-pencil, .doodle-ruler, .doodle-book, .doodle-plane { position: relative; }
.doodle-pencil::after, .doodle-ruler::after, .doodle-book::after, .doodle-plane::after {
  content: '';
  position: absolute;
  opacity: 0.18;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: contain;
}
.doodle-pencil::after {
  width: 130px; height: 130px; right: 3%; bottom: -18px; transform: rotate(-12deg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23157874' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 50 L44 20 l8 8 L22 58 l-11 3 3-11 z'/%3E%3Cpath d='M38 26 l8 8'/%3E%3Cpath d='M44 20 l6-6 8 8-6 6'/%3E%3C/g%3E%3C/svg%3E");
}
.doodle-ruler::after {
  width: 120px; height: 120px; right: 2%; bottom: 8px; transform: rotate(8deg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23157874' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='24' width='56' height='16' rx='2'/%3E%3Cpath d='M14 24v6M24 24v9M34 24v6M44 24v9M54 24v6'/%3E%3C/g%3E%3C/svg%3E");
}
.doodle-book::after {
  width: 96px; height: 96px; right: -10px; top: -34px; transform: rotate(6deg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23157874' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M32 16 C26 11 14 10 8 12 v36 c6-2 18-1 24 4 6-5 18-6 24-4 V12 c-6-2-18-1-24 4 z'/%3E%3Cpath d='M32 16 v36'/%3E%3C/g%3E%3C/svg%3E");
}
.doodle-plane::after {
  width: 110px; height: 110px; right: 3%; top: -4px; transform: rotate(-4deg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23157874' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 30 L58 10 L38 54 L30 36 z'/%3E%3Cpath d='M30 36 L58 10'/%3E%3C/g%3E%3C/svg%3E");
}

/* ---------- Header / nav ---------- */
#site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: var(--header-height);
  background: rgba(254, 253, 251, 0.94);
  border-bottom: 2px solid var(--color-ink);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: var(--header-height);
}

.brand img { height: 60px; width: auto; }

.site-nav { margin-left: auto; }
.site-nav ul { display: flex; gap: 22px; list-style: none; margin: 0; padding: 0; }
.site-nav a {
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-ink);
  padding: 6px 2px;
}
.site-nav a:hover { color: var(--color-primary); }
.site-nav a.active {
  color: var(--color-heading);
  background-image: linear-gradient(104deg, transparent 2%,
    rgba(182, 221, 20, 0.7) 8%, rgba(182, 221, 20, 0.7) 92%, transparent 98%);
  background-repeat: no-repeat;
  background-size: 100% 0.45em;
  background-position: 0 92%;
}

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
  background: var(--color-ink);
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.nav-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle.open span:nth-child(2) { opacity: 0; }
.nav-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.header-actions { display: flex; align-items: center; gap: 8px; }

.lang-toggle { display: flex; align-items: center; gap: 2px; }
.lang-toggle button {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-radius: 6px;
  padding: 4px 6px;
  cursor: pointer;
}
.lang-toggle button:hover { color: var(--color-primary); }
.lang-toggle button[aria-pressed="true"] {
  color: var(--color-ink);
  background: var(--color-teal-tint);
}
.lang-toggle .sep { color: var(--color-border); }

@media (max-width: 900px) {
  .nav-toggle { display: flex; }
  .site-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-bg);
    border-bottom: 2px solid var(--color-ink);
  }
  .site-nav.open { display: block; }
  .site-nav ul { flex-direction: column; gap: 0; padding: 8px 24px 16px; }
  .site-nav a { display: block; padding: 12px 0; }
}

/* ---------- Hero (index) ---------- */
.hero { padding: 88px 0 76px; }
.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 56px;
  align-items: center;
}
.hero h1 { margin: 0 0 0.4em; }
.hero .hero-sub { max-width: 520px; margin: 0 0 32px; color: var(--color-text-muted); font-size: 1.1rem; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
.hero-photo { margin: 0; }
.hero-photo img { width: 100%; aspect-ratio: 5 / 4; object-fit: cover; border-radius: 7px; }

/* ---------- Paper-cutout frame ---------- */
.cutout {
  border: 2px solid var(--color-ink);
  border-radius: var(--radius);
  box-shadow: 7px 7px 0 var(--color-accent-teal);
  background: var(--color-card);
}

/* ---------- Interior page header ---------- */
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding-bottom: 28px;
  margin-bottom: 52px;
  border-bottom: 1.5px solid rgba(15, 79, 76, 0.18);
}
.page-head h1 { margin-bottom: 0.3em; max-width: 620px; }
.page-head p { color: var(--color-text-muted); max-width: 540px; margin: 0; }

/* ---------- Cards ---------- */
.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

.card {
  background: var(--color-card);
  border: 1.5px solid var(--color-ink);
  border-radius: var(--radius);
  padding: 30px 26px;
  box-shadow: 4px 4px 0 rgba(18, 59, 57, 0.12);
}
.card::before {
  content: '';
  display: block;
  width: 34px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-accent-teal);
  margin-bottom: 18px;
}
.card-grid .card:nth-child(3n+2)::before { background: var(--color-accent-lime); }
.card-grid .card:nth-child(3n)::before   { background: var(--color-primary); }
.card .icon { margin-bottom: 16px; }
.card p { color: var(--color-text-muted); font-size: 0.95rem; }
.card-link { font-weight: 600; font-size: 0.9rem; }

/* ---------- Two-up blocks (misión / visión) ---------- */
.two-up { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.two-up .card::before { background: var(--color-secondary); }

/* ---------- Feature list (why-us) ---------- */
.feature-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feature {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: var(--color-card);
  border: 1.5px solid var(--color-ink);
  border-radius: var(--radius);
  padding: 22px 20px;
  box-shadow: 4px 4px 0 rgba(18, 59, 57, 0.12);
}
.feature h3 { margin-bottom: 0.25em; }
.feature p { color: var(--color-text-muted); font-size: 0.95rem; }

.check-list { list-style: none; padding: 0; margin: 0; }
.check-list li { display: flex; align-items: center; gap: 10px; padding: 6px 0; color: var(--color-text-muted); }

/* ---------- Stats — ink band ---------- */
.section-ink { background: var(--color-ink); }
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
  padding: 8px 0;
}
.stat .stat-number {
  font-family: var(--font-heading);
  font-size: 2.4rem;
  font-weight: 650;
  color: #fff;
  line-height: 1;
  margin-bottom: 8px;
}
.stat:nth-child(2) .stat-number { color: var(--color-accent-lime); }
.stat:nth-child(3) .stat-number { color: var(--color-accent-teal); }
.stat .stat-label { color: rgba(255, 255, 255, 0.75); font-size: 0.85rem; letter-spacing: 0.04em; text-transform: uppercase; }
.section-ink .text-muted { color: rgba(255, 255, 255, 0.65); }

/* ---------- Service rows (services) ---------- */
.service {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 44px;
  align-items: center;
  max-width: 960px;
  margin: 0 auto 64px;
}
.service:last-of-type { margin-bottom: 0; }
.service-text .icon { margin-bottom: 14px; }
.service-text p { color: var(--color-text-muted); }
.service-media { margin: 0; }
.service-media img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 7px; }
.service:nth-of-type(even) .service-media { order: -1; }
.service:nth-of-type(even) .service-media.cutout { box-shadow: -7px 7px 0 var(--color-secondary); }

/* ---------- Gallery ---------- */
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px 26px; }
.gallery-item { margin: 0; }
.gallery-item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius);
  border: 2px solid var(--color-ink);
  box-shadow: 6px 6px 0 var(--color-accent-teal);
}
.gallery-item:nth-child(3n+2) img { box-shadow: 6px 6px 0 var(--color-secondary); }
.gallery-item:nth-child(3n) img   { box-shadow: 6px 6px 0 var(--color-accent-lime); }
.gallery-item figcaption { font-size: 0.88rem; color: var(--color-text-muted); padding-top: 14px; font-style: italic; }

/* ---------- Testimonials ---------- */
.testimonials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px 26px; }
.testimonial-card {
  position: relative;
  margin: 0;
  background: var(--color-card);
  border: 1.5px solid var(--color-ink);
  border-radius: var(--radius);
  padding: 34px 28px 28px;
  box-shadow: 5px 5px 0 var(--color-secondary);
}
.testimonial-card::before {
  content: '\201C';
  position: absolute;
  top: -4px;
  left: 12px;
  font-family: var(--font-heading);
  font-size: 5rem;
  line-height: 1;
  color: rgba(77, 196, 192, 0.35);
}
.testimonial-quote { font-size: 1.02rem; position: relative; }
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
.map-embed {
  width: 100%;
  height: 380px;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius);
  box-shadow: 7px 7px 0 var(--color-accent-teal);
}

/* ---------- CTA coupon ---------- */
.cta-band { padding: 40px 0 80px; }
.cta-coupon {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  border: 2px dashed var(--color-accent-teal);
  border-radius: 12px;
  background: var(--color-lime-wash);
  padding: 32px 36px;
  text-align: left;
}
.cta-coupon h2 { margin-bottom: 0.2em; font-size: 1.5rem; }
.cta-coupon p { color: var(--color-text-muted); margin: 0; }
.cta-coupon .btn { flex-shrink: 0; }

/* ---------- Footer ---------- */
#site-footer { background: var(--color-ink); }
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  padding: 56px 24px 40px;
}
.footer-logo { height: 56px; width: auto; margin-bottom: 16px; }
.footer-brand p { color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; max-width: 320px; }
.footer-col h3 {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
  color: var(--color-accent-lime);
}
.footer-col ul { list-style: none; padding: 0; margin: 0; }
.footer-col li { padding: 4px 0; font-size: 0.9rem; color: rgba(255, 255, 255, 0.85); }
.footer-col a { color: rgba(255, 255, 255, 0.85); }
.footer-col a:hover {
  color: #fff;
  text-decoration: underline;
  text-decoration-color: var(--color-accent-lime);
  text-decoration-thickness: 3px;
  text-underline-offset: 3px;
}
.footer-bottom { background: var(--color-ink-dark); text-align: center; padding: 18px 24px; }
.footer-bottom p { margin: 0; font-size: 0.82rem; color: rgba(255, 255, 255, 0.8); }

/* ---------- Motion ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; }
}

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  h1 { font-size: 2.05rem; }
  main section { padding: 56px 0; }
  .hero { padding: 56px 0; }
  .hero-grid { grid-template-columns: 1fr; gap: 36px; }
  .card-grid, .feature-list, .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-row { grid-template-columns: repeat(2, 1fr); gap: 32px 24px; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 700px) {
  .doodle-pencil::after, .doodle-ruler::after, .doodle-book::after, .doodle-plane::after { display: none; }
  .page-head { flex-direction: column; align-items: flex-start; }
  .cta-coupon { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 600px) {
  :root { --grid-size: 22px; }
  .brand img { height: 50px; }
  .card-grid, .feature-list, .gallery-grid, .testimonials-grid,
  .two-up, .contact-layout, .stats-row { grid-template-columns: 1fr; }
  .footer-inner { grid-template-columns: 1fr; }
  .service { grid-template-columns: 1fr; gap: 28px; }
  .service:nth-of-type(even) .service-media { order: 0; }
  .service:nth-of-type(even) .service-media.cutout { box-shadow: 7px 7px 0 var(--color-secondary); }
}
```

- [ ] **Step 2: Verify chrome on index**

```bash
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t2-index.png --window-size=1366,2400 http://localhost:8017/index.html
```

Read the PNG. Expected: graph-paper grid visible on background; ink header rule; footer deep teal with lime headings and clean transparent logo; cards have ink borders + cutout shadows; hero still centered (restructured in Task 3) — acceptable transitionally.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Rewrite stylesheet for v3: graph paper, teal ink, cutouts, coupon, doodles"
```

---

### Task 3: index.html — asymmetric hero, split headline, coupon

**Files:**
- Modify: `index.html:17-27` (hero), `index.html:58-74` (why teaser + CTA band)
- Modify: `js/i18n.js` (home keys)

**Interfaces:**
- Consumes: `.hero-grid`, `.hero-text`, `.hero-photo`, `.cutout`, `.hl`, `.cta-coupon`, `.doodle-pencil`, `.doodle-book` (Task 2); `assets/hero-placeholder.svg` (Task 1).
- Produces: i18n keys `home.hero.titlePre`, `home.hero.titleHl`, `home.cta.titlePre`, `home.cta.titleHl`, `home.cta.titlePost` (replacing `home.hero.title`, `home.cta.title`).

- [ ] **Step 1: Replace the hero section (lines 17–27) with:**

```html
    <section class="hero doodle-pencil">
      <div class="container hero-grid">
        <div class="hero-text">
          <span class="eyebrow">Vega Alta, Puerto Rico</span>
          <h1><span data-i18n="home.hero.titlePre">Ayudamos a cada estudiante a descubrir su </span><span class="hl" data-i18n="home.hero.titleHl">potencial</span></h1>
          <p class="hero-sub" data-i18n="home.hero.sub">En CIFE acompañamos a las familias de Vega Alta con tutorías K-12, homeschooling y preparación académica — en un ambiente cercano, seguro y hecho a la medida de cada niño.</p>
          <div class="hero-actions">
            <a href="services.html" class="btn" data-i18n="home.hero.cta1">Conoce nuestros servicios</a>
            <a href="contact.html" class="btn btn-outline" data-i18n="home.hero.cta2">Contáctanos</a>
          </div>
        </div>
        <figure class="hero-photo cutout">
          <img src="assets/hero-placeholder.svg" alt="Estudiantes en CIFE — imagen de ejemplo">
        </figure>
      </div>
    </section>
```

(The trailing space inside the `titlePre` span is load-bearing.)

- [ ] **Step 2: Replace the CTA band (lines 68–74) with:**

```html
    <section class="cta-band">
      <div class="container">
        <div class="cta-coupon doodle-book">
          <div>
            <h2><span data-i18n="home.cta.titlePre">Lo que dicen las </span><span class="hl" data-i18n="home.cta.titleHl">familias</span><span data-i18n="home.cta.titlePost"></span></h2>
            <p data-i18n="home.cta.sub">Historias de familias que confiaron en CIFE.</p>
          </div>
          <a href="testimonials.html" class="btn" data-i18n="home.cta.btn">Leer testimonios</a>
        </div>
      </div>
    </section>
```

(`titlePost` span is intentionally empty in Spanish — EN puts " say" there.)

- [ ] **Step 3: Update I18N_EN in js/i18n.js**

Replace the line `"home.hero.title": "Helping every student discover their potential",` with:

```js
    "home.hero.titlePre": "Helping every student discover their ",
    "home.hero.titleHl": "potential",
```

Replace `"home.cta.title": "What families say",` with:

```js
    "home.cta.titlePre": "What ",
    "home.cta.titleHl": "families",
    "home.cta.titlePost": " say",
```

- [ ] **Step 4: Verify both languages**

```bash
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t3-index-es.png --window-size=1366,2400 http://localhost:8017/index.html
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t3-index-en.png --window-size=1366,2400 "http://localhost:8017/index.html?lang=en"
```

Read both PNGs. Expected ES: left-aligned hero, lime swipe on "potencial", cutout photo frame right, pencil doodle bottom-right, coupon CTA with book doodle, headline reads exactly "Ayudamos a cada estudiante a descubrir su potencial". Expected EN: "Helping every student discover their potential" with swipe on "potential"; coupon heading "What families say" with swipe on "families".

- [ ] **Step 5: Commit**

```bash
git add index.html js/i18n.js
git commit -m "Rebuild index hero asymmetric with highlighted headline and coupon CTA"
```

---

### Task 4: services.html — page header, alternating rows, coupon

**Files:**
- Modify: `services.html:17-71`
- Modify: `js/i18n.js` (services keys)

**Interfaces:**
- Consumes: `.page-head`, `.doodle-ruler`, `.service-text`, `.service-media`, `.cutout`, `.cta-coupon`, `.doodle-book`, `.hl` (Task 2); gallery placeholder SVGs `assets/gallery/foto-01..03.svg` (existing).
- Produces: i18n keys `services.titlePre`, `services.titleHl`, `services.cta.titlePre`, `services.cta.titleHl`, `services.cta.titlePost` (replacing `services.title`, `services.cta.title`).

- [ ] **Step 1: Replace the section heading (lines 19–23) with:**

```html
        <div class="page-head doodle-ruler">
          <div>
            <span class="eyebrow" data-i18n="services.eyebrow">Servicios</span>
            <h1><span data-i18n="services.titlePre">Cómo apoyamos a tu </span><span class="hl" data-i18n="services.titleHl">estudiante</span></h1>
            <p data-i18n="services.intro">Texto de ejemplo: párrafo introductorio sobre el enfoque educativo de CIFE.</p>
          </div>
        </div>
```

- [ ] **Step 2: Restructure the three service blocks**

Each `.service` becomes text + media. Keep every icon SVG, heading, description, and check-list **exactly as-is**, wrapped in `.service-text`; add a media figure. Pattern for service 1 (lines 25–36):

```html
        <div class="service">
          <div class="service-text">
            <svg class="icon icon-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <h2 data-i18n="services.s1.title">Tutorías K-12</h2>
            <p data-i18n="services.s1.desc">Texto de ejemplo: descripción del servicio de tutorías — materias cubiertas, grados atendidos, modalidad individual o grupal.</p>
            <ul class="check-list">
              <!-- the three existing <li> rows, unchanged -->
            </ul>
          </div>
          <figure class="service-media cutout">
            <img src="assets/gallery/foto-01.svg" alt="Tutorías K-12 — imagen de ejemplo">
          </figure>
        </div>
```

Same for service 2 (`services.s2.*`, `foto-02.svg`, alt "Programa de Homeschooling — imagen de ejemplo") and service 3 (`services.s3.*`, `foto-03.svg`, alt "Preparación académica — imagen de ejemplo"). CSS alternates layout/shadow via `:nth-of-type(even)` — no per-row classes needed.

- [ ] **Step 3: Replace the CTA band (lines 65–71) with:**

```html
    <section class="cta-band">
      <div class="container">
        <div class="cta-coupon doodle-book">
          <div>
            <h2><span data-i18n="services.cta.titlePre">¿Interesado en </span><span class="hl" data-i18n="services.cta.titleHl">matricular</span><span data-i18n="services.cta.titlePost"> a tu estudiante?</span></h2>
            <p data-i18n="services.cta.sub">Texto de ejemplo: invitación a comunicarse para orientación sin compromiso.</p>
          </div>
          <a href="contact.html" class="btn" data-i18n="home.hero.cta2">Contáctanos</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: Update I18N_EN**

Replace `"services.title": "How we support your student",` with:

```js
    "services.titlePre": "How we support your ",
    "services.titleHl": "student",
```

Replace `"services.cta.title": "Interested in enrolling your student?",` with:

```js
    "services.cta.titlePre": "Interested in ",
    "services.cta.titleHl": "enrolling",
    "services.cta.titlePost": " your student?",
```

- [ ] **Step 5: Verify both languages**

```bash
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t4-services-es.png --window-size=1366,3000 http://localhost:8017/services.html
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t4-services-en.png --window-size=1366,3000 "http://localhost:8017/services.html?lang=en"
```

Read both. Expected: left-aligned page header with ruler doodle; rows alternate text/media with mirrored pink shadow on row 2; teal check marks; coupon with full sentence intact in both languages ("¿Interesado en matricular a tu estudiante?" / "Interested in enrolling your student?").

- [ ] **Step 6: Commit**

```bash
git add services.html js/i18n.js
git commit -m "Rebuild services as alternating cutout rows with page header"
```

---

### Task 5: why-us.html + about.html

**Files:**
- Modify: `why-us.html:19-23` (page head), `why-us.html:53` (`.section-teal` → `.section-ink`), `why-us.html:65-71` (coupon)
- Modify: `about.html:19-23` (page head)
- Modify: `js/i18n.js` (why/about keys)

**Interfaces:**
- Consumes: `.page-head`, `.doodle-ruler`, `.section-ink`, `.cta-coupon`, `.doodle-book`, `.hl` (Task 2).
- Produces: i18n keys `why.titlePre`, `why.titleHl`, `why.titlePost`, `why.cta.titlePre`, `why.cta.titleHl`, `about.titlePre`, `about.titleHl` (replacing `why.title`, `why.cta.title`, `about.title`).

- [ ] **Step 1: why-us.html page head (lines 19–23):**

```html
        <div class="page-head doodle-ruler">
          <div>
            <span class="eyebrow" data-i18n="why.eyebrow">¿Por Qué Elegirnos?</span>
            <h1><span data-i18n="why.titlePre">La diferencia </span><span class="hl" data-i18n="why.titleHl">CIFE</span><span data-i18n="why.titlePost"></span></h1>
            <p data-i18n="why.intro">Texto de ejemplo: párrafo breve sobre lo que distingue a CIFE de otras opciones educativas.</p>
          </div>
        </div>
```

(EN renders "The CIFE difference" — `titlePost` carries " difference".)

- [ ] **Step 2: Stats band — change line 53 `<section class="section-teal">` to `<section class="section-ink">`.**

- [ ] **Step 3: why-us.html CTA band (lines 65–71):**

```html
    <section class="cta-band">
      <div class="container">
        <div class="cta-coupon doodle-book">
          <div>
            <h2><span data-i18n="why.cta.titlePre">Conócenos en </span><span class="hl" data-i18n="why.cta.titleHl">persona</span></h2>
            <p data-i18n="why.cta.sub">Texto de ejemplo: invitación a visitar el centro o pedir más información.</p>
          </div>
          <a href="contact.html" class="btn" data-i18n="why.cta.btn">Ir a Contacto</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: about.html page head (lines 19–23):**

```html
        <div class="page-head">
          <div>
            <span class="eyebrow" data-i18n="about.eyebrow">Sobre Nosotros</span>
            <h1><span data-i18n="about.titlePre">Quiénes </span><span class="hl" data-i18n="about.titleHl">somos</span></h1>
            <p data-i18n="about.intro">Texto de ejemplo: párrafo introductorio sobre la historia de CIFE, cuándo se fundó y la comunidad a la que sirve en Vega Alta.</p>
          </div>
        </div>
```

- [ ] **Step 5: Update I18N_EN**

Replace `"why.title": "The CIFE difference",` with:

```js
    "why.titlePre": "The ",
    "why.titleHl": "CIFE",
    "why.titlePost": " difference",
```

Replace `"why.cta.title": "Meet us in person",` with:

```js
    "why.cta.titlePre": "Meet us in ",
    "why.cta.titleHl": "person",
```

Replace `"about.title": "Who we are",` with:

```js
    "about.titlePre": "Who we ",
    "about.titleHl": "are",
```

- [ ] **Step 6: Verify both pages, both languages**

```bash
for p in why-us about; do
  timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t5-$p-es.png --window-size=1366,2600 http://localhost:8017/$p.html
  timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t5-$p-en.png --window-size=1366,2600 "http://localhost:8017/$p.html?lang=en"
done
```

Read all four. Expected: why-us EN headline exactly "The CIFE difference" with swipe on "CIFE" (the empty-ES/filled-EN post-span working); stats on deep-ink band with white/lime/teal numerals and the example-numbers note readable; feature mini-cards with ink borders; about two-up cards with pink accent bars.

- [ ] **Step 7: Commit**

```bash
git add why-us.html about.html js/i18n.js
git commit -m "Apply v3 page headers, ink stats band, and coupons to why-us and about"
```

---

### Task 6: gallery.html + testimonials.html

**Files:**
- Modify: `gallery.html:19-23`, `testimonials.html:19-23` (page heads), `testimonials.html:28-34` (coupon)
- Modify: `js/i18n.js` (gallery/testimonials keys)

**Interfaces:**
- Consumes: `.page-head`, `.doodle-plane`, `.cta-coupon`, `.doodle-book`, `.hl` (Task 2). Rendered grids (`render.js`) pick up new CSS with no markup change.
- Produces: i18n keys `gallery.titlePre`, `gallery.titleHl`, `testimonials.titlePre`, `testimonials.titleHl`, `testimonials.titlePost`, `testimonials.cta.titlePre`, `testimonials.cta.titleHl` (replacing `gallery.title`, `testimonials.title`, `testimonials.cta.title`).

- [ ] **Step 1: gallery.html page head (lines 19–23):**

```html
        <div class="page-head doodle-plane">
          <div>
            <span class="eyebrow" data-i18n="gallery.eyebrow">Galería</span>
            <h1><span data-i18n="gallery.titlePre">Nuestro centro en </span><span class="hl" data-i18n="gallery.titleHl">fotos</span></h1>
            <p data-i18n="gallery.sub">Imágenes de ejemplo — serán reemplazadas por fotos reales del centro.</p>
          </div>
        </div>
```

- [ ] **Step 2: testimonials.html page head (lines 19–23):**

```html
        <div class="page-head doodle-plane">
          <div>
            <span class="eyebrow" data-i18n="testimonials.eyebrow">Testimonios</span>
            <h1><span data-i18n="testimonials.titlePre">Lo que dicen las </span><span class="hl" data-i18n="testimonials.titleHl">familias</span><span data-i18n="testimonials.titlePost"></span></h1>
            <p data-i18n="testimonials.sub">Testimonios de ejemplo — serán reemplazados por testimonios reales.</p>
          </div>
        </div>
```

- [ ] **Step 3: testimonials.html CTA band (lines 28–34):**

```html
    <section class="cta-band">
      <div class="container">
        <div class="cta-coupon doodle-book">
          <div>
            <h2><span data-i18n="testimonials.cta.titlePre">Sé parte de la </span><span class="hl" data-i18n="testimonials.cta.titleHl">familia CIFE</span></h2>
            <p data-i18n="testimonials.cta.sub">Texto de ejemplo: invitación a conocer los servicios.</p>
          </div>
          <a href="services.html" class="btn" data-i18n="testimonials.cta.btn">Ver servicios</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: Update I18N_EN**

Replace `"gallery.title": "Our center in photos",` with:

```js
    "gallery.titlePre": "Our center in ",
    "gallery.titleHl": "photos",
```

Replace `"testimonials.title": "What families say",` with:

```js
    "testimonials.titlePre": "What ",
    "testimonials.titleHl": "families",
    "testimonials.titlePost": " say",
```

Replace `"testimonials.cta.title": "Become part of the CIFE family",` with:

```js
    "testimonials.cta.titlePre": "Become part of the ",
    "testimonials.cta.titleHl": "CIFE family",
```

- [ ] **Step 5: Verify both pages, both languages**

```bash
for p in gallery testimonials; do
  timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t6-$p-es.png --window-size=1366,2600 http://localhost:8017/$p.html
  timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t6-$p-en.png --window-size=1366,2600 "http://localhost:8017/$p.html?lang=en"
done
```

Read all four. Expected: gallery frames with rotating teal/pink/lime shadows and italic captions; testimonial cards with oversized teal quote mark and pink shadows; EN testimonials headline "What families say"; data-driven grids still populate (render.js unaffected).

- [ ] **Step 6: Commit**

```bash
git add gallery.html testimonials.html js/i18n.js
git commit -m "Apply v3 page headers and cutout frames to gallery and testimonials"
```

---

### Task 7: contact.html

**Files:**
- Modify: `contact.html:19-23` (page head)
- Modify: `js/i18n.js` (contact keys)

**Interfaces:**
- Consumes: `.page-head`, `.doodle-plane`, `.hl` (Task 2). Map cutout styling is CSS-only (Task 2).
- Produces: i18n keys `contact.titlePre`, `contact.titleHl` (replacing `contact.title`).

- [ ] **Step 1: Page head (lines 19–23):**

```html
        <div class="page-head doodle-plane">
          <div>
            <span class="eyebrow" data-i18n="contact.eyebrow">Contacto</span>
            <h1><span data-i18n="contact.titlePre">Estamos para </span><span class="hl" data-i18n="contact.titleHl">servirte</span></h1>
            <p data-i18n="contact.sub">Texto de ejemplo: invitación a comunicarse por el medio que prefieran.</p>
          </div>
        </div>
```

- [ ] **Step 2: Update I18N_EN**

Replace `"contact.title": "We're here for you",` with:

```js
    "contact.titlePre": "We're here for ",
    "contact.titleHl": "you",
```

- [ ] **Step 3: Verify both languages**

```bash
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t7-contact-es.png --window-size=1366,2200 http://localhost:8017/contact.html
timeout 30 chromium --headless --disable-gpu --screenshot=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad/t7-contact-en.png --window-size=1366,2200 "http://localhost:8017/contact.html?lang=en"
```

Read both. Expected: page header + paper plane; map iframe framed as a cutout (iframe body may render blank in headless — that's the known headless-Chromium quirk, judge only the frame). No CTA coupon on this page.

- [ ] **Step 4: Commit**

```bash
git add contact.html js/i18n.js
git commit -m "Apply v3 page header to contact"
```

---

### Task 8: Full verification sweep

**Files:**
- Possibly small fixes in any of the above (each gets its own commit).

- [ ] **Step 1: Screenshot matrix — 7 pages × ES/EN × 1366px/390px**

```bash
S=/tmp/claude-1000/-home-mellowfllow/087ca523-aa4b-4e03-9f26-522f9b02f2d6/scratchpad
for p in index about services why-us gallery testimonials contact; do
  timeout 30 chromium --headless --disable-gpu --screenshot=$S/v3-$p-es-desktop.png --window-size=1366,3000 http://localhost:8017/$p.html
  timeout 30 chromium --headless --disable-gpu --screenshot=$S/v3-$p-en-desktop.png --window-size=1366,3000 "http://localhost:8017/$p.html?lang=en"
  timeout 30 chromium --headless --disable-gpu --screenshot=$S/v3-$p-es-mobile.png --window-size=390,3000 http://localhost:8017/$p.html
done
```

- [ ] **Step 2: Read every screenshot against this checklist**

- Grid visible but subtle on every page; never behind an opaque band only.
- No lime used as text on light backgrounds (swipes/underlines/ink-band numerals only).
- Doodles: corners only, max 2 per page, absent at 390px.
- Footer logo clean on ink teal — no white box, no fringe.
- Split headlines read as natural sentences in BOTH languages (no missing spaces, no duplicated words — the "The CIFE difference CIFE" failure mode).
- Mobile: hero stacks, service rows stack with un-mirrored shadows, coupon stacks, nav hamburger opens (spot-check one page with a DOM dump if unsure).
- Placeholder texts unchanged (spot-grep):

```bash
grep -c "Texto de ejemplo" services.html why-us.html about.html contact.html
```

Expected: counts identical to `main` (`git diff main --stat` shows no placeholder-string deletions; verify with `git diff main -- services.html | grep -c '^-.*Texto de ejemplo'` → every removed placeholder line has a matching `+` line).

- [ ] **Step 3: Interactive language-toggle check (the split-span pages)**

```bash
timeout 30 chromium --headless --disable-gpu --dump-dom "http://localhost:8017/index.html?lang=en" | grep -o 'Helping every student discover their[^<]*'
timeout 30 chromium --headless --disable-gpu --dump-dom "http://localhost:8017/why-us.html?lang=en" | grep -oE '(The |CIFE| difference)' | head -5
```

Expected: first prints `Helping every student discover their ` (pre-span text present); second shows all three EN fragments present.

- [ ] **Step 4: Fix anything that failed, one commit per fix, re-screenshot until clean.**

---

### Task 9: Merge, push, handoff update

- [ ] **Step 1: Merge and push**

```bash
cd ~/cife-website && git checkout main && git merge --no-ff build/v3-papel-cuadriculado -m "Merge build/v3-papel-cuadriculado: graph-paper design refresh" && git push
```

- [ ] **Step 2: Update HANDOFF.md**

Amend §2 (v3 merged + one-line summary), §3 (new files: `assets/logo.png`, `assets/hero-placeholder.svg`; `logo.jpeg` now source-only), §6 (backlog item 3 "transparent logo" → resolved by DIY knockout; note client-provided vector still nicer long-term), and the i18n section (split-headline span pattern + engine truthiness rule). Commit: `"Update handoff for v3 merge"`, push.

- [ ] **Step 3: Verify live deploy**

```bash
curl -s https://centroeducativocife.com/css/style.css | grep -c 'Papel Cuadriculado'
```

Expected `1` once Porkbun syncs. If still `0` after a few minutes, Damian triggers a manual sync in the Porkbun dashboard (deploy pipeline is possibly manual — HANDOFF §7).

- [ ] **Step 4: Kill the local server**

```bash
pkill -f 'http.server 8017'
```

---

## Plan self-review notes

- **Spec coverage:** tokens ✓ (T2), grid ✓ (T2 body), header/nav/lang ✓ (T2), hl + i18n splits ✓ (T3–T7, engine truthiness rule in constraints), eyebrow ✓, buttons+focus ✓, cutouts ✓, cards/features ✓, stats ink band ✓ (T5 — spec's mention of an index stats band was an error; index has no stats row), coupon ✓ (T3/T4/T5/T6), page heads ✓, doodles ✓ (T2 CSS + per-page host classes; about gets none — it has neither hero nor coupon, within the "max 2" rule), per-page treatments ✓, footer + logo ✓ (T1/T2), assets ✓ (T1), a11y floor ✓ (T2 focus/reduced-motion/contrast + T8 checklist), verification ✓ (T8), out-of-scope untouched ✓.
- **Testimonial/gallery markup** comes from `render.js` (unmodified) — new CSS targets its existing class names; verified in T6.
- **Type consistency:** class names in T3–T7 all defined in T2's stylesheet; i18n key names match between HTML snippets and `I18N_EN` replacements.
