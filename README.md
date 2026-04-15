# fancoolo-fx — Fancoolo FX

A class-driven GSAP animation wrapper for WordPress and static sites. Add a CSS class to any element and it animates — no JavaScript needed per page.

## Install

```bash
npm install
```

## Usage

Load GSAP + plugins + FX as separate script tags — no build step needed:

```html
<!-- 1. GSAP core -->
<script src="node_modules/gsap/dist/gsap.min.js"></script>
<!-- 2. GSAP plugins -->
<script src="node_modules/gsap/dist/ScrollTrigger.min.js"></script>
<script src="node_modules/gsap/dist/SplitText.min.js"></script>
<!-- 3. Fancoolo FX -->
<script src="src/fx.js"></script>
```

Then add classes in your HTML. Done. FX auto-initializes on DOMContentLoaded.

## Quick Start

```html
<h1 class="fx-text-reveal-pl">Hello World</h1>
```

The heading animates with a masked line-reveal on page load.

## Available Effects

| Effect | Page Load | Scroll Trigger | Description |
|--------|-----------|----------------|-------------|
| Text Reveal | `.fx-text-reveal-pl` | `.fx-text-reveal-st` | Split lines, mask, slide up |
| Reveal | `.fx-reveal-pl` | `.fx-reveal-st` | Slide up + fade |
| Spin Reveal | `.fx-spin-reveal-pl` | `.fx-spin-reveal-st` | Rotate + scale in |
| BG Reveal | `.fx-bg-reveal-pl` | `.fx-bg-reveal-st` | Background slide up |
| Scale In | `.fx-scale-in-pl` | `.fx-scale-in-st` | Scale up + fade |

**Three trigger modes:**
- `-pl` — **Page load**: animates when the DOM is ready
- `-st` — **Scroll trigger**: animates when the element enters the viewport
- **No suffix** — **Section trigger**: bare `.fx-text-reveal` inside a `<section>` is auto scroll-triggered using the section as the trigger

## How Scroll Triggering Works

When FX sees a scroll-triggered element (`-st` suffix or bare class inside a section), it creates a GSAP ScrollTrigger with these defaults:

- **`start: 'top 85%'`** — the animation fires when the top of the element (or its section) reaches 85% down from the top of the viewport
- **`once: true`** — plays once, doesn't replay on re-scroll

For grouped siblings (same class, same parent), the parent is used as the shared trigger — so all items animate together with stagger, rather than each triggering independently.

## Section Auto-Trigger

Elements with bare `.fx-*` classes (no `-pl`/`-st` suffix) inside a `<section>` are automatically scroll-triggered using the section as the trigger:

```html
<section>
    <h2 class="fx-text-reveal">This auto-triggers on scroll</h2>
    <p class="fx-text-reveal">No suffix needed inside a section</p>
    <img src="photo.jpg" class="fx-reveal" />
</section>
```

Change the container selector via config:

```js
FX.config.sectionSelector = '.animate-section';  // only sections with this class
FX.config.sectionSelector = 'section, .wp-block-group';  // multiple selectors
```

## Tag-Based Auto-Animation

For zero-class animation, configure `tagMap` to automatically animate elements by their tag name inside sections:

```html
<!-- Set config BEFORE the FX script loads -->
<script>
    window.__FX_CONFIG__ = {
        tagMap: {
            'h1,h2,h3,h4,h5,h6': 'textReveal',
            'p,blockquote':       'textReveal',
            'img,video':          'reveal',
        }
    };
</script>
<script src="dist/fx.min.js"></script>
```

Or configure after load and re-init:

```js
FX.config.tagMap = { 'h1,h2,h3': 'textReveal', 'img': 'reveal' };
FX.init();
```

Elements already animated by explicit `.fx-*` classes are skipped — tagMap only picks up unhandled elements.

## Auto-Stagger

Sibling elements with the same class are automatically staggered (0.15s between each):

```html
<div>
    <p class="fx-text-reveal-st">First paragraph</p>
    <p class="fx-text-reveal-st">Second paragraph</p>
    <p class="fx-text-reveal-st">Third paragraph</p>
</div>
```

## Modifier Classes

Override timing per-element using modifier classes (Gutenberg-friendly — no inline styles needed):

| Class | Default | Description |
|-------|---------|-------------|
| `fx-duration-[n]` | `1.2` (text) / `1` (others) | Animation duration in seconds |
| `fx-delay-[n]` | `0` | Start delay in seconds |
| `fx-stagger-[n]` | `0.1` | Delay between staggered items |
| `fx-ease-[name]` | `power3.out` | GSAP easing function |

```html
<h2 class="fx-text-reveal-st fx-duration-[2] fx-stagger-[0.25]">
    Slower and wider stagger
</h2>
```

Add these in Gutenberg via the "Additional CSS class(es)" field alongside the effect class.

## JavaScript API

For compound sequences or dynamic content, use the `FX` global:

```js
FX.textReveal(document.querySelector('.hero-title'), {
    trigger: 'scroll',
    delay: 0.3,
    scrollTrigger: { trigger: '.hero-section' }
});
```

### API Reference

All functions accept `(element, options)`:

| Function | Options |
|----------|---------|
| `textReveal(el, opts)` | `duration`, `ease`, `stagger`, `delay`, `trigger`, `scrollTrigger` |
| `reveal(el, opts)` | `y` (default 80), `duration`, `ease`, `delay`, `trigger`, `scrollTrigger` |
| `spinReveal(el, opts)` | `rotation` (default -30), `scale` (default 0.9), `duration`, `ease`, `delay`, `trigger`, `scrollTrigger` |
| `bgReveal(el, opts)` | `duration`, `ease`, `delay`, `trigger`, `scrollTrigger` |
| `scaleIn(el, opts)` | `scale` (default 0.92), `duration`, `ease`, `delay`, `trigger`, `scrollTrigger` |

Set `trigger: 'scroll'` to enable ScrollTrigger. Pass `scrollTrigger: { trigger: someEl }` to use a different trigger element.

### Utility Methods

| Method | Description |
|--------|-------------|
| `FX.init()` | Re-scan DOM and apply animations (for dynamic content) |
| `FX.refresh()` | Re-split text after layout change (sidebar toggle, font load) |
| `FX.config` | Global config object |

**Resize handling:** Text-based effects (`textReveal`, `typeWriter`, `splitWords`) automatically re-split when the browser width changes. After one-shot animations complete, the SplitText DOM is reverted so text reflows naturally.

## Preventing Flash of Unstyled Content (FOUC)

FX uses GSAP's `autoAlpha` internally, so elements with `visibility: hidden` are revealed automatically when their animation starts. Add this CSS **before** any content renders to prevent the flash where elements appear briefly before JS loads:

```css
.fx-text-reveal-pl,.fx-text-reveal-st,.fx-text-reveal,
.fx-reveal-pl,.fx-reveal-st,.fx-reveal,
.fx-spin-reveal-pl,.fx-spin-reveal-st,.fx-spin-reveal,
.fx-bg-reveal-pl,.fx-bg-reveal-st,.fx-bg-reveal,
.fx-scale-in-pl,.fx-scale-in-st,.fx-scale-in,
.fx-fade-in-pl,.fx-fade-in-st,.fx-fade-in,
.fx-blur-in-pl,.fx-blur-in-st,.fx-blur-in,
.fx-clip-up-pl,.fx-clip-up-st,.fx-clip-up,
.fx-clip-down-pl,.fx-clip-down-st,.fx-clip-down,
.fx-tilt-in-st,.fx-tilt-in,
.fx-type-writer-pl,.fx-type-writer-st,.fx-type-writer,
.fx-draw-svg-pl,.fx-draw-svg-st,.fx-draw-svg,.fx-draw-svg-scrub,
.fx-split-words-pl,.fx-split-words-st,.fx-split-words,
.fx-slide-left-pl,.fx-slide-left-st,.fx-slide-left,
.fx-slide-right-pl,.fx-slide-right-st,.fx-slide-right{visibility:hidden}
```

**WordPress:** The plugin injects this CSS automatically in the `<head>` — no action needed.

## Using in a New Project

1. Copy this repo (or `npm install`)
2. Add the 4 script tags (gsap, ScrollTrigger, SplitText, fx.js)
3. Add the FOUC prevention CSS in your `<head>` (see above)
4. Add `.fx-*` classes in your HTML

For compound sequences, create a project-specific JS file loaded after fx.js:

```js
// animations.js — loaded after fx.js
document.addEventListener('DOMContentLoaded', function () {
    var hero = document.querySelector('.hero');
    if (hero) {
        FX.scaleIn(hero.querySelector('.card'), { trigger: 'scroll', scrollTrigger: { trigger: hero } });
        FX.textReveal(hero.querySelector('h2'), { trigger: 'scroll', delay: 0.2, scrollTrigger: { trigger: hero } });
    }
});
```

## File Structure

```
├── fancoolo-fx.php             ← WordPress plugin
├── readme.txt                  ← WP plugin readme
├── assets/                     ← GSAP + fx.js copies for WP
├── src/fx.js                   ← Source of truth (npm package entry)
├── package.json                ← npm deps (gsap)
├── docs/                       ← GitHub Pages site
├── .distignore                 ← Files excluded from WP plugin zip
├── .npmignore                  ← Files excluded from npm package
├── CLAUDE.md                   ← Project context for Claude
└── README.md
```

## WordPress / Gutenberg

Fancoolo FX uses CSS classes which you can add via the "Additional CSS class(es)" field in the block sidebar. No data attributes or inline styles needed.

## Building the WordPress Plugin Zip

Use [WP-CLI `dist-archive`](https://developer.wordpress.org/cli/commands/dist-archive/) to build a clean plugin zip. The `.distignore` file controls which files are excluded.

```bash
# Install the command (one-time)
wp package install wp-cli/dist-archive-command

# Build the zip from the project root
wp dist-archive .
```

This produces `fancoolo-fx.1.x.x.zip` containing only the plugin files (`fancoolo-fx.php`, `readme.txt`, `assets/`). Upload it via **Plugins → Add New → Upload** in WordPress.

## Publishing to npm

```bash
# Set token once (stored in ~/.npmrc)
npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN

# Publish from the project root
npm publish
```

Only `src/fx.js`, `package.json`, and `README.md` are published (controlled by `.npmignore`).

## Release Checklist

1. Bump version in `package.json` and `fancoolo-fx.php`
2. Run `npm run sync` to copy `src/fx.js` to `assets/` and `docs/vendor/`
3. Commit and push to main
4. Tag and push: `git tag X.Y.Z && git push origin X.Y.Z` (triggers GitHub Release with plugin zip)
5. Publish to npm: `npm publish`
