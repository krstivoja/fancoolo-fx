/**
 * FX — Lightweight GSAP Animation SDK
 *
 * Three ways to trigger animations:
 *
 *   1. Explicit classes with trigger suffix:
 *      .fx-text-reveal-pl  (page load)
 *      .fx-text-reveal-st  (scroll trigger)
 *
 *   2. Bare classes inside <section> — auto scroll-triggered:
 *      <section>
 *        <h2 class="fx-text-reveal">Auto scroll-triggered by section</h2>
 *      </section>
 *
 *   3. Tag-based auto-animation (zero classes):
 *      FX.config.tagMap = { 'h1,h2,h3': 'textReveal', 'img': 'reveal' }
 *
 * Modifier classes (Gutenberg-friendly):
 *   .fx-duration-[1.5]  .fx-delay-[0.3]  .fx-stagger-[0.2]  .fx-ease-[power2.inOut]
 *
 * JS API:
 *   FX.textReveal(el, { trigger: 'scroll', delay: 0.2 })
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ── Config ──────────────────────────────────

export const config = {
    /**
     * CSS selector for section containers.
     * Elements with bare .fx-* classes (no -pl/-st suffix) inside matching
     * containers are auto scroll-triggered using the container as trigger.
     */
    sectionSelector: 'section',

    /**
     * Map of CSS selectors → effect names for zero-class auto-animation.
     * Elements matching these selectors inside sections get animated automatically.
     * Set to null/false to disable. Override before DOMContentLoaded or call FX.init().
     *
     * Example:
     *   FX.config.tagMap = {
     *       'h1,h2,h3,h4,h5,h6': 'textReveal',
     *       'p,blockquote':       'textReveal',
     *       'img,video':          'reveal',
     *   }
     */
    tagMap: null,
};

// ── Defaults ────────────────────────────────

const SCROLL_DEFAULTS = { start: 'top 85%', once: true };

const EFFECT_DEFAULTS = {
    textReveal:  { duration: 1.2, ease: 'power3.out', stagger: 0.1 },
    reveal:      { duration: 1,   ease: 'power3.out' },
    spinReveal:  { duration: 1.4, ease: 'power3.out' },
    bgReveal:    { duration: 1,   ease: 'power3.out' },
    scaleIn:     { duration: 1,   ease: 'power3.out' },
};

// ── Helpers ──────────────────────────────────

/**
 * Parse modifier classes like .fx-duration-[1.5] .fx-delay-[0.3] from an element.
 * Uses bracket syntax so values with dots work in CSS class names.
 */
function getClassModifier(el, name, fallback) {
    const prefix = 'fx-' + name + '-[';
    for (const cls of el.classList) {
        if (cls.startsWith(prefix) && cls.endsWith(']')) {
            const val = cls.slice(prefix.length, -1);
            const num = parseFloat(val);
            return isNaN(num) ? val : num;
        }
    }
    return fallback;
}

function resolveOptions(el, effectName, overrides) {
    const d = EFFECT_DEFAULTS[effectName];
    return {
        duration: getClassModifier(el, 'duration', overrides.duration ?? d.duration),
        ease:     getClassModifier(el, 'ease',     overrides.ease     ?? d.ease),
        stagger:  getClassModifier(el, 'stagger',  overrides.stagger  ?? d.stagger ?? 0),
        delay:    getClassModifier(el, 'delay',     overrides.delay    ?? 0),
    };
}

function buildScrollTrigger(el, scrollTriggerOpts) {
    return {
        trigger: scrollTriggerOpts.trigger || el,
        ...SCROLL_DEFAULTS,
        ...scrollTriggerOpts,
    };
}

// ── Effects ──────────────────────────────────

/**
 * Split text into lines with overflow-hidden mask, reveal upward.
 */
export function textReveal(el, opts = {}) {
    const o = resolveOptions(el, 'textReveal', opts);

    const split = new SplitText(el, {
        type: 'lines',
        linesClass: 'line-wrapper',
    });

    split.lines.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
    });

    const tweenVars = {
        y: '100%',
        opacity: 0,
        duration: o.duration,
        ease: o.ease,
        stagger: o.stagger,
        delay: o.delay,
        onComplete() {
            split.lines.forEach(line => {
                line.style.transform = '';
                line.style.opacity = '';
            });
        },
    };

    if (opts.trigger === 'scroll' || opts.scrollTrigger) {
        tweenVars.scrollTrigger = buildScrollTrigger(el, opts.scrollTrigger || {});
    }

    gsap.from(split.lines, tweenVars);
}

/**
 * Slide-up reveal (images, cards, generic elements).
 */
export function reveal(el, opts = {}) {
    const o = resolveOptions(el, 'reveal', opts);

    const tweenVars = {
        y: opts.y ?? 80,
        opacity: 0,
        duration: o.duration,
        ease: o.ease,
        delay: o.delay,
    };

    if (opts.trigger === 'scroll' || opts.scrollTrigger) {
        tweenVars.scrollTrigger = buildScrollTrigger(el, opts.scrollTrigger || {});
    }

    gsap.from(el, tweenVars);
}

/**
 * Rotate + scale in (badges, icons, decorative elements).
 */
export function spinReveal(el, opts = {}) {
    const o = resolveOptions(el, 'spinReveal', opts);

    const tweenVars = {
        rotation: opts.rotation ?? -30,
        scale: opts.scale ?? 0.9,
        opacity: 0,
        duration: o.duration,
        ease: o.ease,
        delay: o.delay,
    };

    if (opts.trigger === 'scroll' || opts.scrollTrigger) {
        tweenVars.scrollTrigger = buildScrollTrigger(el, opts.scrollTrigger || {});
    }

    gsap.from(el, tweenVars);
}

/**
 * Background container slide-up.
 */
export function bgReveal(el, opts = {}) {
    const o = resolveOptions(el, 'bgReveal', opts);

    const tweenVars = {
        y: '100%',
        opacity: 0,
        duration: o.duration,
        ease: o.ease,
        delay: o.delay,
    };

    if (opts.trigger === 'scroll' || opts.scrollTrigger) {
        tweenVars.scrollTrigger = buildScrollTrigger(el, opts.scrollTrigger || {});
    }

    gsap.from(el, tweenVars);
}

/**
 * Scale-in (glass panels, cards).
 */
export function scaleIn(el, opts = {}) {
    const o = resolveOptions(el, 'scaleIn', opts);

    const tweenVars = {
        scale: opts.scale ?? 0.92,
        opacity: 0,
        duration: o.duration,
        ease: o.ease,
        delay: o.delay,
    };

    if (opts.trigger === 'scroll' || opts.scrollTrigger) {
        tweenVars.scrollTrigger = buildScrollTrigger(el, opts.scrollTrigger || {});
    }

    gsap.from(el, tweenVars);
}

// ── Class-to-effect mapping ─────────────────

const effects = {
    'fx-text-reveal': textReveal,
    'fx-reveal':      reveal,
    'fx-spin-reveal': spinReveal,
    'fx-bg-reveal':   bgReveal,
    'fx-scale-in':    scaleIn,
};

/**
 * Group a NodeList by their direct parent element.
 */
function groupByParent(nodeList) {
    const map = new Map();
    nodeList.forEach(el => {
        const parent = el.parentElement;
        if (!map.has(parent)) map.set(parent, []);
        map.get(parent).push(el);
    });
    return Array.from(map.values());
}

/**
 * Apply a scroll-triggered effect to a group of elements sharing a trigger.
 */
function applyScrollGroup(fn, group, triggerEl) {
    group.forEach((el, i) => {
        fn(el, {
            trigger: 'scroll',
            delay: i * 0.15,
            scrollTrigger: { trigger: triggerEl },
        });
    });
}

/**
 * Scan the DOM for .fx-* classes and apply animations.
 * Called automatically on DOMContentLoaded, or manually via FX.init().
 */
export function init() {
    const processed = new Set();

    Object.keys(effects).forEach(name => {
        const fn = effects[name];

        // 1. Page-load variant: .fx-<name>-pl
        const plGroups = groupByParent(document.querySelectorAll('.' + name + '-pl'));
        plGroups.forEach(group => {
            group.forEach((el, i) => {
                fn(el, { delay: i * 0.15 });
                processed.add(el);
            });
        });

        // 2. Explicit scroll-trigger variant: .fx-<name>-st
        const stGroups = groupByParent(document.querySelectorAll('.' + name + '-st'));
        stGroups.forEach(group => {
            const triggerEl = group[0].parentElement || group[0];
            applyScrollGroup(fn, group, triggerEl);
            group.forEach(el => processed.add(el));
        });

        // 3. Bare class inside a section: .fx-<name> (no suffix)
        //    Auto scroll-triggered using the closest section as trigger
        if (config.sectionSelector) {
            document.querySelectorAll(config.sectionSelector).forEach(section => {
                const bareEls = Array.from(section.querySelectorAll('.' + name))
                    .filter(el => !processed.has(el));
                if (bareEls.length === 0) return;

                const groups = groupByParent(bareEls);
                groups.forEach(group => {
                    applyScrollGroup(fn, group, section);
                    group.forEach(el => processed.add(el));
                });
            });
        }
    });

    // 4. Tag-based auto-animation inside sections
    if (config.tagMap && config.sectionSelector) {
        document.querySelectorAll(config.sectionSelector).forEach(section => {
            Object.keys(config.tagMap).forEach(selector => {
                const effectName = config.tagMap[selector];
                const fn = effects['fx-' + camelToKebab(effectName)] || effectsByName[effectName];
                if (!fn) return;

                const els = Array.from(section.querySelectorAll(selector))
                    .filter(el => !processed.has(el));
                if (els.length === 0) return;

                const groups = groupByParent(els);
                groups.forEach(group => {
                    applyScrollGroup(fn, group, section);
                    group.forEach(el => processed.add(el));
                });
            });
        });
    }
}

/**
 * Convert camelCase to kebab-case: 'textReveal' → 'text-reveal'
 */
function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Lookup map by camelCase name for tagMap config.
 */
const effectsByName = {
    textReveal, reveal, spinReveal, bgReveal, scaleIn,
};

// ── Auto-init ───────────────────────────────

/**
 * Merge pre-configuration from window.__FX_CONFIG__ (set before SDK loads).
 */
function applyPreConfig() {
    const pre = window.__FX_CONFIG__;
    if (!pre) return;
    if (pre.sectionSelector !== undefined) config.sectionSelector = pre.sectionSelector;
    if (pre.tagMap !== undefined) config.tagMap = pre.tagMap;
}

function boot() {
    applyPreConfig();
    init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

// ── Public API on window ────────────────────

window.FX = { config, textReveal, reveal, spinReveal, bgReveal, scaleIn, init };
