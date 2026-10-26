"use strict";
// Original cursor-driven paper facets inspired by the PaperDrops interaction.
// The canvas is decorative; the real logo/link remains accessible in the DOM.
(() => {
  const stage = document.querySelector('.intro-stage');
  if (!stage) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'paper-folds'; canvas.setAttribute('aria-hidden', 'true');
  const cursor = document.createElement('span'); cursor.className = 'paper-cursor'; cursor.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas); stage.append(cursor);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let width = 0, height = 0, nodes = [], triangles = [], trails = [], frame = 0, visible = true, dark = false, last = null, lastPaint = 0;
  const allowed = () => visible && !document.hidden && !reduced.matches && fine.matches;
  function clear() {
    cancelAnimationFrame(frame); frame = 0; trails = []; last = null;
    ctx.clearRect(0, 0, width, height); stage.classList.remove('paper-active');
    stage.style.removeProperty('--paper-rx'); stage.style.removeProperty('--paper-ry');
  }
  function resize() {
    clear(); width = stage.clientWidth; height = stage.clientHeight;
    if(!fine.matches || reduced.matches){canvas.width=canvas.height=1;nodes=[];triangles=[];return;}
    const dpr = 1;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = []; triangles = [];
    const size = 110, cols = Math.ceil(width / size) + 2, rows = Math.ceil(height / size) + 2;
    // Stable irregular triangles give the surface its folded-paper character.
    const noise = n => {const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
    for (let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
      const i=y*cols+x; nodes.push({x:(x-.5)*size+(noise(i+4)-.5)*size*.65,y:(y-.5)*size+(noise(i+9)-.5)*size*.65,z:(noise(i+17)-.5)*30});
    }
    for(let y=0;y<rows-1;y++) for(let x=0;x<cols-1;x++) {const i=y*cols+x;triangles.push([i,i+1,i+cols],[i+1,i+cols+1,i+cols]);}
  }
  function render(now) {
    frame = 0;
    if (!allowed()) {clear();return;}
    if(now-lastPaint<32){frame=requestAnimationFrame(render);return;}
    lastPaint=now;
    trails = trails.filter(p => now-p.time < 1200);
    ctx.clearRect(0,0,width,height);
    const raised = nodes.map(n => {
      let influence=0;
      for(const p of trails){const distance=Math.hypot(n.x-p.x,n.y-p.y);if(distance<250){const falloff=1-distance/250;influence=Math.max(influence,falloff*falloff*Math.pow(1-(now-p.time)/1200,1.5));}}
      return {...n,h:n.z*influence,influence};
    });
    for(const ids of triangles) {
      const [a,b,c] = ids.map(i=>raised[i]);
      const strength=Math.max(a.influence,b.influence,c.influence); if(strength<.002)continue;
      const dx=b.x-a.x,dy=b.y-a.y,ex=c.x-a.x,ey=c.y-a.y,area=dx*ey-dy*ex;
      if(Math.abs(area)<1)continue;
      const sx=((b.h-a.h)*ey-(c.h-a.h)*dy)/area,sy=(dx*(c.h-a.h)-ex*(b.h-a.h))/area;
      const light=sx*.7-sy*.85,alpha=Math.min(dark?.26:.19,Math.abs(light)*1.4);
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();
      ctx.fillStyle=light>0?`rgba(${dark?'143,191,255':'255,255,255'},${alpha})`:`rgba(${dark?'1,9,25':'44,84,150'},${alpha})`;
      ctx.fill();
    }
    if(trails.length)frame=requestAnimationFrame(render);else stage.classList.remove('paper-active');
  }
  stage.addEventListener('pointermove', e => {
    if (!allowed() || e.pointerType==='touch')return;
    const r=stage.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,now=performance.now();
    cursor.style.transform=`translate(${x-16}px,${y-16}px)`;stage.classList.add('paper-active');
    stage.style.setProperty('--paper-rx',`${((.5-y/height)*2.2).toFixed(2)}deg`);
    stage.style.setProperty('--paper-ry',`${((x/width-.5)*2.8).toFixed(2)}deg`);
    if(!last||now-last.time>30){trails.push({x,y,time:now});last={time:now};if(trails.length>28)trails.shift();}
    if(!frame)frame=requestAnimationFrame(render);
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{stage.classList.remove('paper-active');stage.style.removeProperty('--paper-rx');stage.style.removeProperty('--paper-ry');});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)clear();}).observe(stage);
  new ResizeObserver(resize).observe(stage);
  function theme(){dark=document.documentElement.dataset.theme==='dark';if(allowed()&&trails.length&&!frame)frame=requestAnimationFrame(render);}
  new MutationObserver(theme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  reduced.addEventListener('change',clear);fine.addEventListener('change',clear);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
  theme();resize();
})();
