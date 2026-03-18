/**
 * Antony Shane — Sub-page JS (research / rapture-twelve / zharnyx)
 * Handles: nav scroll state · mobile nav · fade-in animations
 */
'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

window.addEventListener('load', initPage);

function initPage() {

  /* ── Nav scroll state ── */
  const nav = $('#nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ── Mobile nav ── */
  const mobileNav   = $('#mobile-nav');
  const openBtn     = $('#mobile-nav-btn');
  const closeBtn    = $('#close-mobile-nav');
  const mobileLinks = $$('.mobile-nav-link');

  if (openBtn && mobileNav) {
    function openMobileNav() {
      mobileNav.removeAttribute('hidden');
      mobileNav.offsetHeight;
      mobileNav.classList.add('open');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMobileNav() {
      mobileNav.classList.remove('open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      mobileNav.addEventListener('transitionend', () => {
        if (!mobileNav.classList.contains('open')) mobileNav.setAttribute('hidden', '');
      }, { once: true });
    }
    openBtn.addEventListener('click', openMobileNav);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
    mobileLinks.forEach(l => l.addEventListener('click', closeMobileNav));
  }

  /* ── GSAP animations (if available) ── */
  if (typeof gsap === 'undefined') {
    $$('.inner').forEach(el  => { el.style.transform = 'none'; });
    $$('.fade-in').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    $$('.timeline-item').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* Page hero title reveal */
  const heroInners = $$('.page-hero .inner');
  if (heroInners.length) {
    gsap.fromTo(heroInners,
      { y: '110%' },
      { y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.1 }
    );
    gsap.fromTo(
      ['.page-hero .hero-eyebrow', '.page-hero .page-hero-sub', '.page-hero .hero-cta-row'],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.6 }
    );
  }

  /* Section title reveals */
  $$('.reveal-title').forEach(title => {
    const inners = $$('.inner', title);
    gsap.fromTo(inners,
      { y: '110%' },
      {
        y: 0, duration: 0.95, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: title, start: 'top 86%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Fade-in elements */
  $$('section').forEach(section => {
    const items = $$('.fade-in', section);
    if (!items.length) return;
    gsap.fromTo(items,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.72, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Counter elements */
  $$('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    gsap.fromTo(el,
      { innerText: 0 },
      {
        innerText: target,
        duration: 1.8,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  /* Timeline (My Journey) — individual scroll reveal + hover-flash per card */
  const journeyItems = $$('.journey-item');
  if (journeyItems.length > 0) {

    journeyItems.forEach((item) => {
      const content = item.querySelector('.timeline-content');
      const marker  = item.querySelector('.timeline-marker');

      /* Start hidden */
      gsap.set(item, { opacity: 0, y: 55, scale: 0.96 });

      ScrollTrigger.create({
        trigger: item,
        start: 'top 84%',
        once: true,
        onEnter: () => {

          /* 1 — Slide & fade in */
          gsap.to(item, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.85, ease: 'expo.out',
            onComplete: () => {

              /* 2 — Flash hover state on content box */
              if (content) {
                gsap.timeline()
                  .to(content, {
                    y: -6,
                    borderColor: 'var(--accent-line)',
                    boxShadow: '0 12px 48px rgba(200,169,110,0.13)',
                    duration: 0.32, ease: 'power2.out'
                  })
                  .to(content, {
                    y: 0,
                    borderColor: 'var(--border)',
                    boxShadow: '0 0 0 rgba(200,169,110,0)',
                    duration: 0.55, ease: 'power2.inOut'
                  });
              }

              /* 3 — Pulse marker dot */
              if (marker) {
                gsap.timeline()
                  .to(marker, {
                    scale: 1.35,
                    borderColor: 'var(--accent)',
                    duration: 0.28, ease: 'power2.out',
                    transformOrigin: '50% 50%'
                  })
                  .to(marker, {
                    scale: 1,
                    borderColor: 'var(--border)',
                    duration: 0.7, ease: 'elastic.out(1, 0.45)'
                  });
              }
            }
          });
        }
      });
    });

    ScrollTrigger.refresh();
  }
}
