# CIFE Website — Session Handoff

**Written 2026-07-06 for the next Claude session picking up this project.**
Read this top to bottom before touching anything. It is the single source of truth
for where the project stands; the design specs and plans under `docs/superpowers/`
are the deep-dive references.

---

## 1. What this project is

A client website for **CIFE (Centro Educativo CIFE)**, an educational institution
in Puerto Rico, commissioned by a teacher Damian works with. Mostly informational
(services, tutoring, homeschooling, location, testimonials, gallery) with a future
enrollment-form ambition. Primary audience is Spanish-speaking; English is a
secondary, toggleable language.

- **Repo:** `~/cife-website` → `github.com/damianpabon3-byte/cife-website` (`gh` is authenticated as `damianpabon3-byte`)
- **Live site:** **https://centroeducativocife.com** — Porkbun static hosting via GitHub Connect
- **Stack:** plain HTML/CSS/JS. **No build step, no framework, no npm.** Repo root = deploy root, all paths relative. (An early Astro+Tailwind+Netlify plan was abandoned — do not resurrect it.)

## 2. Where the project stands (verified 2026-07-06)

- **v1** (full 7-page client draft), **v2** (client audit response), and **v3** (design refresh, 2026-07-10) are all **merged to `main` and pushed**. Working tree clean, in sync with `origin/main`.
- **The site is DEPLOYED and LIVE.** Verified 2026-07-06: `https://centroeducativocife.com` returns 200 and serves the current `index.html` byte-for-byte (last-modified 2026-07-04, the day after the v2 merge).
- **Current phase: the content pass, arriving page by page.** The client has started sending real copy — About Us landed 2026-07-28 (see §5). Still outstanding: services, why-us, testimonials, and real photos for the gallery. Nothing is blocked on our side.

### What v3 delivered (merged 2026-07-10)
Client design-review response ("bland, too centered, too white, more blue/green, missing charm").
Full visual refresh, spec/plan in `docs/superpowers/` dated 2026-07-10:
- **"Papel Cuadriculado" system:** graph-paper grid background site-wide, deep-teal ink
  (`--color-ink #0F4F4C`) as structural color (header rule, stats band, footer), lime as
  highlighter accents, crimson demoted to CTAs/links. Fraunces replaced Poppins for headings.
- Asymmetric index hero, left-aligned `.page-head` on interior pages, alternating service
  rows (`.service` + `.flip`), paper-cutout shadows (`.cutout`), coupon CTAs (`.cta-coupon`),
  CSS-only school-supply doodles (`.doodle-pencil/-ruler/-book/-plane`).
- **Transparent logo** `assets/logo.png` generated from the JPEG via ImageMagick edge
  floodfill (recipe in the v3 spec §5); `.logo-plate` is gone; `logo.jpeg` stays as source only.
- Headlines with lime swipes are **split into `data-i18n` spans** — see §4 before touching them.
- Gallery placeholder SVGs lost their v2 bottom accent strips (clashed with cutout shadows).

### What v2 delivered (already live)
- Bigger logo: 64px header / 52px footer, sitting on a white `.logo-plate` (the logo file is a white-background JPEG on a crimson header — the plate is the workaround, see §6).
- "Balanced color" pass: crimson footer, graduated pink section bands, pale-teal stats band, self-tinting icon chips via CSS `color-mix()`, rotating accent top-borders on cards.
- Real bilingual inspirational homepage copy ("Ayudamos a cada estudiante a descubrir su potencial" / "Helping every student discover their potential").
- **ES|EN language toggle** (see §4 — this is the piece of architecture you must not break).

## 3. File map

```
index.html, about.html, services.html, why-us.html,
gallery.html, testimonials.html, contact.html      ← the 7 pages (Spanish text lives HERE)
css/style.css        ← all styling, brand design tokens as CSS custom properties (~360 lines)
js/include.js        ← injects shared header/footer into every page; hamburger menu < 900px
js/i18n.js           ← ES/EN engine + the ENTIRE English dictionary (I18N_EN)
js/data.js           ← testimonials + gallery content (data-driven pages render from this)
js/render.js         ← renders TESTIMONIALS/GALLERY from data.js; language-aware
js/reveal.js         ← v3.1 scroll-reveal (IntersectionObserver); must load LAST; JS-off = static site
assets/logo.png      ← transparent logo used by header AND footer (v3; regen recipe in v3 spec §5)
assets/logo.jpeg     ← client logo original (white background) — SOURCE ONLY since v3
assets/hero-placeholder.svg ← index hero placeholder image (v3)
assets/gallery/      ← foto-01..06.svg = PLACEHOLDER images awaiting real photos
docs/colors.jpeg     ← client-provided brand palette reference
docs/superpowers/    ← v1 + v2 design specs and implementation plans (read these for full rationale)
```

## 4. The i18n architecture — DO NOT break this contract

This is the most load-bearing design decision in the codebase:

- **Spanish lives in the HTML.** English lives **only** in `js/i18n.js`, in the `I18N_EN` dictionary, keyed by `data-i18n` attributes on elements.
- On toggle, `i18n.js` swaps `el.textContent` between the stored Spanish (`data-i18n-es`, captured at load) and `I18N_EN[key]`. **Missing English keys silently fall back to Spanish** — that's intentional, not a bug.
- `?lang=en` URL param forces AND persists English — use it for demos and headless testing.
- Persistence: `localStorage` key **`cife-lang`**. Language switches dispatch a **`cife:lang`** CustomEvent; `render.js` listens and re-renders the data-driven pages.
- `data.js` items use paired fields: `quote`/`quoteEn`, `role`/`roleEn`, `alt`/`altEn`, `caption`/`captionEn`. `render.js`'s `pick()` falls back to Spanish when the `…En` field is missing.
- **Trap:** `data-i18n` must only sit on **pure-text elements**. Putting it on an element with child nodes makes the textContent swap delete those children. If mixed content needs translating, wrap the text in a `<span data-i18n="…">`.
- **v3 split headlines:** every h1 (and coupon h2) with a lime `.hl` highlight is split into
  sibling spans keyed `…titlePre` / `…titleHl` / optionally `…titlePost`. Two rules:
  (1) trailing spaces inside span text are load-bearing; (2) the engine's truthiness check
  means an **EN value must never be empty** — a span may be empty on the Spanish side only
  (written `<span data-i18n="…"></span>` with zero inner whitespace, e.g. `why.titlePost`
  is ES `""` / EN `" difference"`). Editing these headlines means editing both the HTML
  spans and the matching `I18N_EN` keys together.

**Damian's editing contract** (he maintains content himself between Claude sessions):
| Change | Edit |
|---|---|
| Spanish text | the HTML page directly |
| English text | `js/i18n.js` (`I18N_EN`) |
| Testimonials / gallery photos | `js/data.js` |

## 5. Deliberate placeholders — do not "fix" them

Remaining body copy marked `"Texto de ejemplo…"` / `"Example text: …"` is **intentional placeholder**, and the gallery uses generated SVGs. These stand in until the client sends real content. **Do not rewrite, polish, or replace them on your own initiative** — that's the client's next deliverable, and inventing content for a real institution would be worse than the placeholder.

**Pages with real, client-supplied copy** (do not touch without a new client document):
- **Homepage** — approved bilingual hero/section copy.
- **About Us** — delivered 2026-07-28 from `Visión, Misión y Perfil.docx`, which arrived already bilingual (Spanish + the client's own English). Covers the intro, mission, vision, and all three value descriptions.
  That document is also the source for CIFE's official name: **Centro Integral Formativo Educativo** / *Center for Integral Formative Education*. The site previously shipped "Centro de Instrucciones y Formación Educativa" everywhere (header alt, footer tagline, copyright, index title) — all corrected 2026-07-28. If the client ever disputes the expansion, it lives in `js/include.js`, `index.html`, and the `footer.tagline`/`footer.legalName` keys.
  Verbatim except three transcription artifacts: double spaces, a space before a period, and a stray semicolon inside the mission's comma-parenthetical ("estrategias diversas; atemperadas") that the client's own English rendering does not have.

## 6. Known limitations / v3 candidate backlog

Confirmed still open as of this handoff (roughly in priority order once the client responds):

1. **Real content pass** — swap placeholder text and gallery SVGs for client-provided text/photos. This is the certain next work item.
2. **Contact/enrollment form** — currently contact info + Google Maps embed only. Client originally wanted online enrollment (was phone-only). Needs a form service (Formspree or similar) since Porkbun static hosting has no backend. Scope question from the original brief was never answered: does the form just *collect* info, or *process* enrollment? Ask before building.
3. ~~**Transparent logo**~~ — RESOLVED in v3 with a DIY ImageMagick knockout (`assets/logo.png`). A client-provided vector original would still be a quality upgrade if one ever appears, but nothing is blocked.
4. **Social media links** — teacher was to provide handles; never arrived.
5. **EN SEO** — `hreflang`/mirrored pages, only if English discoverability ever matters. The JS toggle is invisible to crawlers; don't bother unless asked.

## 7. Deploy pipeline

**Rewritten 2026-07-10 (late).** A GitHub Pages migration was attempted and ABANDONED the
same day — do not resurrect it (Pages is disabled on this repo, domain unclaimed).
The real pipeline is a **two-repo setup**:

- **This repo (`damianpabon3-byte/cife-website`) is the DEV repo** — source of truth,
  including docs. It does NOT deploy anywhere.
- **A separate client-account repo** (name/account unknown — ask Damian; created by him
  2026-07-10) feeds **Porkbun static hosting via GitHub Connect** on
  `centroeducativocife.com`. That connect DOES auto-sync within minutes of a change.
- **Deploy flow:** restage `~/cife-deploy` (rsync from this repo, excluding `.git`,
  `docs/`, `HANDOFF.md`, `.superpowers/`, `.gitignore`) → **Damian manually uploads** its
  contents to the client repo. Offer to automate (second remote + push script) once he
  grants access to the client repo.
- **CDN cache trap (bit us on v3 launch):** Porkbun's CDN caches assets with
  `max-age=2592000` (30 days). HTML revalidates but css/js/images do NOT — a release
  that changes them without new URLs serves mixed old/new content and looks broken.
  Therefore all css/js references carry a `?v=N` query param — **bump N in all 7 pages
  on every release that touches css/js** (currently `?v=5`).
- No CI, no build — whatever reaches the client repo is the site.

## 8. How to develop and verify (tricks that already burned us)

- Local preview: `python -m http.server` from repo root. Pages need HTTP (not `file://`) because header/footer injection fetches partials.
- Headless screenshots: `chromium --headless --screenshot=… --window-size=…`. **Always wrap in `timeout 30`+** — one uncached Google-Fonts fetch once stalled a batch for 2 minutes.
- Test EN with `?lang=en`; test persistence with `--user-data-dir=<scratch>` profile reuse (localStorage).
- The Google Maps iframe on `contact.html` renders **blank in headless Chromium** even though the endpoint returns 200 — confirm it only in a real browser; don't chase it as a bug.
- `git checkout <file>` as a restore drill only works AFTER the new version is committed — commit before risky experiments.

## 9. Working conventions used so far (keep them)

- **Workflow per version:** brainstorm with the user → design spec (`docs/superpowers/specs/`) → implementation plan (`docs/superpowers/plans/`) → build on a `build/vN-*` branch → merge to `main`. v3 should follow the same shape.
- Damian prefers: full spec written in one pass (no section-by-section "looks right?" pauses), inline plan execution (no subagent-vs-inline prompt), direct and concise communication.
- Commits are small and descriptive; look at `git log --oneline` for the voice to match.

## 10. First moves when work resumes

1. Read this file, then skim the v3 spec (`docs/superpowers/specs/2026-07-10-cife-website-v3-design.md`) for the current design system; the v2 spec is historical.
2. `git -C ~/cife-website pull` and `git status` — confirm clean and current.
3. Ask Damian what the client sent back (content? feedback? new requests?) — that decides whether the session is a content pass (mechanical, follow §4's editing contract) or a v3 feature round (brainstorm first).
4. If content arrived: Spanish → HTML, English → `i18n.js`, testimonials/photos → `data.js` + `assets/gallery/`. Verify both languages on every touched page before pushing.
5. After any push, verify the live site actually updated (§7).
