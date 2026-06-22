'use strict';

// ── Year ──────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Nav scroll ────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');
hamburger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.cssText = open
    ? ''
    : 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:rgba(10,10,15,0.97);padding:20px 24px;gap:20px;border-bottom:1px solid rgba(108,99,255,0.15)';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.style.cssText = '';
}));

// ── Particle canvas ───────────────────────────────────────
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, dots;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function init() {
    const count = Math.floor(W * H / 12000);
    dots = Array.from({ length: count }, () => ({
      x:  rand(0, W), y:  rand(0, H),
      vx: rand(-0.18, 0.18), vy: rand(-0.18, 0.18),
      r:  rand(1, 2.2),
      a:  rand(0.1, 0.5),
    }));
  }
  init();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = W;
      if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H;
      if (d.y > H) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${d.a})`;
      ctx.fill();
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', init, { passive: true });
})();

// ── Typewriter ────────────────────────────────────────────
(function () {
  const words = [
    'scalable APIs.',
    'fast UIs.',
    'great products.',
    'clean code.',
    'developer tools.',
  ];
  const el = document.getElementById('typewriter');
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 50 : 90;

    if (!deleting && ci > word.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      wi = (wi + 1) % words.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
})();

// ── Intersection observer (reveal + skill bars) ───────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');

    el.querySelectorAll('.skill-card__bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });

    observer.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section, .skill-card, .project-card, .about__grid, .contact__grid')
  .forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

// ── Contact form ──────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.classList.add('visible');
  this.reset();
  setTimeout(() => success.classList.remove('visible'), 5000);
});
