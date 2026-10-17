"use strict";
// Empty photo entries keep the designed placeholder visible; no broken image requests.
(() => {
  const photos = window.SVE_CONTENT?.servicePhotos || {};
  document.querySelectorAll('[data-service-photo]').forEach(slot => {
    const photo = photos[slot.dataset.servicePhoto];
    if (!photo || typeof photo.src !== 'string' || !photo.src.trim()) return;
    const image = new Image();
    image.alt = photo.alt || slot.closest('article').querySelector('h3').textContent;
    image.decoding = 'async';
    image.addEventListener('load', () => slot.replaceChildren(image), { once: true });
    // Keep the placeholder if an uploaded filename is incorrect or unavailable.
    image.addEventListener('error', () => {}, { once: true });
    image.src = photo.src;
  });
})();
