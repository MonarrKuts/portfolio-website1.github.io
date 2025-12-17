// Minimal JS for mobile nav toggle and accessible lightbox
document.addEventListener('DOMContentLoaded', function () {
  // Header year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  navToggle && navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if (primaryNav) {
      primaryNav.style.display = expanded ? '' : 'block';
      // simple inline show/hide for small screens
    }
  });

  // Reveal-on-nav helper (used below)
  function revealElementsInSection(section) {
    if (!section) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const selector = 'h1,h2,h3,p,img,figure,.service,.about-media,.hero-title,.hero-lead,.btn';
    const elems = Array.from(section.querySelectorAll(selector));
    if (prefersReduced) {
      elems.forEach(el => {
        el.classList.remove('reveal');
        el.classList.add('reveal--active');
        el.style.transitionDelay = '';
      });
      return;
    }

    elems.forEach((el, i) => {
      if (el.classList.contains('reveal--active')) return;
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 90}ms`;
      // Staggered activation — small offset so the browser applies the transition
      setTimeout(() => {
        el.classList.add('reveal--active');
        el.style.transitionDelay = '';
      }, i * 70 + 30);
    });
  }

  // Smooth scroll + reveal when clicking primary nav links
  document.querySelectorAll('.primary-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });

      // Reveal section contents after a short delay to match the smooth scroll
      // (Works well for most browsers; IntersectionObserver will still catch anything missed)
      setTimeout(() => revealElementsInSection(target), prefersReduced ? 0 : 250);
      // update URL hash without jumping
      history.pushState(null, '', `#${id}`);
    });
  });

  // When hash changes (e.g., back/forward navigation), reveal the target section
  window.addEventListener('hashchange', () => {
    const id = location.hash.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      // small timeout to let the browser finish its scroll
      setTimeout(() => revealElementsInSection(target), 120);
    }
  });

  // Lightbox
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  let items = [];
  let currentIndex = -1;

  if (gallery) {
    items = Array.from(gallery.querySelectorAll('.gallery-item'));
    items.forEach((el, i) => {
      const open = (evt) => {
        // Accept click or Enter/Space keyboard
        if (evt.type === 'keydown' && !(evt.key === 'Enter' || evt.key === ' ')) return;
        evt.preventDefault();
        showItem(i);
      };
      el.addEventListener('click', open);
      el.addEventListener('keydown', open);
    });
  }

  function showItem(index) {
    const item = items[index];
    if (!item) return;
    currentIndex = index;
    const src = item.dataset.large || item.querySelector('img').src;
    const alt = item.querySelector('img').alt || '';
    const title = item.querySelector('.caption-title')?.textContent || '';
    const meta = item.querySelector('.caption-meta')?.textContent || '';
    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = title + (meta ? ' — ' + meta : '');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // move focus to close button for accessibility
    setTimeout(() => lbClose.focus(), 60);
  }

  function hideLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // return focus to current gallery item
    if (items[currentIndex]) items[currentIndex].focus();
    currentIndex = -1;
  }

  function showNext(dir = 1) {
    if (items.length === 0) return;
    currentIndex = (currentIndex + dir + items.length) % items.length;
    showItem(currentIndex);
  }

  lbClose && lbClose.addEventListener('click', hideLightbox);
  lbPrev && lbPrev.addEventListener('click', () => showNext(-1));
  lbNext && lbNext.addEventListener('click', () => showNext(1));

  // Close on backdrop click
  lightbox && lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) hideLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });
});

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // If user prefers reduced motion, reveal everything immediately
    document.querySelectorAll('section').forEach(s => s.querySelectorAll('h1,h2,h3,p,img,figure,.service,.about-media,.hero-title,.hero-lead,.btn').forEach(el => {
      el.classList.remove('reveal');
      el.classList.add('reveal--active');
      el.style.transitionDelay = '';
    }));
    return;
  }

  // Elements to animate inside each section (scoped to avoid header/nav)
  const elementSelector = 'portfolio, about, contact, h1,h2,h3,p,img,figure,.service,.about-media,.about-content,.about-content p,.hero-title,.hero-lead,.btn';

  // Add .reveal and staggered delay per-section
  document.querySelectorAll('section').forEach(section => {
    const items = Array.from(section.querySelectorAll(elementSelector));
    items.forEach((el, i) => {
      // don't re-add to things already handled
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal--active')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 250}ms`;
      }
    });
  });

  // IntersectionObserver to toggle active class when visible
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--active');
        // cleanup delay so it doesn't persist if styles change later
        entry.target.style.transitionDelay = '';
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.06
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

})();

const navToggle = document.querySelector('#navToggle');
const primaryNav = document.querySelector('#primaryNav');

navToggle.addEventListener('click', () => {
    const isOpened = navToggle.getAttribute('aria-expanded') === 'true';

    if (isOpened) {
        // Close the menu
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-active');
    } else {
        // Open the menu
        navToggle.setAttribute('aria-expanded', 'true');
        primaryNav.classList.add('is-active');
    }
});
