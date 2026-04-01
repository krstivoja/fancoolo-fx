---
title: Examples
parent: Documentation
nav_order: 8
---

# Examples & Recipes

Practical patterns for common use cases.

## Hero Section with Page Load Animations

```html
<div class="hero" style="position: relative; overflow: hidden; min-height: 100vh;">
    <!-- Background slides up -->
    <div class="hero-bg fx-bg-reveal-pl"
         style="position: absolute; inset: 0; background: #2843E2;">
    </div>

    <div class="hero-content" style="position: relative; z-index: 1;">
        <!-- Badge spins in -->
        <div class="badge fx-spin-reveal-pl">New Release</div>

        <!-- Heading reveals line by line -->
        <h1 class="fx-text-reveal-pl">Your headline<br>goes here.</h1>

        <!-- Paragraph reveals -->
        <p class="fx-text-reveal-pl">Supporting text that describes your product.</p>

        <!-- CTA button slides up -->
        <a href="#" class="btn fx-reveal-pl">Get Started</a>
    </div>
</div>
```

## Blog Post with Scroll Animations

```html
<article>
    <section>
        <h2 class="fx-text-reveal">Introduction</h2>
        <p class="fx-text-reveal">First paragraph of the post...</p>
        <p class="fx-text-reveal">Second paragraph continues...</p>
    </section>

    <section>
        <h2 class="fx-text-reveal">Key Features</h2>
        <div class="image-grid">
            <img class="fx-reveal" src="feature-1.jpg" alt="" />
            <img class="fx-reveal" src="feature-2.jpg" alt="" />
            <img class="fx-reveal" src="feature-3.jpg" alt="" />
        </div>
    </section>

    <section>
        <blockquote class="fx-text-reveal">
            "A customer testimonial that reveals on scroll."
        </blockquote>
    </section>
</article>
```

## Team Grid with Staggered Cards

```html
<section>
    <h2 class="fx-text-reveal">Our Team</h2>

    <div class="team-grid">
        <div class="team-card fx-reveal-st">
            <img src="person-1.jpg" alt="Alice" />
            <h3>Alice Johnson</h3>
            <p>CEO</p>
        </div>
        <div class="team-card fx-reveal-st">
            <img src="person-2.jpg" alt="Bob" />
            <h3>Bob Smith</h3>
            <p>CTO</p>
        </div>
        <div class="team-card fx-reveal-st">
            <img src="person-3.jpg" alt="Carol" />
            <h3>Carol Williams</h3>
            <p>Designer</p>
        </div>
    </div>
</section>
```

The three `.team-card` elements share the same parent and class, so they auto-stagger (0s, 0.15s, 0.3s).

## Pricing Cards with Scale-In

```html
<section>
    <h2 class="fx-text-reveal">Pricing</h2>

    <div class="pricing-grid">
        <div class="pricing-card fx-scale-in-st">
            <h3>Starter</h3>
            <p class="price">$9/mo</p>
            <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
            </ul>
        </div>
        <div class="pricing-card fx-scale-in-st">
            <h3>Pro</h3>
            <p class="price">$29/mo</p>
            <ul>
                <li>Everything in Starter</li>
                <li>Feature 3</li>
            </ul>
        </div>
    </div>
</section>
```

## Feature Tags with Spin Reveal

```html
<div class="feature-tags">
    <span class="tag fx-spin-reveal-st">Fast</span>
    <span class="tag fx-spin-reveal-st">Lightweight</span>
    <span class="tag fx-spin-reveal-st">No Build Step</span>
    <span class="tag fx-spin-reveal-st">Gutenberg Ready</span>
</div>
```

## Slow Dramatic Reveal with Modifiers

```html
<section>
    <!-- Slow heading with wide stagger -->
    <h2 class="fx-text-reveal fx-duration-[2.5] fx-stagger-[0.3] fx-ease-[power4.out]">
        A statement that<br>deserves attention.
    </h2>

    <!-- Delayed paragraph -->
    <p class="fx-text-reveal fx-delay-[0.8] fx-duration-[1.5]">
        Supporting text that appears after the heading finishes.
    </p>
</section>
```

## Zero-Class Full Page (tagMap)

The entire page animates without a single FX class:

```html
<script>
window.__FX_CONFIG__ = {
    tagMap: {
        'h1,h2,h3,h4,h5,h6': 'textReveal',
        'p,blockquote':       'textReveal',
        'img,video':          'reveal',
        '.card':              'scaleIn',
        '.badge':             'spinReveal',
    }
};
</script>
<script src="src/fx.js"></script>

<section>
    <h2>This animates automatically</h2>
    <p>So does this paragraph</p>
    <img src="photo.jpg" alt="" />
    <div class="card">And this card</div>
</section>

<section>
    <h2>Every section is independent</h2>
    <p>Each triggers when scrolled into view</p>
</section>
```

## Mixed: Page Load Hero + Scroll Body

```html
<!-- Hero: page load animations -->
<div class="hero">
    <h1 class="fx-text-reveal-pl">Welcome</h1>
    <p class="fx-text-reveal-pl">Hero content loads immediately</p>
</div>

<!-- Body: scroll-triggered via bare classes in sections -->
<section>
    <h2 class="fx-text-reveal">About</h2>
    <p class="fx-text-reveal">This triggers on scroll</p>
</section>

<section>
    <h2 class="fx-text-reveal">Features</h2>
    <div class="grid">
        <img class="fx-reveal" src="1.jpg" />
        <img class="fx-reveal" src="2.jpg" />
        <img class="fx-reveal" src="3.jpg" />
    </div>
</section>
```

## Compound Sequence via JavaScript

When you need precise control over timing:

```html
<script src="src/fx.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    var cta = document.querySelector('.cta-section');
    if (!cta) return;

    // 1. Background panel scales in
    FX.scaleIn(cta.querySelector('.bg-panel'), {
        trigger: 'scroll',
        scrollTrigger: { trigger: cta }
    });

    // 2. Heading reveals after 0.2s
    FX.textReveal(cta.querySelector('h2'), {
        trigger: 'scroll',
        delay: 0.2,
        scrollTrigger: { trigger: cta }
    });

    // 3. Description reveals after 0.4s
    FX.textReveal(cta.querySelector('p'), {
        trigger: 'scroll',
        delay: 0.4,
        scrollTrigger: { trigger: cta }
    });

    // 4. Button slides up after 0.6s
    FX.reveal(cta.querySelector('.btn'), {
        trigger: 'scroll',
        delay: 0.6,
        scrollTrigger: { trigger: cta }
    });
});
</script>
```
