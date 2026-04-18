/* ============================================
   KONTEK SOLUTIONS — script.js
   Interactions: Navbar, Scroll Reveal, Mobile Menu
   ============================================ */

'use strict';

/* ─── 1. STICKY NAVBAR ──────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class for glass effect
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
})();


/* ─── 2. MOBILE HAMBURGER MENU ──────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Toggle menu open/close
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when any nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ─── 3. SMOOTH SCROLLING (fallback for older browsers) ─────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarH = document.getElementById('navbar')
        ? document.getElementById('navbar').offsetHeight
        : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarH;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();


/* ─── 4. SCROLL REVEAL ANIMATIONS ──────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Use IntersectionObserver for performance
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ─── 5. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL ─────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    const scrollPos = window.scrollY + window.innerHeight * 0.3;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ─── 6. GALLERY — SUBTLE CURSOR ZOOM HINT ──────────────────────────── */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Touch devices: show captions on tap
  items.forEach(function (item) {
    item.addEventListener('touchstart', function () {
      items.forEach(function (i) { if (i !== item) i.classList.remove('touch-active'); });
      item.classList.toggle('touch-active');
    }, { passive: true });
  });
})();


/* ─── 7. PROCESS STEPS — STAGGERED REVEAL ───────────────────────────── */
(function initProcessStagger() {
  const steps = document.querySelectorAll('.process-step');
  steps.forEach(function (step, i) {
    step.style.setProperty('--delay', (i * 0.15) + 's');
  });
})();


/* ─── 8. WHY CARDS — STAGGERED REVEAL ───────────────────────────────── */
(function initWhyStagger() {
  const cards = document.querySelectorAll('.why-card');
  cards.forEach(function (card, i) {
    card.style.setProperty('--delay', (i * 0.12) + 's');
  });
})();


/* ─── 9. MACHINE CARDS — STAGGERED REVEAL ───────────────────────────── */
(function initMachineStagger() {
  const cards = document.querySelectorAll('.machine-card');
  cards.forEach(function (card, i) {
    card.style.setProperty('--delay', (i * 0.15) + 's');
  });
})();


/* ─── 10. HERO SECTION — PARALLAX ON SCROLL ─────────────────────────── */
(function initHeroParallax() {
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (!heroBgImg) return;

  // Only run on desktop (avoid jank on mobile)
  const mq = window.matchMedia('(min-width: 769px)');

  function onScroll() {
    if (!mq.matches) return;
    const scrollY = window.scrollY;
    const heroH   = document.querySelector('.hero').offsetHeight;
    if (scrollY > heroH) return;

    const offset = scrollY * 0.35;
    heroBgImg.style.transform = 'scale(1.1) translateY(' + offset + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─── 11. COUNTER ANIMATION (Stats in About section) ────────────────── */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  function animateCounter(el) {
    // Read the number from element text (strips the suffix span)
    const raw    = el.childNodes[0].textContent.trim();
    const target = parseInt(raw, 10);
    if (isNaN(target)) return;

    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);

      el.childNodes[0].textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.childNodes[0].textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ─── 12. WHATSAPP FLOAT — SHOW AFTER 3 SECONDS ─────────────────────── */
(function initWhatsappFloat() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;

  btn.style.opacity = '0';
  btn.style.transform = 'scale(0.5)';
  btn.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)';

  setTimeout(function () {
    btn.style.opacity = '1';
    btn.style.transform = 'scale(1)';
  }, 3000);
})();


/* ─── INIT COMPLETE ─────────────────────────────────────────────────── */
console.log('%cKONTEK SOLUTIONS', 'color:#f5c400;font-family:monospace;font-size:18px;font-weight:bold;');
console.log('%cPrecision. Strength. Reliability.', 'color:#888;font-family:monospace;font-size:12px;');
