# CIFE Website v3 — "Papel Cuadriculado" Design Refresh

**Date:** 2026-07-10
**Trigger:** Client design review of the live v2 site. Verbatim concerns:
1. Pages look bland; most are middle-centered and generic.
2. Over-reliance on pure white; not enough blue and green from the brand colors.
3. If white stays, add at least a subtle grid design.
4. Professional, but missing charm.

**Scope:** Pure visual refresh of all 7 pages. No new features. Placeholder copy
stays verbatim (§5 of HANDOFF.md). The i18n contract (§4 of HANDOFF.md) is
preserved — one structural adjustment to headline markup, documented below.

**Decisions made with Damian (visual companion session, mockups in
`.superpowers/brainstorm/12503-1783717486/content/`):**
- Register: **warm editorial** (not playful-schoolhouse, not soft-SaaS).
- Palette: **teal promoted to co-primary**, lime as energy accent, crimson kept
  for CTAs/links/identity. ("Blue and green" in the client's feedback = the teal
  `#4DC4C0` and lime `#B6DD14` from their own palette, `docs/colors.jpeg`.)
- Direction: **A — Papel Cuadriculado** (graph-paper editorial), chosen over
  color-block and soft-wash alternatives.
- Interior-page system validated on a services.html mockup.
- Footer logo: **full-color transparent knockout** (option 1), no white plate.
- Damian's additions: subtle school-supply line-art vectors complementing the
  grid; footer logo must not sit in a white box.

---

## 1. Design concept

The client's "subtle grid" request becomes the site's identity: the white
background turns into **graph paper** — the universal texture of schoolwork.
Everything else follows from that metaphor:

- **Deep teal ink** (`#0F4F4C`) is the structural color: header rule, card
  borders, stats band, footer. This is what answers "more blue".
- **Lime is a highlighter**: swipes behind one key word per page headline,
  active-nav underlines, footer column headings. Never body text on white.
- **Crimson stays the brand's voice**: CTAs, links, the logo. Demoted from
  backgrounds to actions.
- **Paper-cutout shadows**: hard offset `box-shadow` (no blur) in teal/pink on
  photo frames and cards — like construction-paper collage.
- **Fraunces** (warm serif display) replaces Poppins for headings — the
  editorial warmth. Inter stays for body/UI.
- **School-supply doodles**: faint line-art pencil, book, ruler, paper plane in
  the same teal ink as the grid — one or two per page, corners only.

Charm comes from the metaphor's details, not decoration volume.

## 2. Tokens (css/style.css `:root`)

```css
/* Brand palette — unchanged (from client, docs/colors.jpeg) */
--color-primary:      #D2344A;   /* crimson — CTAs, links, logo context */
--color-primary-dark: #B12A3E;
--color-secondary:    #DD92A8;   /* pink — alternating cutout shadows, small accents */
--color-accent-lime:  #B6DD14;   /* highlighter — swipes, underlines, ink-band numerals */
--color-accent-teal:  #4DC4C0;   /* mid teal — cutout shadows, pills, borders */

/* New structural colors */
--color-ink:        #0F4F4C;     /* deep teal ink — footer, stats band, structural borders */
--color-ink-dark:   #0B3D3A;     /* footer bottom bar */
--color-heading:    #123B39;     /* heading text (near-black teal) */

/* Neutrals — paper instead of pure white */
--color-bg:         #FEFDFB;     /* warm paper (replaces #FFFFFF) */
--color-card:       #FFFFFF;     /* cards stay true white so they lift off the paper */
--color-teal-tint:  #EAF7F5;     /* kept */
--color-lime-wash:  #F4F9DC;     /* CTA coupon fill */
--color-text:       #26222A;     /* kept */
--color-text-muted: #5B6663;     /* was #6B6570 — nudged toward teal-gray */
--color-border:     #D8E7E4;     /* was pink #EDDFE4 — now teal-gray */

/* Grid texture */
--grid-line: rgba(20, 110, 106, 0.11);
--grid-size: 26px;               /* 22px under 600px */

/* Type */
--font-heading: "Fraunces", Georgia, serif;      /* Google Fonts, opsz axis, wghts 500/650 */
--font-body:    "Inter", system-ui, sans-serif;  /* kept; Poppins is dropped entirely */
```

Retired tokens: `--color-bg-alt`, `--color-hero-tint`, `--color-cta-tint` (the
pink washes v2 used for section bands — replaced by the grid + ink band +
coupon system).

**Body background = paper + grid**, site-wide:

```css
body {
  background: var(--color-bg);
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}
```

Opaque blocks (cards, ink bands, footer, tinted sections) sit on top; the grid
peeks between sections. No per-section grid classes needed.

## 3. Component system

### Header
- Paper background (slightly translucent, `backdrop-filter` optional — plain
  `rgba(254,253,251,0.94)` is fine), **2px solid ink bottom border** replaces
  the 1px gray one.
- Logo: new transparent `assets/logo.png` (works on paper background too).
- Nav links: ink color; hover crimson. **Active page: 3px lime swipe underline**
  (a `linear-gradient` background-image on the link's bottom edge, slightly
  wider than the text), replacing the crimson border-bottom.
- Lang toggle: pill with 1px teal border; active language ink-on-teal-tint.

### Type scale
- h1 `2.6rem` Fraunces 650; h2 `1.9rem` Fraunces 650; h3 `1.15rem` Fraunces 600.
- Headings use `--color-heading`. Body unchanged (Inter 1rem/1.65).

### Highlighter swipe (`.hl`)
```css
.hl {
  background: linear-gradient(104deg, transparent 1%,
    rgba(182,221,20,0.6) 5%, rgba(182,221,20,0.6) 95%, transparent 99%);
  padding: 0 0.08em;
}
```
Applied to **one word/phrase per page h1** (and the CTA coupon heading).

**i18n contract adjustment:** `data-i18n` must sit on pure-text elements, so a
highlighted headline is split into sibling spans:

```html
<h1>
  <span data-i18n="home.heroTitlePre">Ayudamos a cada estudiante a descubrir su </span>
  <span class="hl" data-i18n="home.heroTitleHl">potencial</span>
</h1>
```

Each split key gets a matching entry in `I18N_EN`. The old single-key entries
are removed. **The highlighted word differs per language** (EN: "potential") —
this works naturally since each span has its own key. Trailing spaces inside
the pre-span are load-bearing; preserve them in both languages.

### Eyebrow
Pill with 1.5px teal border, white fill, ink text, uppercase Inter 700 —
replaces the crimson-tinted pill.

### Buttons
- `.btn` (primary): crimson fill, white text — unchanged behavior.
- `.btn-outline` → ghost: 2px ink border, ink text, white fill; hover ink fill,
  white text (was crimson-themed).
- `:focus-visible`: 3px crimson outline, 2px offset, everywhere interactive.

### Paper-cutout frame (`.cutout`)
The signature card/photo treatment:
```css
border: 2px solid var(--color-ink);
border-radius: 10px;
box-shadow: 7px 7px 0 var(--color-accent-teal);   /* hard offset, no blur */
```
Shadow color variants: `.cutout-pink` (`#DD92A8`, offset mirrored `-7px 7px`
when the layout flips), `.cutout-lime`. Hover (linkable cards only): translate
`-2px,-2px`, shadow grows to `9px 9px` — 0.15s ease, disabled under
`prefers-reduced-motion`.

### Cards (`.card`, home trio, why-us features)
White fill, 1.5px ink border, `4px 4px 0 rgba(18,59,57,0.12)` cutout shadow.
Top accent: 4px × 34px rounded bar (teal/lime/crimson rotation, reusing v2's
nth-child logic) instead of full-width border-top. Icon chips keep the v2
`color-mix` self-tinting.

### Stats band
Full-bleed **ink background** (the big non-white moment on every page that has
stats). White Fraunces numerals; 2nd/3rd stats in lime/teal. Labels
`rgba(255,255,255,0.75)`, uppercase, letterspaced. Replaces the pale-teal tint
band.

### CTA coupon
Replaces the pink `.cta-band`: container (max 820px) with **2px dashed teal
border**, lime-wash fill, 12px radius; Fraunces heading with `.hl` word;
crimson button right-aligned (stacks under 700px). Reads as a cut-out coupon —
the charm moment on every page that had a CTA band.

### Section headings
Interior pages drop the centered `.section-heading` pattern where a **page
header** replaces it: left-aligned, eyebrow + h1 with `.hl` + intro paragraph,
1.5px ink hairline underneath, and (per page) a doodle or rotated dashed
"index card" on the right. Mid-page section headings may stay centered where
content is genuinely symmetric (card trios) — de-centering is for page tops
and content rows, not a ban.

### Doodles (school-supply line art)
Inline `background-image: url("data:image/svg+xml,…")` on absolutely-positioned
`::after` pseudo-elements — no new asset files, no DOM changes, invisible to
screen readers. Style: 2px stroke line-art, color `#157874`, drawn at
**18% opacity**. Inventory and placement:

| Doodle | Where |
|---|---|
| Pencil (rotated ~-12°) | index hero, bottom-right of the photo frame |
| Ruler | services + why-us page header, right side |
| Open book | CTA coupon, top-right corner, peeking over the dashed border |
| Paper plane | gallery + testimonials page header; contact hero |

Rules: max 2 per page, corners only, never behind body text, hidden under
700px viewports. Sizes 90–150px.

## 4. Per-page treatment

All pages: body grid, new header/footer, ink stats band where stats exist,
CTA coupon where a CTA band existed.

- **index.html** — Hero becomes asymmetric two-column (text left / photo frame
  right, `1.15fr 0.85fr`, stacks under 900px): eyebrow pill
  ("VEGA ALTA · K-12 · HOMESCHOOLING"), split-span h1 with `.hl` on
  "potencial"/"potential", muted sub, crimson + ghost buttons. Photo frame is a
  `.cutout` with a new placeholder SVG (`assets/gallery/` style) until real
  photos arrive; pencil doodle. Services trio → new card treatment. Stats →
  ink band. Testimonials teaser cards keep layout, gain cutout borders. CTA →
  coupon.
- **services.html** — Page header (left-aligned) + ruler doodle. Each service
  becomes an **alternating two-column row**: text (h2, description, teal ✓
  check-list) beside a `.cutout` illustration frame; frames alternate shadow
  teal / pink-mirrored. Service icons move into the text column as chips. CTA
  coupon with book doodle.
- **why-us.html** — Page header + ruler. Feature grid keeps 3-col layout;
  features become mini-cards (white, ink border, subtle cutout shadow). Check
  strip stays; ✓ marks teal. Stats → ink band.
- **about.html** — Page header. Misión/Visión two-up cards get cutout
  treatment with teal/pink shadows. Body column stays readable width but
  left-aligned under the page header.
- **gallery.html** — Page header + paper-plane doodle. Grid unchanged
  structurally; each figure becomes a cutout frame, shadow color rotating
  teal/pink/lime by nth-child. Captions Inter italic muted.
- **testimonials.html** — Page header + paper plane. Cards: white, ink border,
  pink cutout shadow, oversized Fraunces `"` glyph in teal-tint behind the
  quote top-left. Left crimson border retired.
- **contact.html** — Page header. Two-column layout stays; contact list icons
  in teal-tint chips; map iframe wrapped in a `.cutout` (teal shadow). CTA
  coupon omitted (page *is* the CTA).

### Footer
Ink background (`--color-ink`), bottom bar `--color-ink-dark`. **Transparent
full-color logo, no plate** — `.logo-plate` is deleted from `include.js`'s
footer partial. Column headings lime, uppercase. Links `rgba(255,255,255,0.82)`,
hover white with lime swipe underline. Text/link colors unchanged otherwise.

## 5. Assets

- **`assets/logo.png`** (new) — transparent full-color knockout, used by header
  *and* footer (replaces `logo.jpeg` in both partials; the JPEG stays in the
  repo untouched as source). Produced this session via ImageMagick; regenerate
  with:
  ```bash
  magick assets/logo.jpeg -fuzz 15% -fill none \
    -draw 'alpha 0,0 floodfill' -draw 'alpha 1599,0 floodfill' \
    -draw 'alpha 0,651 floodfill' -draw 'alpha 1599,651 floodfill' \
    -channel A -morphology Erode Disk:2.5 -blur 0x0.7 -level 40%,90% +channel \
    -resize 800x assets/logo.png
  ```
  (Edge floodfill keeps the white book pages; the erode+blur pass removes the
  baked-in drop-shadow fringe. Validated on ink teal during brainstorming.)
- **Hero placeholder SVG** — one new placeholder in the existing
  `assets/gallery/foto-0N.svg` style, sized 5:4, for the index hero frame.
- **Google Fonts** — swap the Poppins request for
  `Fraunces:opsz,wght@9..144,500;9..144,600;9..144,650` (keep Inter). One
  `<link>` per page `<head>`.
- **Doodles** — data-URI SVGs inside `style.css` only; no files.

## 6. What does NOT change

- All placeholder copy, verbatim (HANDOFF §5). Real homepage copy also stays.
- `js/i18n.js` engine, `js/data.js` schema, `js/render.js` logic. Only
  `I18N_EN` **keys** change where headlines split into pre/hl spans.
- Page count, nav structure, URLs, hosting, no-build constraint.
- Hamburger menu behavior; language toggle behavior.

## 7. Accessibility & quality floor

- Lime is never text on light backgrounds (fails contrast); it appears only as
  swipe-behind-ink-text, underlines, or large numerals on ink.
- Ink `#0F4F4C` on paper: 9.5:1. White on ink: 12+:1. Muted text `#5B6663` on
  paper: 6.4:1. All pass AA (spot-check with a contrast tool during build).
- Grid texture stays below 12% alpha so it never competes with text.
- `:focus-visible` outlines on all interactive elements.
- `prefers-reduced-motion: reduce` disables hover translates and any reveal
  animation.
- Doodles are CSS backgrounds — nothing enters the accessibility tree.

## 8. Verification plan

1. `python -m http.server` from repo root; headless Chromium screenshots
   (wrapped in `timeout 30`) of **all 7 pages × ES + EN (`?lang=en`) × desktop
   1366px + mobile 390px**.
2. Eyeball every screenshot: grid visible but subtle, no lime-as-text, doodles
   in corners only, footer logo clean on ink, no layout breakage.
3. Toggle language interactively on index + services (the split-span pages) to
   confirm the i18n swap still works and no children get eaten.
4. Damian reviews locally before merge; client sees it on the live domain.

## 9. Out of scope (unchanged v3+ backlog)

Real content pass, contact/enrollment form, social links, EN SEO — all wait on
the client (HANDOFF §6). This refresh deliberately touches none of them.
