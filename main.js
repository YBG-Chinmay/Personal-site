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

/* ─────────────────────────────────────────
   SMOOTH ANCHOR SCROLLING
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const href = anchor.getAttribute('href');
    if (!href || href === '#') {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      const target = document.querySelector(href);
      if (target) lenis.scrollTo(target, { duration: 1.4, offset: -20 });
    }
  });
});

/* ─────────────────────────────────────────
   CONTRIBUTION BANNER (canvas)
───────────────────────────────────────── */
(function () {
  const ROWS        = 7;
  const GAP         = 3;
  const PAD_H       = 52;   // horizontal padding inside canvas (matches site gutter)
  const PAD_V       = 20;   // vertical padding inside canvas
  const MAX_COLS    = 53;
  const SCROLL_SPEED = 0.55; // px per frame at 60 fps
  const COLORS      = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  const RING_SCALES = [1.18, 1.09, 1.03]; // ring 0, 1, 2

  const canvas = document.getElementById('contribCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let cellW = 0, numCols = 0, step = 0;
  let logicalW = 0, logicalH = 0;
  let columns  = [];  // each: { levels:[ROWS], idlePhase:[ROWS], idleActive:[ROWS] }
  let offset   = 0;   // fractional px scroll offset
  let lastTime = 0;
  let mx = -9999, my = -9999;
  let cbResizeTimer;

  function randLevel() {
    const r = Math.random();
    if (r < 0.32) return 0;
    if (r < 0.52) return 1;
    if (r < 0.71) return 2;
    if (r < 0.87) return 3;
    return 4;
  }

  function makeColumn() {
    const levels     = Array.from({length: ROWS}, () => randLevel());
    const idlePhase  = Array.from({length: ROWS}, () => Math.random() * Math.PI * 2);
    const idleActive = levels.map(l => l > 0 && Math.random() < 0.08);
    return { levels, idlePhase, idleActive };
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    logicalW  = canvas.parentElement.clientWidth;

    const availW = logicalW - 2 * PAD_H;
    cellW = Math.floor((availW - (MAX_COLS - 1) * GAP) / MAX_COLS);
    if (cellW < 8) {
      cellW   = 8;
      numCols = Math.floor((availW + GAP) / (cellW + GAP));
    } else {
      numCols = MAX_COLS;
    }
    step     = cellW + GAP;
    logicalH = ROWS * step - GAP + PAD_V * 2;

    canvas.width  = logicalW * dpr;
    canvas.height = logicalH * dpr;
    canvas.style.width  = logicalW + 'px';
    canvas.style.height = logicalH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Buffer must cover: left overflow (PAD_H + cellW) + visible area + right buffer
    const needed = Math.ceil((logicalW + PAD_H + cellW) / step) + 4;
    while (columns.length < needed) columns.push(makeColumn());
  }

  function draw(ts) {
    requestAnimationFrame(draw);

    const dt = lastTime ? Math.min((ts - lastTime) / (1000 / 60), 3) : 1;
    lastTime = ts;

    ctx.clearRect(0, 0, logicalW, logicalH);

    // Advance horizontal scroll
    offset += SCROLL_SPEED * dt;
    // Only remove a column once it has fully exited the left canvas edge.
    // Column 0 is at x = PAD_H - offset; it's gone when x + cellW < 0,
    // i.e. offset > PAD_H + cellW.
    while (offset > PAD_H + cellW) {
      offset -= step;
      columns.shift();
      columns.push(makeColumn());
    }

    // Map cursor to column/row in data space
    const rect  = canvas.getBoundingClientRect();
    const lx    = mx - rect.left;
    const ly    = my - rect.top;
    let hovCol  = -1, hovRow = -1;
    if (mx > -100) {
      hovCol = Math.floor((lx - PAD_H + offset) / step);
      hovRow = Math.floor((ly - PAD_V)          / step);
      if (hovCol < 0 || hovCol >= columns.length || hovRow < 0 || hovRow >= ROWS) {
        hovCol = -1; hovRow = -1;
      }
    }

    for (let c = 0; c < columns.length; c++) {
      const x = PAD_H + c * step - offset;
      if (x + cellW < 0 || x > logicalW) continue;

      const col = columns[c];

      for (let r = 0; r < ROWS; r++) {
        const y     = PAD_V + r * step;
        const level = col.levels[r];

        // Chebyshev ring scale
        let scale = 1;
        if (hovCol >= 0) {
          const d = Math.max(Math.abs(c - hovCol), Math.abs(r - hovRow));
          if (d < RING_SCALES.length) scale = RING_SCALES[d];
        }

        // Idle opacity pulse (skip when hovered)
        let alpha = 1;
        if (col.idleActive[r] && scale === 1 && level > 0) {
          col.idlePhase[r] += 0.012 * dt;
          alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(col.idlePhase[r]));
        }

        // Rounded-rect draw (scaled about cell center)
        const hw = (cellW * scale) / 2;
        const cx = x + cellW / 2;
        const cy = y + cellW / 2;
        const bx = cx - hw, by = cy - hw;
        const bw = cellW * scale;
        const rr = Math.max(1.5, 2 * scale);

        ctx.globalAlpha = alpha;
        ctx.fillStyle   = COLORS[level];
        ctx.beginPath();
        ctx.moveTo(bx + rr, by);
        ctx.lineTo(bx + bw - rr, by);
        ctx.arcTo(bx + bw, by,      bx + bw, by + rr,      rr);
        ctx.lineTo(bx + bw, by + bw - rr);
        ctx.arcTo(bx + bw, by + bw, bx + bw - rr, by + bw, rr);
        ctx.lineTo(bx + rr, by + bw);
        ctx.arcTo(bx,       by + bw, bx,       by + bw - rr, rr);
        ctx.lineTo(bx,      by + rr);
        ctx.arcTo(bx,       by,      bx + rr,  by,           rr);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }

  window.addEventListener('resize', () => {
    clearTimeout(cbResizeTimer);
    cbResizeTimer = setTimeout(resize, 150);
  });

  canvas.addEventListener('mousemove',  e  => { mx = e.clientX; my = e.clientY; });
  canvas.addEventListener('mouseleave', () => { mx = -9999;     my = -9999;     });

  resize();
  requestAnimationFrame(draw);
})();
