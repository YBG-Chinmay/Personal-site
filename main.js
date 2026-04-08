/* ─────────────────────────────────────────
   LENIS SMOOTH SCROLL
───────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

// Connect Lenis to GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Keep ScrollTrigger in sync with Lenis
lenis.on('scroll', ScrollTrigger.update);

/* ─────────────────────────────────────────
   GSAP SETUP
───────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── Hero entrance ── */
const heroLines = gsap.utils.toArray('.hero-line');
gsap.set(heroLines, { yPercent: 110, opacity: 0 });
gsap.set('.hero-eyebrow', { y: 20, opacity: 0 });
gsap.set('.hero-sub',     { y: 20, opacity: 0 });

const heroTl = gsap.timeline({ delay: 0.2 });
heroTl
  .to(heroLines, {
    yPercent: 0,
    opacity: 1,
    duration: 1.2,
    ease: 'power4.out',
    stagger: 0.15,
  })
  .to('.hero-eyebrow', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
  .to('.hero-sub',     { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6');

/* ── Generic scroll reveals ── */
// .reveal-up — slides up from 40px, fades in
gsap.utils.toArray('.reveal-up').forEach((el) => {
  const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
  gsap.from(el, {
    y: 48,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    delay,
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
});

// .reveal-fade — fades in only
gsap.utils.toArray('.reveal-fade').forEach((el) => {
  const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
  gsap.from(el, {
    opacity: 0,
    duration: 1.0,
    ease: 'power2.out',
    delay,
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
});

/* ── Intro text word-by-word reveal ── */
const introEl = document.querySelector('.intro-text');
if (introEl) {
  const words = introEl.textContent.trim().split(/\s+/);
  introEl.innerHTML = words
    .map(w => `<span class="word"><span class="word-inner">${w}</span></span>`)
    .join(' ');

  gsap.from('.word-inner', {
    yPercent: 100,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.035,
    scrollTrigger: {
      trigger: introEl,
      start: 'top 85%',
    },
  });
}

/* ── Nav background on scroll ── */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: '80px top',
  onEnter:      () => nav.classList.add('nav--filled'),
  onLeaveBack:  () => nav.classList.remove('nav--filled'),
});

/* ── Subtle hero parallax ── */
gsap.to('.hero-bg', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

gsap.to('.hero-orb', {
  yPercent: 35,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let curX   = 0, curY   = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
});

// Lagged ring follows with inertia
function animateCursor() {
  curX += (mouseX - curX) * 0.1;
  curY += (mouseY - curY) * 0.1;
  gsap.set(cursor, { x: curX, y: curY });
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover expand
const hoverTargets = 'a, button, .work-card';
document.querySelectorAll(hoverTargets).forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
});

/* ─────────────────────────────────────────
   MARQUEE SPEED
───────────────────────────────────────── */
// Driven purely by CSS animation; no JS needed.
// (Speed controlled via --marquee-dur in CSS)
