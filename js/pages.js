/**
 * Antony Shane — Sub-page JS (research / rapture-twelve / zharnyx)
 * Handles: page reveal · nav · mobile nav · rich scroll animations
 */
'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

window.addEventListener('load', initPage);

function initPage() {

  /* ══════════════════════════════════════
     PAGE ENTRANCE — wipe the body in
  ══════════════════════════════════════ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.55s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  /* ══════════════════════════════════════
     NAV SCROLL STATE
  ══════════════════════════════════════ */
  const nav = $('#nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     MOBILE NAV
  ══════════════════════════════════════ */
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

  /* ══════════════════════════════════════
     GSAP — graceful fallback
  ══════════════════════════════════════ */
  if (typeof gsap === 'undefined') {
    $$('.inner, .fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .timeline-item')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════
     HERO — staggered multi-layer reveal
  ══════════════════════════════════════ */
  const heroInners = $$('.page-hero .inner');
  if (heroInners.length) {
    // breadcrumb slides in from left
    gsap.fromTo('.page-hero .breadcrumb',
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.05 }
    );

    // Title lines clip upward
    gsap.fromTo(heroInners,
      { y: '110%' },
      { y: 0, duration: 1.15, ease: 'expo.out', stagger: 0.13, delay: 0.2 }
    );

    // Subtitle + CTA fade up
    gsap.fromTo(
      ['.page-hero .page-hero-sub', '.page-hero .page-hero-tagline', '.page-hero .hero-cta-row'],
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.72 }
    );

    // Stats bar sweeps up last
    gsap.fromTo('.hero-stats-bar',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.1 }
    );

    // Stat numbers count up
    $$('.stat-num').forEach(el => {
      const raw  = el.textContent.trim();
      const num  = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.]/g, '');
      if (!isNaN(num) && num > 0) {
        gsap.fromTo({ val: 0 }, { val: num },
          {
            duration: 1.6, ease: 'power2.out', delay: 1.15,
            onUpdate: function() {
              el.textContent = (Number.isInteger(num)
                ? Math.round(this.targets()[0].val)
                : this.targets()[0].val.toFixed(0)) + suffix;
            }
          }
        );
      }
    });
  }

  /* ══════════════════════════════════════
     SECTION TITLES — clip upward
  ══════════════════════════════════════ */
  $$('.reveal-title').forEach(title => {
    gsap.fromTo($$('.inner', title),
      { y: '110%' },
      {
        y: 0, duration: 0.95, ease: 'expo.out', stagger: 0.11,
        scrollTrigger: { trigger: title, start: 'top 87%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     SECTION LABELS — line draws + text
  ══════════════════════════════════════ */
  $$('.section-label').forEach(label => {
    gsap.fromTo(label,
      { opacity: 0, x: -12 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     SECTION RULES — width expand
  ══════════════════════════════════════ */
  $$('.section-rule').forEach(rule => {
    gsap.fromTo(rule,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: rule, start: 'top 95%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     PULL QUOTE — scale + fade
  ══════════════════════════════════════ */
  const pullQuote = $('.pull-quote-text');
  if (pullQuote) {
    gsap.fromTo(pullQuote,
      { opacity: 0, scale: 0.94, y: 20 },
      {
        opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: pullQuote, start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ══════════════════════════════════════
     DIFF ITEMS — slide from right
  ══════════════════════════════════════ */
  $$('.diff-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: 30 },
      {
        opacity: 1, x: 0, duration: 0.65, ease: 'power3.out', delay: i * 0.07,
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     FOUNDER CARDS — stagger up + slight rotate
  ══════════════════════════════════════ */
  $$('.founder-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 35, rotateX: 4 },
      {
        opacity: 1, y: 0, rotateX: 0, duration: 0.85, ease: 'expo.out', delay: i * 0.12,
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     TIMELINE — dots pulse + content reveal
  ══════════════════════════════════════ */
  $$('.tl-phase').forEach((phase, i) => {
    const dot     = $('.tl-dot', phase);
    const content = $$('.tl-duration, .tl-title, .tl-desc, .tl-checks', phase);

    if (dot) {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
          scrollTrigger: { trigger: phase, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
      // Pulse ring after dot appears
      gsap.fromTo(dot,
        { boxShadow: '0 0 0 0 rgba(200,169,110,0.5)' },
        {
          boxShadow: '0 0 0 10px rgba(200,169,110,0)',
          duration: 1, ease: 'power2.out', delay: 0.5,
          scrollTrigger: { trigger: phase, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    gsap.fromTo(content,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', stagger: 0.08, delay: 0.15,
        scrollTrigger: { trigger: phase, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     TRACK CARDS — staggered scale-up
  ══════════════════════════════════════ */
  const trackCards = $$('.track-card');
  if (trackCards.length) {
    gsap.fromTo(trackCards,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: '.tracks-grid', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ══════════════════════════════════════
     PHASE ROWS (program section)
  ══════════════════════════════════════ */
  $$('.phase-row').forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 86%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     FAQ — alternating slide directions
  ══════════════════════════════════════ */
  $$('.faq-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: i % 2 === 0 ? -22 : 22 },
      {
        opacity: 1, x: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 89%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     CTA HEADLINE + BUTTON
  ══════════════════════════════════════ */
  const ctaInners = $$('.cta-headline .inner');
  if (ctaInners.length) {
    gsap.fromTo(ctaInners,
      { y: '110%' },
      {
        y: 0, duration: 1, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.cta-headline', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
    gsap.fromTo(['.cta-sub', '.cta-btns'],
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1, delay: 0.3,
        scrollTrigger: { trigger: '.cta-headline', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ══════════════════════════════════════
     CONTACT HEADLINE (research / rapture)
  ══════════════════════════════════════ */
  const contactInners = $$('.contact-headline .inner');
  if (contactInners.length) {
    gsap.fromTo(contactInners,
      { y: '110%' },
      {
        y: 0, duration: 1, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.contact-headline', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ══════════════════════════════════════
     GENERAL FADE-INs — remaining elements
     (runs last so specific selectors above win)
  ══════════════════════════════════════ */
  $$('section').forEach(section => {
    const items = $$('.fade-in', section);
    if (!items.length) return;
    gsap.fromTo(items,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.72, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: section, start: 'top 83%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     HERO SUBTLE PARALLAX on scroll
  ══════════════════════════════════════ */
  const heroInner = $('.page-hero-inner');
  if (heroInner) {
    gsap.to(heroInner, {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.page-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }

  /* ══════════════════════════════════════
     COUNTER elements (.counter[data-target])
  ══════════════════════════════════════ */
  $$('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    gsap.fromTo(el,
      { innerText: 0 },
      {
        innerText: target,
        duration: 1.8, ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  /* ══════════════════════════════════════
     JOURNEY ITEMS (My Journey page)
  ══════════════════════════════════════ */
  const journeyItems = $$('.journey-item');
  if (journeyItems.length > 0) {
    journeyItems.forEach(item => {
      gsap.set(item, { opacity: 0, y: 55, scale: 0.96 });
      ScrollTrigger.create({
        trigger: item, start: 'top 84%', once: true,
        onEnter: () => {
          gsap.to(item, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'expo.out' });
        }
      });
    });
    ScrollTrigger.refresh();
  }

  /* ══════════════════════════════════════
     RESEARCH CARDS / PILLAR CARDS
  ══════════════════════════════════════ */
  $$('.research-card, .pillar-card, .founder-card-box').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 36, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out', delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 87%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     ACHIEVEMENT STRIP ITEMS
  ══════════════════════════════════════ */
  $$('.ach-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.06,
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     RAPTURE TWELVE — HERO CINEMATIC REVEAL
  ══════════════════════════════════════ */
  const r12Hero = $('.r12-hero');
  if (r12Hero) {
    const r12tl = gsap.timeline({ delay: 0.15 });

    // Breadcrumb slides from left
    r12tl.fromTo('.r12-breadcrumb',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
    );

    // Company name clips up
    r12tl.fromTo('.r12-company-name',
      { opacity: 0, y: 60, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'expo.out' },
      '-=0.3'
    );

    // "Pvt Ltd." italic sweeps in
    r12tl.fromTo('.r12-company-sub',
      { opacity: 0, y: 50, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'expo.out' },
      '-=0.75'
    );

    // Tagline — words slam in one by one, dots fade between
    r12tl.to('.r12-tagline', { opacity: 0.8, duration: 0.01 }, '-=0.3');
    r12tl.fromTo('.r12-tg-word',
      { opacity: 0, y: -20, scale: 1.3, filter: 'blur(6px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'back.out(1.7)', stagger: 0.2 },
      '-=0.25'
    );
    r12tl.fromTo('.r12-tg-dot',
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.15 },
      '-=0.45'
    );

    // Subtitle slides up
    r12tl.fromTo('.r12-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    );

    // CTA buttons pop in
    r12tl.fromTo('.r12-hero-cta',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    );

    // Parallax on scroll
    gsap.to('.r12-hero-inner', {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.r12-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ══════════════════════════════════════
     RAPTURE TWELVE — SECTION HEADERS
  ══════════════════════════════════════ */
  $$('.r12-section-title').forEach(title => {
    gsap.fromTo(title,
      { opacity: 0, y: 40, scale: 0.92 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: title, start: 'top 87%', toggleActions: 'play none none none' }
      }
    );
  });

  $$('.r12-section-sub').forEach(sub => {
    gsap.fromTo(sub,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: sub, start: 'top 89%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     RAPTURE TWELVE — DIFF CARDS
     alternating slide from left / right
  ══════════════════════════════════════ */
  $$('.r12-diff-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, x: i % 2 === 0 ? -40 : 40, rotateY: i % 2 === 0 ? 6 : -6 },
      {
        opacity: 1, x: 0, rotateY: 0, duration: 0.85, ease: 'expo.out', delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     RAPTURE TWELVE — PROJECT ROWS
     slide in from left with stagger
  ══════════════════════════════════════ */
  $$('.r12-pt-row').forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, x: -35, borderLeftColor: 'rgba(200,169,110,0)' },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     RAPTURE TWELVE — PRODUCT CARDS
     scale + rotate entrance
  ══════════════════════════════════════ */
  $$('.r12-product-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50, scale: 0.9, rotateX: 8 },
      {
        opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.95, ease: 'expo.out', delay: i * 0.15,
        scrollTrigger: { trigger: card, start: 'top 87%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     RAPTURE TWELVE — LEADER CARDS
     bouncy scale entrance
  ══════════════════════════════════════ */
  $$('.r12-leader-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40, scale: 0.88, rotateY: 12 },
      {
        opacity: 1, y: 0, scale: 1, rotateY: 0, duration: 1, ease: 'back.out(1.4)', delay: i * 0.18,
        scrollTrigger: { trigger: card, start: 'top 87%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ══════════════════════════════════════
     RAPTURE TWELVE — CONTACT SECTION
  ══════════════════════════════════════ */
  $$('.r12-contact-block').forEach((block, i) => {
    gsap.fromTo(block,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.12,
        scrollTrigger: { trigger: block, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  const r12Form = $('.r12-form-wrap');
  if (r12Form) {
    gsap.fromTo(r12Form,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: r12Form, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ══════════════════════════════════════
     RAPTURE TWELVE — FOOTER REVEAL
  ══════════════════════════════════════ */
  const r12Footer = $('.r12-footer');
  if (r12Footer) {
    gsap.fromTo(r12Footer,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: r12Footer, start: 'top 95%', toggleActions: 'play none none none' }
      }
    );
  }

}
