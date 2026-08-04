/**
 * Freehold — motion layer
 * Drop this file into src/ and import it once from main.jsx (see instructions below).
 *
 * Install deps first:
 *   npm install gsap lenis
 *
 * Then in src/main.jsx, add ONE line after the existing imports:
 *   import './animations.js';
 *
 * That's the entire integration. No JSX changes, no CSS changes.
 * All motion is inside a prefers-reduced-motion gate — the page
 * works identically with JS off or motion off.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ─── Lenis smooth scroll wired into GSAP ticker ───────────────────────────────
// This exact wiring is required. Partial wiring causes ScrollTrigger positions
// to drift after the first scroll event.
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

// ─── Motion gate ──────────────────────────────────────────────────────────────
// Everything lives in here. If prefers-reduced-motion is set, nothing below
// runs — Lenis still works (it's just scroll, not animation).
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', (context) => {
  // document.fonts.ready ensures SplitText measures real glyphs, not fallbacks.
  // Freehold loads Newsreader + Inter + IBM Plex Mono — all render correctly
  // before GSAP touches them because of this wait.
  document.fonts.ready.then(() =>
    context.add(() => {
      initIntro();
      initScrollFX();
      initPointerFX();
      initAmbient();
      initProgressBar();
    })
  );

  // ScrollTrigger.refresh after React renders all lazy images
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
});

// ─── 1. INTRO ─────────────────────────────────────────────────────────────────
// Hero headline enters line by line, lede and CTAs stagger in behind it.
// The eyebrow ("Independent build studio · London") leads the sequence.
function initIntro() {
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;

  // SplitText with autoSplit keeps lines correct after window resize
  const split = SplitText.create(h1, {
    type: 'lines',
    mask: 'lines', // clip overflow so lines slide up from below the baseline
    autoSplit: true,
  });

  const tl = gsap.timeline({
    defaults: { ease: 'power4.out', duration: 1.05 },
  });

  // Trust line first — small, arrives early, anchors the space
  tl.from('.hero__trust', { autoAlpha: 0, y: 18, duration: 0.6 });

  // Headline lines stagger up through their masks
  tl.from(split.lines, { yPercent: 110, stagger: 0.09 }, '-=0.4');

  // Lede fades in while the headline is still settling
  tl.from('.hero__lede', { autoAlpha: 0, y: 22, duration: 0.75 }, '-=0.7');

  // CTAs slightly later
  tl.from(
    '.hero__actions .button',
    { autoAlpha: 0, y: 22, stagger: 0.1, duration: 0.7 },
    '-=0.6'
  );

  // Hero artwork drifts in from slight scale
  tl.from('.hero__art', { autoAlpha: 0, scale: 1.04, duration: 1.1 }, '-=1.0');
}

// ─── 2. SCROLL EFFECTS ────────────────────────────────────────────────────────
function initScrollFX() {
  // Section headlines: words enter with a slight upward stagger.
  // Targets every h2 inside a .section (Products, Process, Work, Studio, Enquire).
  gsap.utils.toArray('.section h2, .privacy-note h2').forEach((el) => {
    const split = SplitText.create(el, {
      type: 'words',
      aria: 'auto',
      autoSplit: true,
    });
    gsap.from(split.words, {
      yPercent: 60,
      autoAlpha: 0,
      stagger: 0.045,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Section rule lines (the accent line + number label): wipe in left-to-right
  gsap.utils.toArray('.section-rule').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      x: -30,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Featured product panel: slide up as a unit
  const featured = document.querySelector('.featured-product');
  if (featured) {
    gsap.from(featured, {
      autoAlpha: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: featured, start: 'top 82%', once: true },
    });
  }

  // Product rows: stagger cascade
  gsap.utils.toArray('.product-row').forEach((row, i) => {
    gsap.from(row, {
      autoAlpha: 0,
      x: -40,
      duration: 0.75,
      ease: 'power3.out',
      delay: i * 0.07,
      scrollTrigger: { trigger: row, start: 'top 86%', once: true },
    });
  });

  // Process document prop: drifts in from the right
  const doc = document.querySelector('.process__document');
  if (doc) {
    gsap.from(doc, {
      autoAlpha: 0,
      x: 50,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: doc, start: 'top 80%', once: true },
    });
  }

  // Process rail steps: stagger in sequence (left to right on desktop,
  // top to bottom on mobile — same code works because DOM order matches both)
  gsap.utils.toArray('.process-rail li').forEach((li, i) => {
    gsap.from(li, {
      autoAlpha: 0,
      y: 36,
      duration: 0.75,
      ease: 'power3.out',
      delay: i * 0.11,
      scrollTrigger: { trigger: '.process-rail', start: 'top 82%', once: true },
    });
  });

  // Case study panel: scale in from slight shrink
  const caseStudy = document.querySelector('.case-study');
  if (caseStudy) {
    gsap.from(caseStudy, {
      autoAlpha: 0,
      scale: 0.97,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: { trigger: caseStudy, start: 'top 80%', once: true },
    });
  }

  // Commission strip: slide in from the bottom
  const strip = document.querySelector('.commission-strip');
  if (strip) {
    gsap.from(strip, {
      autoAlpha: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: strip, start: 'top 88%', once: true },
    });
  }

  // Principles grid: pairs enter together, top pair first
  gsap.utils.toArray('.principle').forEach((p, i) => {
    // Pair each odd/even together (they're in a 2-column grid)
    const delay = Math.floor(i / 2) * 0.13;
    gsap.from(p, {
      autoAlpha: 0,
      y: 28,
      duration: 0.7,
      ease: 'power3.out',
      delay,
      scrollTrigger: { trigger: '.principles', start: 'top 84%', once: true },
    });
  });

  // Enquire panel: the two halves enter from opposite sides
  const enquireIntro = document.querySelector('.enquire-panel__intro');
  const contactForm = document.querySelector('.contact-form');
  if (enquireIntro && contactForm) {
    gsap.from(enquireIntro, {
      autoAlpha: 0,
      x: -50,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.enquire-panel', start: 'top 82%', once: true },
    });
    gsap.from(contactForm, {
      autoAlpha: 0,
      x: 50,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.enquire-panel', start: 'top 82%', once: true },
    });
  }

  // Hero media: subtle parallax as you scroll past the hero
  gsap.to('.hero__art', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Section lede text (p inside .section-heading): fade in
  gsap.utils.toArray('.section-heading > p, .process__intro > p, .studio__intro > p').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 20,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

// ─── 3. POINTER EFFECTS ───────────────────────────────────────────────────────
// Only runs on hover-capable devices so it doesn't interfere with touch.
function initPointerFX() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  // Magnetic CTAs: the primary buttons in the hero drift toward the cursor
  document.querySelectorAll('.hero__actions .button').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });

    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.3);
    });
    btn.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });

  // Tilt on the featured product panel and case study
  document.querySelectorAll('.featured-product, .case-study').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, {
        rotationY: px * 6,
        rotationX: -py * 4,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' });
    });
  });

  // Nav underline acceleration: already handled by CSS transition,
  // but we accelerate the button press with a tiny scale punch
  document.querySelectorAll('.button').forEach((btn) => {
    btn.addEventListener('pointerdown', () =>
      gsap.to(btn, { scale: 0.97, duration: 0.1, ease: 'power2.out' })
    );
    btn.addEventListener('pointerup', () =>
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
    );
    btn.addEventListener('pointerleave', () =>
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' })
    );
  });
}

// ─── 4. AMBIENT LAYER ─────────────────────────────────────────────────────────
// A single slow-breathing teal/amber glow in the hero background.
// Uses the accent colour already in the design system — no new palette entries.
function initAmbient() {
  // We inject the blob and grain elements rather than touching App.jsx.
  // They're positioned behind everything via z-index: -1 on the blob.
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Blob
  const blob = document.createElement('div');
  Object.assign(blob.style, {
    position: 'absolute',
    top: '-14%',
    right: '-6%',
    width: '52vw',
    aspectRatio: '1',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(242,165,42,0.13), transparent 68%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: '0',
  });
  // Hero is position:relative from the existing CSS — the blob sits inside it
  hero.style.position = 'relative';
  hero.insertBefore(blob, hero.firstChild);

  // Drift animation — gentle, sine.inOut, long duration
  gsap.to(blob, {
    xPercent: -18,
    yPercent: 14,
    duration: 14,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Grain overlay — fixed, on top of everything
  if (!document.querySelector('.fh-grain')) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('fh-grain');
    svg.setAttribute('aria-hidden', 'true');
    Object.assign(svg.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '100',
      opacity: '0.038',
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
    });
    svg.innerHTML =
      '<filter id="fh-n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3"/></filter>' +
      '<rect width="100%" height="100%" filter="url(#fh-n)"/>';
    document.body.appendChild(svg);
  }
}

// ─── 5. SCROLL PROGRESS BAR ───────────────────────────────────────────────────
// A 2px accent-coloured line across the top of the viewport, scrubbed to
// document scroll. Matches the existing accent token (#f2a52a) without
// needing a CSS variable reference in JS.
function initProgressBar() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '0%',
    height: '2px',
    background: '#f2a52a',
    zIndex: '200',
    pointerEvents: 'none',
    transformOrigin: 'left',
  });
  document.body.appendChild(bar);

  gsap.to(bar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
    },
  });
}
