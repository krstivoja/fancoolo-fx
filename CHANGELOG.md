# Fancoolo FX — Changelog

## 1.8.3
_(current release)_

## 1.8.2
- **Fix:** `textReveal` now detects containers with block-level children (divs, sections, forms) and only splits text-bearing elements (h1–h6, p, blockquote, etc.) — prevents breakage of interactive widgets like accordions, tabs, and sliders

## 1.8.1
- **Fix:** Removed `split.revert()` calls from `textReveal`, `typeWriter`, and `splitWords` — revert destroys JS state (event listeners, injected DOM) added after SplitText ran
- **Fix:** `textReveal` resize re-splitting fully handled by `autoSplit`, no manual revert needed

## 1.8.0
- **Refactor:** `textReveal` uses native SplitText `autoSplit`, `mask: "lines"`, and `onSplit` — removes manual overflow wrappers and resize handler
- **Refactor:** Responsive and reduced-motion handling via `gsap.matchMedia()` — animations auto-revert when conditions change
- **Refactor:** Idempotent `init()` using persistent WeakSet — safe to call multiple times without double-animating
- **Refactor:** Scrub effects (`tiltIn`, `parallax`, `drawSVG` scrub) routed through `buildScrollTrigger()` — now support debug markers and `fx-start-[...]` overrides
- **Removed:** Manual resize listener, `_splitRegistry`, `document.fonts.ready` blocking — all handled natively by GSAP
- **Enhancement:** `FX.refresh()` simplified to `ScrollTrigger.refresh()`

## 1.7.1
- **Fix:** FOUC prevention — all effects now use `autoAlpha` instead of `opacity`; elements start with `visibility:hidden` and are revealed by GSAP
- **New:** WordPress plugin injects `visibility:hidden` CSS automatically in the head
- **New:** Text-based effects set parent visibility before animating children to prevent flash
- **Enhancement:** `clipUp`/`clipDown` now include `autoAlpha` for consistent FOUC handling

## 1.7.0
- **Fix:** Text-based effects (`textReveal`, `typeWriter`, `splitWords`) now re-split on browser resize — line breaks stay correct at every viewport width
- **New:** SplitText is reverted after one-shot animations complete — text reflows naturally without extra DOM wrappers
- **New:** `FX.refresh()` public method — manually re-split text after layout changes (sidebar toggle, font load)
- **New:** Automatic debounced resize handler (200ms, width-only) for pending scroll-triggered text animations

## 1.6.1
- **Refactor:** Split plugin into namespaced classes under `inc/` with `FancooloFX` namespace
  - `Settings.php`, `Frontend.php`, `Editor.php`, `Admin.php`, `AdminPage.php`, `SaveHandler.php`
- **New:** Integrated dPlugins self-hoster update checker
- Updated release workflow to use `rsync` + `.distignore` pattern

## 1.6.0
- **New:** Gutenberg inspector panel — "FX Animation" added to every block's sidebar
  - Effect dropdown with all 15 effects
  - Trigger toggle: Item (scroll) / Trigger (section) / Page (load)
  - Duration, delay, ease, start position modifiers
  - Parallax Y-shift and `drawSVG` scrub options
  - Copy/Paste FX between blocks (sidebar + context menu)
- **New:** Gutenberg integration toggle in plugin settings
- Build workflow updated to compile editor assets on release

## 1.5.0
- **New:** 5 additional animation effects (fade-in, blur-in, clip-up, clip-down, slide-left/right, draw-svg, parallax, split-words, type-writer, tilt-in)
- **New:** Plugin settings page with import/export

## 1.3.0
- **New:** Settings sidebar in the editor tab

## 1.2.0
- **New:** `tiltIn` 3D perspective effect (scrub-based)

## 1.1.0
- **Fix:** Syntax error — `stagger-all` block was outside `init()`

## 1.0.2
- **Fix:** `-st` scroll trigger

## 1.0.1
- Version bump

## 1.0.0
- Initial release
- 5 animation effects (text-reveal, reveal, spin-reveal, bg-reveal, scale-in)
- Page load, scroll trigger, and section trigger modes
- Modifier classes for timing overrides
- Custom JavaScript editor with CodeMirror
- Built-in quick reference table
