# Installation

## npm

```bash
npm install gsap fancoolo-fx
```

This installs:
- **GSAP** — the animation engine (core + all plugins including ScrollTrigger and SplitText)
- **Fancoolo FX** — the class-driven animation wrapper

**Package:** [fancoolo-fx on npm](https://www.npmjs.com/package/fancoolo-fx)

All GSAP plugins are free as of GSAP 3.12.

## Step 2: Add script tags

Load the scripts in this exact order — GSAP core first, then plugins, then FX:

```html
<!-- 1. GSAP core -->
<script src="node_modules/gsap/dist/gsap.min.js"></script>

<!-- 2. GSAP plugins -->
<script src="node_modules/gsap/dist/ScrollTrigger.min.js"></script>
<script src="node_modules/gsap/dist/SplitText.min.js"></script>

<!-- 3. Fancoolo FX -->
<script src="src/fx.js"></script>
```

**Order matters.** GSAP core must load before the plugins, and all three must load before `fx.js`.

## Step 3: Add FOUC prevention CSS

Add this CSS in your `<head>` to prevent elements from flashing before JavaScript loads. FX uses GSAP's `autoAlpha` to reveal them automatically when their animation starts:

```html
<style>
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
</style>
```

**WordPress users:** The plugin injects this CSS automatically — skip this step.

## Step 4: Add classes to your HTML

```html
<h1 class="fx-text-reveal-pl">This animates on page load</h1>
```

That's it. No JavaScript needed.

## File structure

```
your-project/
├── node_modules/
│   └── gsap/
│       └── dist/
│           ├── gsap.min.js
│           ├── ScrollTrigger.min.js
│           └── SplitText.min.js
├── src/
│   └── fx.js
├── package.json
└── index.html
```

## Using in an existing project

If you already have a project with its own `package.json`:

```bash
# Copy fx.js into your project
cp src/fx.js /path/to/your/project/js/fx.js

# Install GSAP in your project
cd /path/to/your/project
npm install gsap
```

Then add the four script tags to your HTML template.

## Verifying the installation

Open your browser's developer console. If FX loaded correctly, you can type:

```js
FX
// Should output: {config: {…}, textReveal: ƒ, reveal: ƒ, spinReveal: ƒ, …}
```

If you see `[FX] Missing dependencies`, check that the GSAP scripts are loading before `fx.js`.
