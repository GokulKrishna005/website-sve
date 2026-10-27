"use strict";
// A single moving accent gives the opening a cursor response without a canvas.
(() => {
  const stage = document.querySelector('.intro-stage');
  if (!stage || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const accent = document.createElement('span');
  accent.className = 'paper-cursor';
  accent.setAttribute('aria-hidden', 'true');
  stage.append(accent);
  let x = 0, y = 0, frame = 0, lastX = 0, angle = 0;
  stage.addEventListener('pointermove', event => {
    x = event.clientX; y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = stage.getBoundingClientRect();
      angle = Math.max(-16, Math.min(16, (x - lastX) * .5));
      accent.style.transform = `translate3d(${x - bounds.left - 52}px, ${y - bounds.top - 52}px, 0) rotate(${angle}deg)`;
      lastX = x;
      stage.classList.add('paper-active');
    });
  }, { passive: true });
  stage.addEventListener('pointerleave', () => stage.classList.remove('paper-active'));
})();
