/* ============================================
   ALEX RIVERA — PORTFOLIO
   main.js
   ============================================ */

'use strict';

/* ---- CURSOR GLOW ---- */
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });


/* ---- NAVBAR SCROLL STATE ---- */
const navbar = document.getElementById('navbar');

const handleNavScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();


/* ---- MOBILE NAV TOGGLE ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---- ACTIVE NAV LINK (scroll-position based) ---- */
// Watches each section and marks the matching nav link as active
const sections    = document.querySelectorAll('main section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

const activateNavLink = () => {
  // Find the section whose top edge is closest to (but still above) 40% of the viewport
  const trigger = window.innerHeight * 0.4;
  let current   = '';

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= trigger) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach((link) => {
    link.classList.toggle(
      'nav-active',
      link.getAttribute('href') === `#${current}`
    );
  });
};

window.addEventListener('scroll', activateNavLink, { passive: true });
activateNavLink(); // run once on load


/* ---- .reveal SCROLL OBSERVER (existing system, unchanged) ---- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));


/* ---- .animate-on-scroll OBSERVER (new explicit system) ---- */
// Targets any element with class="animate-on-scroll"
// Adds "animated" when it enters the viewport — CSS handles the transition
const animateElements = document.querySelectorAll('.animate-on-scroll');

const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animateObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

animateElements.forEach((el) => animateObserver.observe(el));


/* ---- STAGGERED GRID CHILDREN ---- */
// For any .stagger-grid, assign a CSS --delay variable to each direct child
// so cards animate in one after another without hardcoding delay classes in HTML
document.querySelectorAll('.stagger-grid').forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.setProperty('--delay', `${i * 80}ms`);
    // Also make each child an animate-on-scroll target automatically
    child.classList.add('animate-on-scroll');
    animateObserver.observe(child);
  });
});
