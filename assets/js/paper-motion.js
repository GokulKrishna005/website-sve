"use strict";
// Full-screen paper facets inspired by PaperDrops. The backing bitmap is capped
// so large monitors do not multiply the amount of work per cursor movement.
(() => {
  const stage = document.querySelector('.intro-stage');
  if (!stage) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || reduced.matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'paper-folds';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0, nodes = [], triangles = [], trails = [];
  let frame = 0, visible = true, lastPaint = 0, lastSample = 0;
  const allowed = () => visible && !document.hidden && fine.matches && !reduced.matches;
  const noise = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  function clear() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; trails = [];
    ctx.clearRect(0, 0, width, height);
    stage.classList.remove('paper-active');
  }
  function resize() {
    if (stage.clientWidth === width && stage.clientHeight === height) return;
    clear();
    width = stage.clientWidth; height = stage.clientHeight;
    if (!width || !height) return;
    const resolution = Math.min(1, Math.sqrt(900000 / (width * height)));
    canvas.width = Math.round(width * resolution);
    canvas.height = Math.round(height * resolution);
    ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
    nodes = []; triangles = [];
    const spacing = Math.max(105, Math.sqrt(width * height / 240));
    const cols = Math.ceil(width / spacing) + 2, rows = Math.ceil(height / spacing) + 2;
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
  }
  function render(now) {
    frame = 0;
    if (!allowed()) { clear(); return; }
    if (now - lastPaint >= 32) {
      lastPaint = now;
      trails = trails.filter(point => now - point.time < 900);
      ctx.clearRect(0, 0, width, height);
      const raised = nodes.map(node => {
        let influence = 0;
        for (const point of trails) {
          const dx = node.x - point.x, dy = node.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 250) {
            const strength = Math.pow(1 - (now - point.time) / 900, 1.5);
            influence = Math.max(influence, Math.pow(1 - distance / 250, 2) * strength);
          }
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
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    const now = performance.now();
    if (now - lastSample > 42) { trails.push({ x, y, time: now }); lastSample = now; if (trails.length > 14) trails.shift(); }
    stage.classList.add('paper-active');
    if (!frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) clear(); }).observe(stage);
  new ResizeObserver(resize).observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  fine.addEventListener('change', clear);
  reduced.addEventListener('change', clear);
  resize();
})();
