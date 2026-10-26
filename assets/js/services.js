"use strict";
// Empty photo entries keep the designed placeholder visible; no broken image requests.
(() => {
  const photos = window.SVE_CONTENT?.servicePhotos || {};
  const slots = [...document.querySelectorAll('[data-service-photo]')];
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); } });
  }, { rootMargin: '500px 0px' }) : null;
  function load(slot) {
    const photo = photos[slot.dataset.servicePhoto];
    if (!photo || typeof photo.src !== 'string' || !photo.src.trim()) return;
    const image = new Image();
    image.alt = photo.alt || slot.closest('article').querySelector('h3').textContent;
    image.decoding = 'async';
    image.addEventListener('load', () => slot.replaceChildren(image), { once: true });
    // Keep the placeholder if an uploaded filename is incorrect or unavailable.
    image.addEventListener('error', () => {}, { once: true });
    image.src = photo.src;
  }
  slots.forEach(slot => observer ? observer.observe(slot) : load(slot));
})();
