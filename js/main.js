/**
 * Antony Shane — Portfolio
 * main.js
 *
 * Sections
 * ────────────────────────────────────
 * 1.  Cursor — dot + inertia ring + magnetic buttons
 * 2.  Nav — scroll state + mobile overlay
 * 3.  Word swap — hero typewriter
 * 4.  GSAP — hero reveal (on load) + scroll animations
 *     a. Hero name line reveals
 *     b. Section title line reveals (ScrollTrigger)
 *     c. .fade-in elements (staggered, per-section)
 *     d. Skill group stagger
 *     e. Experience items stagger
 * 5.  Counter — animated number increment
 * 6.  Magnetic buttons
 */

'use strict';

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Run a callback only once GSAP + ScrollTrigger have both loaded.
 * They are loaded `defer`-ed so on DOMContentLoaded they may not
 * be ready; the `load` event fires after all deferred scripts.
 */
window.addEventListener('load', init);

function init() {

  /* ─────────────────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────────────────── */
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');

  if (!dot || !ring) return; // touch-only device, CSS hides them

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot snaps instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with lerp (smooth inertia)
  const RING_LERP = 0.1;

  (function trackRing() {
    rx += (mx - rx) * RING_LERP;
    ry += (my - ry) * RING_LERP;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
  })();

  // Hover state expands ring
  const interactables = $$('a, button, .project-card, .skill-group, .exp-item, .ach-item, .tag, .sg-pills span');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
  });

  /* ─────────────────────────────────────────────────────
     2. NAV
  ───────────────────────────────────────────────────── */
  const nav = $('#nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile navigation
  const mobileNav    = $('#mobile-nav');
  const openBtn      = $('#mobile-nav-btn');
  const closeBtn     = $('#close-mobile-nav');
  const mobileLinks  = $$('.mobile-nav-link');

  function openMobileNav() {
    mobileNav.removeAttribute('hidden');
    // Force reflow so transition fires
    mobileNav.offsetHeight;
    mobileNav.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Re-hide after transition
    mobileNav.addEventListener('transitionend', () => {
      if (!mobileNav.classList.contains('open')) mobileNav.setAttribute('hidden', '');
    }, { once: true });
  }

  openBtn.addEventListener('click', openMobileNav);
  closeBtn.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(l => l.addEventListener('click', closeMobileNav));

  /* ─────────────────────────────────────────────────────
     3. WORD SWAP
  ───────────────────────────────────────────────────── */
  const wordEl = $('#word-swap');
  const words  = [
    'advance security research.',
    'scale cybersecurity ventures.',
    'secure critical systems.',
    'lead offensive engagements.',
    'build workforce-ready talent.',
    'publish impactful research.',
    'defend with attacker insight.',
  ];
  let wordIndex = 0;

  function swapWord() {
    // Fade + lift out
    wordEl.style.opacity   = '0';
    wordEl.style.transform = 'translateY(10px)';

    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      wordEl.textContent     = words[wordIndex];
      wordEl.style.opacity   = '1';
      wordEl.style.transform = 'translateY(0)';
    }, 260);
  }

  setInterval(swapWord, 3000);

  /* ─────────────────────────────────────────────────────
     4. GSAP ANIMATIONS
  ───────────────────────────────────────────────────── */
  if (typeof gsap === 'undefined') {
    // Graceful fallback: make everything visible
    $$('.inner').forEach(el => { el.style.transform = 'none'; });
    $$('.fade-in').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ── 4a. Hero name — staggered line reveals on load ── */
  gsap.fromTo(
    '#hero .hero-name .inner',
    { y: '110%' },
    {
      y: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.14,
      delay: 0.15,
    }
  );

  /* ── 4b. Hero supporting elements — staggered fade-ins ── */
  // We animate on load as they're above the fold
  gsap.fromTo(
    ['#hero .hero-eyebrow', '#hero .hero-tagline', '#hero .hero-cta-row', '#hero .hero-stats'],
    { opacity: 0, y: 22 },
    {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.7,
    }
  );

  /* Hero right side (photo) */
  gsap.fromTo(
    '#hero .hero-right',
    { opacity: 0, x: 30 },
    {
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'expo.out',
      delay: 0.3,
    }
  );

  /* ── 4c. Section title line reveals (ScrollTrigger) ── */
  // All .reveal-title elements *outside* #hero
  $$('.reveal-title').forEach(title => {
    if (title.closest('#hero')) return; // skip hero, already animated

    const inners = $$('.inner', title);

    /* Set initial state (GSAP manages .inner transform; CSS sets it too,
       but GSAP `from` will override cleanly) */
    gsap.fromTo(
      inners,
      { y: '110%' },
      {
        y: 0,
        duration: 0.95,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: title,
          start: 'top 86%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ── 4d. Contact headline (special large reveal) ── */
  const contactHeadline = $('.contact-headline');
  if (contactHeadline) {
    const inners = $$('.inner', contactHeadline);
    gsap.fromTo(
      inners,
      { y: '110%' },
      {
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: contactHeadline,
          start: 'top 88%',
        },
      }
    );
  }

  /* ── 4e. .fade-in elements ── */
  // Group into per-section batches so each section staggers together
  $$('section').forEach(section => {
    const items = $$('.fade-in', section);
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ── 4f. Skill groups — staggered left-to-right ── */
  gsap.fromTo(
    '.skill-group',
    { opacity: 0, y: 24, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: 'power3.out',
      stagger: {
        amount: 0.4,
        from: 'start',
        grid: 'auto',
      },
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 82%',
      },
    }
  );

  /* ── 4g. Experience items — slide in from left, one by one ── */
  $$('.exp-item').forEach((item, i) => {
    gsap.fromTo(
      item,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ── 4h. Project cards — stagger with slight rotation ── */
  $$('.project-card').forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 40, rotation: 0.8 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.75,
        ease: 'power3.out',
        delay: (i % 3) * 0.07,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ── 4i. Achievement cols ── */
  gsap.fromTo(
    '.ach-col',
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.ach-grid',
        start: 'top 84%',
      },
    }
  );

  /* ── 4j. Domains strip ── */
  gsap.fromTo(
    '.d-item',
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: '.domains-strip',
        start: 'top 88%',
      },
    }
  );

  /* ─────────────────────────────────────────────────────
     5. COUNTER ANIMATION
  ───────────────────────────────────────────────────── */
  function animCounter(el, target, ms = 1600) {
    const begin = performance.now();

    function tick(now) {
      const progress = Math.min((now - begin) / ms, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.firstChild.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* We wrap only the text node so <sup> isn't overwritten */
  $$('.counter').forEach(el => {
    // Preserve inner HTML structure; put a text node first if needed
    if (!el.firstChild || el.firstChild.nodeType !== Node.TEXT_NODE) {
      el.insertBefore(document.createTextNode('0'), el.firstChild);
    }

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animCounter(el, parseInt(el.dataset.target), 1800);
        io.disconnect();
      }
    }, { threshold: 0.6 });

    io.observe(el);
  });

  /* ─────────────────────────────────────────────────────
     6. MAGNETIC BUTTONS
     Small mouse-position-relative translate on [data-magnetic]
  ───────────────────────────────────────────────────── */
  const MAGNET_STRENGTH = 0.3;

  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      el.style.transform    = `translate(${(e.clientX - cx) * MAGNET_STRENGTH}px, ${(e.clientY - cy) * MAGNET_STRENGTH}px)`;
      el.style.transition   = 'transform 0.1s';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = 'translate(0, 0)';
      el.style.transition = `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
    });
  });

} // end init()
