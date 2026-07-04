# CIFE Website — v2 Design (Client Audit Response)

**Date:** 2026-07-03
**Input:** Client audit of the v1 draft: (1) logo too small, (2) site too white / brand colors underused, (3) homepage needs inspirational copy (e.g., "Helping Every Student Discover Their Potential"), (4) add the English option now.
**Constraint:** Keep the existing layout — every page keeps its current structure, sections, and grid; only surfaces, sizes, copy, and the new language layer change.

## Decisions (confirmed with Damian)

- **i18n:** in-page ES|EN toggle over one set of pages (no `/en/` mirror). Spanish stays authored in the HTML; ALL English lives in one new `js/i18n.js` file.
- **Color:** "Balanced color" level — white remains only for reading surfaces; bands, footer, chips, and accents carry the brand palette.

## 1. Bigger Logo

- Header logo: 46px → **64px** tall; `--header-height` 76px → **92px** (placeholder min-height keeps the no-layout-shift guarantee).
- At ≤600px the header logo caps at 52px so phones don't lose viewport.
- Footer logo: 40px → **52px**, now on a white rounded plate (see footer below).

## 2. Balanced Color Pass

New/changed tokens in `:root`:

```css
--color-bg-alt:    #FAF3F5;   /* was #F7F7F8 gray — now a soft pink wash */
--color-hero-tint: #F7E9EE;   /* hero band */
--color-cta-tint:  #F5DEE6;   /* CTA bands, deeper pink */
--color-teal-tint: #EAF7F5;   /* stats band */
--color-border:    #EDDFE4;   /* border warms slightly to match */
```

Surface changes (CSS only unless noted):

- **Footer goes crimson:** `--color-primary` background, white text, `--color-primary-dark` bottom bar. Links white at 85% opacity, hover 100% + underline. The white-background JPEG logo sits on a white rounded plate (`.logo-plate`: white bg, 10px padding, radius) so it reads deliberate rather than like a transparency mistake.
- **Hero band:** `--color-hero-tint` background (index only, existing `.hero` class).
- **Alt sections:** `.section-alt` becomes the soft pink wash (token change above).
- **CTA bands:** `.cta-band` moves to `--color-cta-tint` with a crimson `h2`.
- **Teal band:** new `.section-teal` utility (`--color-teal-tint` bg) applied to the why-us stats section (markup class swap only).
- **Icon chips:** `.card .icon`, `.feature .icon`, `.contact-list .icon`, `.service > .icon` render inside tinted circles — pure CSS, no markup change: size 52px, padding 12px, `border-radius: 50%`, `background: color-mix(in srgb, currentColor 12%, white)`. Each chip auto-tints to its icon's accent color.
- **Card accents:** `.card-grid .card` gets a 3px top border rotating teal → lime → crimson by `nth-child(3n+1/2/3)`, matching each card's icon color. `.two-up` cards keep their dusty-pink top border.
- **Stats:** `.stat-number` alternates crimson / teal (odd/even). Lime stays out of large text (contrast too weak on light backgrounds).
- **Eyebrow chips:** `.eyebrow` becomes a pill (padding 4px 14px, radius 999px, 10% crimson tint background) so page headers carry color on any band.
- **Gallery placeholders:** regenerate the 6 SVGs with bottom strips rotating pink → teal → lime (was all pink), so the gallery itself answers "more color".
- **Index section rhythm** (markup class swaps on `index.html` only, structure untouched): hero (pink tint) → services cards (white, was alt) → ¿Por qué CIFE? (pink wash, was white) → CTA band (deeper pink). Prevents two adjacent pink bands.

Still true: no gradients, no shadows; lime/teal never as large text or full-width blocks (chips, borders, and the pale teal band are tints, not saturated blocks).

## 3. Inspirational Homepage Copy (real copy, both languages)

`index.html` drops its "Texto de ejemplo" markers — the client asked for real inspirational text here. Final copy:

| Slot | Español (in HTML) | English (in i18n.js) |
|---|---|---|
| Hero h1 | Ayudamos a cada estudiante a descubrir su potencial | Helping every student discover their potential |
| Hero sub | En CIFE acompañamos a las familias de Vega Alta con tutorías K-12, homeschooling y preparación académica — en un ambiente cercano, seguro y hecho a la medida de cada niño. | At CIFE we walk alongside Vega Alta families with K-12 tutoring, homeschooling, and academic prep — in a warm, safe environment tailored to each child. |
| Services intro | Apoyo a la medida de cada estudiante, en cada etapa de su aprendizaje. | Support tailored to every student, at every stage of their learning. |
| ¿Por qué CIFE? blurb | Más que tutorías: somos una comunidad educativa comprometida con el éxito de tus hijos. | More than tutoring: we are an educational community committed to your children's success. |
| CTA band | Historias de familias que confiaron en CIFE. | Stories from families who trusted CIFE. |

Service-card blurbs on the homepage stay placeholder ("Texto de ejemplo…") — they describe services whose real details the client hasn't provided. All other pages keep their placeholder copy; their English strings in `i18n.js` are placeholder too ("Example text: …").

## 4. English Option (ES|EN toggle)

**Editing contract (the part that must stay simple):**
- Spanish → edit the HTML, as today.
- English → edit the matching key in `js/i18n.js` (one file, organized by page with comments).
- Testimonials/photos → one entry in `js/data.js`, which now carries English fields alongside Spanish (`quoteEn`, `roleEn`, `captionEn`, `altEn`). Missing English fields fall back to Spanish — forgetting one never breaks the page.

**Mechanism:**
- Every translatable element gets a `data-i18n="page.section.slot"` attribute. `include.js`'s header/footer templates get them too (they're injected before i18n runs, so the same pipeline covers them).
- New `js/i18n.js`, loaded LAST on every page (`data.js → render.js → include.js → i18n.js`; DOMContentLoaded handlers fire in registration order, so nav and cards exist before i18n applies):
  - `I18N_EN` flat dictionary: key → English string. Also per-page `<title>` keys (`title.inicio` etc., picked via `body[data-page]`).
  - Language resolution: `?lang=en|es` URL param (wins, and makes EN URL-shareable/testable) → `localStorage["cife-lang"]` → default `es`.
  - Apply to EN: for each `[data-i18n]`, stash the original Spanish in `dataset.i18nEs` (first time), then swap in the English string if the dictionary has it. Back to ES: restore stashed text. Sets `<html lang>` accordingly.
  - Fires `window.dispatchEvent(new CustomEvent("cife:lang"))` after every switch.
- **Toggle UI:** `include.js` renders `ES · EN` as two small buttons in the header, right of the nav (outside the collapsing menu, so it's always visible on mobile next to the hamburger). Active language is crimson/bold; `aria-pressed` reflects state. `i18n.js` wires the clicks.
- **`render.js`** becomes language-aware: reads the same resolution chain, renders `quoteEn`/`captionEn`/etc. when EN (falling back per-field to Spanish), re-renders on the `cife:lang` event, and localizes the empty-state note ("Contenido próximamente." / "Coming soon.").

**Accepted trade-offs:** one URL serves both languages, so search engines index Spanish only — fine for the draft; revisit (hreflang or mirrored pages) only if EN SEO ever matters. With JS off there's no English — consistent with the site's existing JS dependence.

## Files Touched

- `css/style.css` — logo sizes, tokens, footer, bands, chips, card accents, eyebrow pill, stats colors, `.section-teal`, `.lang-toggle`, `.logo-plate`.
- `js/include.js` — `data-i18n` keys on nav/footer strings; lang-toggle buttons in header template.
- `js/i18n.js` — **new**: EN dictionary + resolution/apply/toggle/persist + title swap + `cife:lang` event.
- `js/render.js` — language-aware rendering + re-render on toggle.
- `js/data.js` — English fields per entry; template comments updated bilingually.
- All 7 HTML pages — `data-i18n` attributes, `i18n.js` script tag; `index.html` also gets the new copy and the two section-class swaps; `why-us.html` gets `.section-teal` on the stats section.
- `assets/gallery/*.svg` — regenerated with rotating accent strips.

## Verification Plan

1. v1 sweep repeats: `node --check` all JS, all 7 pages HTTP 200, no absolute paths, `file://` render.
2. Headless desktop + mobile screenshots of all pages: crimson footer, tinted bands, chips, bigger logo, no horizontal overflow at 390px.
3. **EN drill (URL-addressable):** `chromium --dump-dom 'http://localhost:8080/index.html?lang=en'` contains "Helping every student discover their potential"; nav shows "Home"; testimonials page in EN shows English quotes; missing-EN-field fallback verified by removing one `quoteEn` temporarily.
4. Toggle persistence: set via `?lang=en`, then dump-dom a second page without the param — still English (localStorage carried it). (Headless uses a fresh profile per run; use `--user-data-dir` to persist across the two invocations.)
5. data.js add-entry drill repeats with the new bilingual entry template.

## Out of Scope (unchanged from v1 Future list)

Real content/photos, contact form service, transparent logo file (white plate is the v2 workaround), social links.
