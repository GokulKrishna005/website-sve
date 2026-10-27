"use strict";
// A single moving accent gives the opening a cursor response without a canvas.
(() => {
  const stage = document.querySelector('.intro-stage');
  if (!stage || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const accent = document.createElement('span');
  accent.className = 'paper-cursor';
  accent.setAttribute('aria-hidden', 'true');
  stage.append(accent);
  let x = 0, y = 0, frame = 0;
  stage.addEventListener('pointermove', event => {
    x = event.clientX; y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = stage.getBoundingClientRect();
      accent.style.transform = `translate3d(${x - bounds.left - 16}px, ${y - bounds.top - 16}px, 0)`;
      stage.classList.add('paper-active');
    });
  }, { passive: true });
  stage.addEventListener('pointerleave', () => stage.classList.remove('paper-active'));
})();
