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

  /* Timeline (My Journey) animations */
  const journeyItems = $$('.journey-item');
  if (journeyItems.length > 0) {
    gsap.fromTo(journeyItems,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'expo.out',
        stagger: 0.2,
        delay: 0.8,
        onComplete: () => {
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }
        }
      }
    );
  }
}
