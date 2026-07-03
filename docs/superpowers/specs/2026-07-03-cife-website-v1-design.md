# CIFE Website — v1 Design (Client Draft)

**Date:** 2026-07-03
**Project:** Multi-page static website for CIFE (Centro de Instrucciones y Formación Educativa), a K-12 tutoring and homeschooling institution in Vega Alta, Puerto Rico.
**Status of this version:** First rough draft for client review. All text and images are Spanish-language placeholders, deliberately marked as such, to demonstrate layout and visual direction — not final content.

## Goals

- Show the client (the teacher) a working, navigable draft of the full site structure and visual identity.
- Deploy as-is to static hosting: GitHub repo → Porkbun GitHub Connect → `centroeducativocife.com`. No build step, no server, no framework.
- Content that will change often (testimonials, gallery photos) must be editable by adding one array entry in a single data file — no touching markup or render logic.

## Non-Goals (v1)

- Real content (text, photos) — placeholders only.
- Contact/enrollment form — contact page shows contact *information* only. A form (via Formspree or similar, since hosting is static) can be added in a later version.
- Bilingual support — Spanish only. English can be layered on later if ever requested.
- CMS of any kind.
- Gallery lightbox / image zoom — a plain grid is enough for the draft.

## Tech Stack

Plain HTML5 + CSS + vanilla JavaScript. No dependencies, no package.json, no build tooling. The only external resource is Google Fonts (one `<link>` per page).

## Site Structure

Seven top-level pages, all sharing an identical header (logo + nav) and footer:

| File | Nav label (ES) | Purpose |
|---|---|---|
| `index.html` | Inicio | Hero + brief intro, links into other sections |
| `about.html` | Sobre Nosotros | Mission, history, values |
| `services.html` | Servicios | Description of tutoring / homeschooling services |
| `gallery.html` | Galería | Photo grid, rendered from `data.js` |
| `testimonials.html` | Testimonios | Parent testimonial cards, rendered from `data.js` |
| `why-us.html` | ¿Por Qué Elegirnos? | Differentiators, feature list |
| `contact.html` | Contacto | Phone, WhatsApp, email, address, hours, map |

## Folder Structure

```
cife-website/
├── index.html
├── about.html
├── services.html
├── gallery.html
├── testimonials.html
├── why-us.html
├── contact.html
├── assets/
│   ├── logo.jpeg              # provided brand logo (used in header + footer)
│   └── gallery/               # placeholder SVG images, swapped for real .jpg later
│       ├── foto-01.svg … foto-06.svg
├── css/
│   └── style.css              # single stylesheet, all pages
├── js/
│   ├── include.js             # shared header/footer injection + nav behavior
│   ├── data.js                # TESTIMONIALS and GALLERY arrays (the only file to edit for new content)
│   └── render.js              # renders data.js arrays into gallery/testimonials pages
└── docs/superpowers/specs/    # this document
```

All asset/link paths are **relative** (`css/style.css`, `assets/logo.jpeg` — no leading `/`), so the site works identically on Porkbun, GitHub Pages preview, `python -m http.server`, and direct `file://` opening.

## Shared Layout Mechanism (`js/include.js`)

Decision: **JS-injected shared header/footer** (over duplicating markup in all 7 files, and over a build-step templating tool which the no-build constraint rules out). Gallery and Testimonials already require JS to render, so the site's JS dependence is already a given; duplication across 7 files is the thing the user explicitly wants to avoid.

How it works:

- Every page contains `<header id="site-header"></header>` and `<footer id="site-footer"></footer>` plus `<script src="js/include.js" defer></script>`.
- `include.js` holds the header and footer markup as template strings and injects them on `DOMContentLoaded`.
- **Active link highlighting:** each page's `<body>` carries `data-page="inicio|about|services|…"`; `include.js` adds an `.active` class to the matching nav link.
- **Mobile nav:** below 900px the nav collapses behind a hamburger button (768px originally; widened because 7 Spanish nav labels don't fit at ~800px); `include.js` wires the toggle. No third-party code.
- The header placeholder gets a CSS `min-height` matching the rendered header so injection causes no layout shift.

Trade-off accepted: with JS disabled the nav/footer don't render. Irrelevant for this audience, and consistent with the data.js requirement.

## Visual Design

**Direction:** clean, professional, minimal. White space does the work; color is used with restraint.

**Colors** — defined once as CSS variables in `:root`:

```css
:root {
  --color-primary:      #D2344A;  /* crimson — headers, nav accents, buttons */
  --color-primary-dark: #B12A3E;  /* hover/active state for primary */
  --color-secondary:    #DD92A8;  /* dusty pink — subtle backgrounds, dividers */
  --color-accent-lime:  #B6DD14;  /* small highlights, icons only */
  --color-accent-teal:  #4DC4C0;  /* small highlights, icons, link hover */
  --color-bg:           #FFFFFF;
  --color-bg-alt:       #F7F7F8;  /* alternating section background */
  --color-text:         #26222A;
  --color-text-muted:   #6B6570;
}
```

Usage rules: crimson for primary actions, headings accents, and the active nav state. Dusty pink only as tints (section dividers, subtle card borders, very light background washes). Lime and teal never as large blocks — icon strokes, hover states, small badges. Everything else white/light gray.

**Typography** — Google Fonts, system fallbacks:
- Headings: **Poppins** (600) — geometric, friendly, fits a K-12 brand without losing professionalism.
- Body: **Inter** (400/600) — highly readable modern sans.
- Fallback stack: `system-ui, -apple-system, sans-serif` so the site degrades fine offline.

**Header:** white background (the logo is a JPEG with a white background, so it blends invisibly — flag to client that a transparent PNG/SVG logo would be a nice-to-have later). Logo left, nav right, thin bottom border in a pink tint. Sticky at top.

**Footer:** light gray (`--color-bg-alt`), three columns — small logo + one-line description, quick links, contact summary. Copyright line with year.

**Layout patterns:** max-width ~1100px content column, generous vertical padding between sections, alternating white / `--color-bg-alt` section backgrounds, cards with 1px borders and small radius — **no heavy shadows, no gradients**.

**Icons:** minimal inline SVGs (stroke style) colored with the accent variables. No icon font, no external icon CDN.

## Page Content (placeholder copy — Spanish)

All body text is clearly placeholder ("Texto de ejemplo — será reemplazado con el contenido final."-style lorem in natural Spanish), structured so the client sees the intended shape of each page:

1. **index.html** — Hero: headline ("Apoyo educativo K-12 en Vega Alta" placeholder), subline, two CTAs ("Conoce nuestros servicios" → services, "Contáctanos" → contact). Below: three overview cards (Tutorías, Homeschooling, Apoyo académico) each linking to services; a short "¿Por qué CIFE?" strip linking to why-us; a single highlighted testimonial teaser linking to testimonials.
2. **about.html** — Intro paragraph, Misión / Visión two-up blocks, "Nuestros valores" row of 3-4 value cards with accent icons.
3. **services.html** — One section per service (3 placeholder services: Tutorías K-12, Programa de Homeschooling, Preparación académica), each with icon, description paragraph, bullet list of what's included.
4. **gallery.html** — Responsive grid (3 cols desktop / 2 tablet / 1 mobile) rendered from `GALLERY` in data.js; each item shows image + caption. Six placeholder SVG images shipped in `assets/gallery/` so the grid demonstrates real behavior.
5. **testimonials.html** — Card grid rendered from `TESTIMONIALS`; each card: quote, name, role line (e.g., "Madre de estudiante de 4to grado"). Five placeholder entries.
6. **why-us.html** — Feature list (4-6 items with accent icons + short blurbs: maestros certificados, atención individualizada, ambiente seguro, horarios flexibles…), plus a simple stats row (placeholder numbers: años de experiencia, estudiantes, etc.).
7. **contact.html** — Two-column: left = contact details (teléfono, WhatsApp link, email, dirección en Vega Alta, horario) with accent icons; right = embedded Google Maps iframe centered on Vega Alta, PR (generic embed, no API key; client can swap in exact-address embed later). Note on page (HTML comment) that a contact form can be added in v2 via a form service.

## Data Model (`js/data.js`)

The only file a non-developer touches to add content. Plain arrays of plain objects, heavily commented in Spanish/English with a copy-paste template entry at the top of each array:

```js
// To add a testimonial: copy one { ... } block, paste it below, edit the text.
const TESTIMONIALS = [
  { quote: "Texto del testimonio…", name: "Nombre Apellido", role: "Madre de estudiante de 4to grado" },
  // …
];

// To add a photo: put the image file in assets/gallery/, then add one entry here.
const GALLERY = [
  { src: "assets/gallery/foto-01.svg", alt: "Descripción de la foto", caption: "Actividad educativa" },
  // …
];
```

## Rendering (`js/render.js`)

- Runs on `DOMContentLoaded`, after `data.js` (script order in HTML guarantees this).
- Looks for `#gallery-grid` and `#testimonials-list`; renders into whichever exists on the current page, no-ops otherwise. Safe to include on any page.
- Builds DOM via template strings; escapes nothing exotic — data is trusted (author-edited file, not user input).
- If an array is empty, renders a friendly Spanish "Contenido próximamente" message instead of an empty grid.

## Error Handling

Deliberately minimal, appropriate to a static brochure site: render.js guards on container existence and array presence (`typeof GALLERY !== "undefined"`), so a malformed data.js edit degrades to the "próximamente" message rather than a blank page. No other runtime error surface exists.

## Responsive Behavior

- Breakpoints: single-column mobile-first CSS; nav collapses to hamburger `< 900px`; grids step 1 → 2 → 3 columns.
- Images: `max-width: 100%`, gallery grid uses `aspect-ratio` boxes with `object-fit: cover` so mixed-size real photos won't break the layout later.

## Verification Plan

1. Serve locally with `python -m http.server` in the project root.
2. Visit all 7 pages: shared header/footer render, correct nav link highlighted on each page, all internal links resolve.
3. Gallery shows 6 items, testimonials shows 5 cards; add a test entry to each array in data.js and confirm it appears with no other edits; remove it.
4. Narrow viewport to ~375px: hamburger menu appears and toggles; grids collapse to one column; no horizontal scroll on any page.
5. Open `index.html` directly via `file://` to confirm relative paths hold outside a server.

## Deployment Notes

- Repo initialized with git; pushed to GitHub under the `damianpabon3-byte` account when Damian is ready; Porkbun GitHub Connect points `centroeducativocife.com` at it.
- Because there is no build step, the repo root **is** the deploy root — `index.html` must stay at the top level (it does).
- `colors.jpeg` (palette reference) stays out of `assets/` — kept in `docs/` as a brand reference, not shipped page content.

## Future (out of scope, noted for the client conversation)

- **English version (confirmed, post-refinement):** an EN option will be added after the Spanish content is finalized. v1 deliberately doesn't build i18n plumbing; when the time comes, the likely shape is either mirrored pages under `/en/` or a JS string-swap layer — decide then. For now this only means: keep copy in semantic, well-structured blocks so it's easy to mirror later.
- Real text/photos per page (client to provide).
- Contact or enrollment form via a static-friendly form service.
- Transparent-background logo (PNG/SVG) for more header flexibility.
- Social media links in footer once handles are provided.
