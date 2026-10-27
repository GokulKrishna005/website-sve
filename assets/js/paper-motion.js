"use strict";
// Local faceted-paper response inspired by PaperDrops. Only a 360px canvas
// near the pointer is painted; the logo and its link stay in the DOM.
(() => {
  const stage = document.querySelector('.intro-stage');
  if (!stage) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || reduced.matches) return;

  const size = 360;
  const canvas = document.createElement('canvas');
  canvas.className = 'paper-folds';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = canvas.height = size;
  stage.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const spacing = 72, cols = 7, rows = 7, nodes = [], triangles = [];
  const noise = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const i = row * cols + col;
    nodes.push({ x: (col - .5) * spacing + (noise(i + 4) - .5) * spacing * .55,
      y: (row - .5) * spacing + (noise(i + 9) - .5) * spacing * .55,
      z: (noise(i + 17) - .5) * 52 });
  }
  for (let row = 0; row < rows - 1; row++) for (let col = 0; col < cols - 1; col++) {
    const i = row * cols + col;
    triangles.push([i, i + 1, i + cols], [i + 1, i + cols + 1, i + cols]);
  }

  let x = -500, y = -500, visible = true, trails = [], frame = 0, lastPaint = 0, lastSample = 0;
  const allowed = () => visible && !document.hidden && fine.matches && !reduced.matches;
  function clear() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; trails = [];
    ctx.clearRect(0, 0, size, size);
    stage.classList.remove('paper-active');
  }
  function render(now) {
    frame = 0;
    if (!allowed()) { clear(); return; }
    canvas.style.transform = `translate3d(${Math.round(x - size / 2)}px,${Math.round(y - size / 2)}px,0)`;
    if (now - lastPaint >= 32) {
      lastPaint = now;
      trails = trails.filter(point => now - point.time < 850);
      ctx.clearRect(0, 0, size, size);
      const local = trails.map(point => ({ x: point.x - x + size / 2, y: point.y - y + size / 2,
        strength: Math.pow(1 - (now - point.time) / 850, 1.5) }));
      const raised = nodes.map(node => {
        let influence = 0;
        for (const point of local) {
          const dx = node.x - point.x, dy = node.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 165) influence = Math.max(influence, Math.pow(1 - distance / 165, 2) * point.strength);
        }
        return { ...node, h: node.z * influence, influence };
      });
      const dark = document.documentElement.dataset.theme === 'dark';
      for (const ids of triangles) {
        const [a, b, c] = ids.map(i => raised[i]);
        const strength = Math.max(a.influence, b.influence, c.influence);
        if (strength < .015) continue;
        const dx = b.x - a.x, dy = b.y - a.y, ex = c.x - a.x, ey = c.y - a.y;
        const area = dx * ey - dy * ex;
        if (Math.abs(area) < 1) continue;
        const sx = ((b.h - a.h) * ey - (c.h - a.h) * dy) / area;
        const sy = (dx * (c.h - a.h) - ex * (b.h - a.h)) / area;
        const light = sx * .7 - sy * .85;
        const alpha = Math.min(dark ? .46 : .38, (.09 + Math.abs(light) * 1.2) * Math.sqrt(strength));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
        ctx.fillStyle = light > 0 ? `rgba(${dark ? '143,191,255' : '255,255,255'},${alpha})`
          : `rgba(${dark ? '1,9,25' : '44,84,150'},${alpha})`;
        ctx.fill();
        if (strength > .08) { ctx.strokeStyle = dark ? 'rgba(132,183,245,.10)' : 'rgba(42,91,163,.10)'; ctx.lineWidth = .7; ctx.stroke(); }
      }
      if (!trails.length) { stage.classList.remove('paper-active'); return; }
    }
    frame = requestAnimationFrame(render);
  }
  stage.addEventListener('pointermove', event => {
    if (!allowed() || event.pointerType === 'touch') return;
    const bounds = stage.getBoundingClientRect();
    x = event.clientX - bounds.left; y = event.clientY - bounds.top;
    const now = performance.now();
    if (now - lastSample > 42) { trails.push({ x, y, time: now }); lastSample = now; if (trails.length > 14) trails.shift(); }
    stage.classList.add('paper-active');
    if (!frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) clear(); }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  fine.addEventListener('change', clear);
  reduced.addEventListener('change', clear);
})();
