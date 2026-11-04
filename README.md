# [Placeholder] Russia's war in Ukraine & EU energy policy: static site scaffold

Plain HTML/CSS/vanilla JS, no build step. All copy is placeholder; no facts, figures, or sources yet.

## Structure
```
src/                  site root (serve this folder)
  index.html          home
  about.html
  sources.html        site-wide sources/bibliography
  articles/article-template.html   copy this for each article
  css/main.css        design tokens (:root custom properties) + neutral base styles
  js/main.js          entry: timeline toggle, scroll reveal, conditional visual import
  js/motion.js        shared prefers-reduced-motion helper
  js/reveal.js        data-reveal IntersectionObserver hook
  js/viz/load.js      dynamic entry; imports D3 and mounts charts and maps
  js/viz/chart.js     example bar chart read from the figure's data table
  js/viz/map.js       map mount (no geography drawn in the scaffold)
  js/vendor/d3.js     D3 v7.9.2, vendored ESM bundle
  js/vendor/LICENSE   notices for that bundle
design/               drop sitemap, mockups, style notes here
content/approved/     approved copy lands here
```
`source/` and `review/` existed before the scaffold and are gitignored (not touched).

## Preview
```
cd src && python3 -m http.server 8000
```
Open http://localhost:8000/

Scripts are ES modules, so use a local server. Opening the HTML files directly will not run them. Nothing is loaded from a CDN at runtime.

## Styling
Override the custom properties in `:root` (colors, fonts, spacing, measure). Placeholder blocks use `.placeholder`; remove the class when real copy goes in. Reveal motion and the example chart use those tokens (`currentColor`, spacing). This scaffold does not pick a visual theme.

## Component contracts
**Footnotes:** in text `<sup><a href="#fn-N" id="ref-N">[N]</a></sup>`; list `<section class="footnotes">` with `<li id="fn-N">… <a href="#ref-N" aria-label="Back to reference N">↩</a></li>`.

**Chart:** `<figure class="chart" data-component="chart" data-chart="bar" aria-labelledby>` containing `figcaption`, `.chart-canvas` (`data-mount="chart"`, `aria-hidden="true"`), a `<table>` with `<caption>` as the accessible data fallback (always left in the DOM), and `p.source-line`.

`data-mount="chart"` is the D3 mount. For `data-chart="bar"`, `src/js/viz/chart.js` reads each `tbody` row (`th` label, first `td` number) and draws one bar per row into that mount (SVG bar, HTML label and value). The article template's "Example data" table is the wiring proof: do not hard-code values in JS. The canvas stays `aria-hidden="true"` so the table remains the accessible representation. Other `data-chart` values are left for the design pass (placeholder text stays). If D3 fails to load, the table is unchanged.

**Timeline:** `<ol class="timeline" data-component="timeline" aria-labelledby>` of `<li><time datetime>…</time>: text</li>`. Works as a plain list; JS collapses to 3 items with a "Show all" toggle (`aria-expanded`).

**Map:** `<figure class="map" data-component="map">` with `figcaption`, `.map-canvas` (`data-mount="map"`, `role="img"` + `aria-label`), `<details>` long text alternative, `p.source-line`. When the visual module runs, the canvas is marked `data-mounted="true"` and `data-renderer="d3-geo"`. The scaffold does not draw a map and does not remove the placeholder or the `<details>` alternative. Draw in `src/js/viz/map.js`, using `d3.geoPath` and the rest of the vendored bundle.

Mark example data with `<span class="badge">Example data</span>`.

## Scroll reveal
Add `data-reveal` to an element that should fade and rise the first time it enters the viewport.

- Without JavaScript the element is ordinary visible content. CSS does not hide `[data-reveal]` until JS adds `.will-reveal`.
- `src/js/reveal.js` uses `IntersectionObserver`. Elements already in view are left alone. Elements outside the viewport get `.will-reveal` until they intersect, then `.is-revealed` (`.will-reveal` stays so the transition can run).
- Focus inside a pending element removes `.will-reveal` immediately so keyboard users are not left on invisible content.
- Under `prefers-reduced-motion: reduce`, JS does not add `.will-reveal`. `main.css` also forces those elements to full opacity with no animation, including if the preference changes after load.

## Reduced motion
`src/js/motion.js` exports:

- `prefersReducedMotion()` — true when `(prefers-reduced-motion: reduce)` matches
- `subscribeReducedMotion(callback)` — calls `callback(matches)` when the preference changes, and returns an unsubscribe function

The scroll hook and the example chart both use this module. Chart bars transition only when motion is allowed. If the preference switches to reduce during that transition, the bars snap to their final width and the transition is interrupted. Do not add a second motion check.

## D3 loading
`src/js/main.js` dynamically imports `src/js/viz/load.js` only when the page contains `[data-component="chart"]` or `[data-component="map"]`. That module statically imports `src/js/vendor/d3.js` (D3 **7.9.2**) and then mounts charts and maps. Pages without those components do not download or execute D3.

Do not point scripts or imports at a CDN. To upgrade, vendor another pinned build over `src/js/vendor/d3.js` and update `src/js/vendor/LICENSE`.

With JavaScript disabled, timelines stay expanded, chart tables and map text alternatives stay in place, and reveal targets stay visible.
