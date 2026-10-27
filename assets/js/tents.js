"use strict";
// Small, dependency-free 3D mesh viewer. Perspective projection and depth-sorted
// faces are rendered only when controls, size, or theme change (no idle loop).
(() => {
  const host = document.getElementById('tent-viewers');
  if (!host) return;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const models = [
    ['german', 'German Tents', 'An elongated gable roof with an open, spacious interior.'],
    ['pagoda', 'Pagoda Tents', 'A sculpted, high-peaked canopy on a compact square footprint.']
  ];
  for (const [type, title, description] of models.filter(model => model[0] === host.dataset.tentType)) {
    const card = document.createElement('article');
    card.className = 'tent-card'; card.id = `tent-${type}`;
    card.innerHTML = `<div class="tent-head"><p class="eyebrow">360° / CONCEPT PREVIEW</p><h3>${title}</h3><p>${description}</p></div>
      <canvas class="tent-canvas" tabindex="0" role="img" aria-label="Interactive 3D ${title}" aria-describedby="help-${type}">Illustrative ${title} model. Use the controls below to change the view.</canvas>
      <div class="tent-controls"><button type="button" data-action="left" aria-label="Rotate ${title} left">↶</button><button type="button" data-action="right" aria-label="Rotate ${title} right">↷</button><button type="button" data-action="in" aria-label="Zoom in ${title}">+</button><button type="button" data-action="out" aria-label="Zoom out ${title}">−</button><button type="button" data-action="reset">Reset view</button>
      <button type="button" data-action="walls" aria-pressed="false">Side walls</button><button type="button" data-action="pan" aria-pressed="false">Move mode</button>
      <label>Roof colour <select aria-label="${title} roof colour"><option value="white">Ivory</option><option value="blue">SVE blue</option><option value="sand">Sand</option></select></label>
      <p class="tent-help" id="help-${type}">Drag to rotate · Pinch to zoom · Move mode to reposition.<br>Keyboard: arrow keys rotate, +/− zoom, Home resets. Shift + arrows move.</p>
      <a class="tent-enquire" href="../index.html?service=${encodeURIComponent(title)}#enquiry">Enquire about ${title} ↗</a></div>`;
    host.append(card);
    const canvas = card.querySelector('canvas'), ctx = canvas.getContext('2d');
    if (!ctx) { canvas.replaceWith(document.createTextNode('3D preview unavailable in this browser. Please contact us for tent details.')); continue; }
    let yaw = -.6, tilt = .36, zoom = 1, panX = 0, panY = 0, walls = false, move = false, colour = 'white', pending = false, visible = false;
    const points = new Map();
    const reset = () => { yaw = -.6; tilt = .36; zoom = 1; panX = panY = 0; };
    function render() {
      pending = false;
      if (!visible) return;
      const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 1.5);
      if (!w || !h) return;
      const pixelWidth = Math.round(w * dpr), pixelHeight = Math.round(h * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) { canvas.width = pixelWidth; canvas.height = pixelHeight; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.dataset.theme === 'dark';
      const roof = {white:[234,240,246],blue:[48,113,193],sand:[213,185,139]}[colour];
      const faces = [], depth = type === 'german' ? 3.4 : 2.2, width = 2.2, eave = 2.5;
      const face = (v, rgb, line = true) => faces.push({v,rgb,line});
      const box = (x,y,z,sx,sy,sz,rgb) => {
        const v = [[x,y,z],[x+sx,y,z],[x+sx,y+sy,z],[x,y+sy,z],[x,y,z+sz],[x+sx,y,z+sz],[x+sx,y+sy,z+sz],[x,y+sy,z+sz]];
        for(const ids of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]]) face(ids.map(i=>v[i]),rgb);
      };
      // Raised presentation plinth and separate steel columns.
      box(-width-.35,-.12,-depth-.35,width*2+.7,.12,depth*2+.7,dark?[47,64,85]:[180,197,215]);
      for(const x of [-width,width]) for(const z of (type==='german'?[-depth,0,depth]:[-depth,depth])) box(x-.045,0,z-.045,.09,eave,.09,[157,175,192]);
      if(walls) {
        for(const x of [-width,width]) face([[x,0,-depth],[x,eave,-depth],[x,eave,depth],[x,0,depth]],[208,218,230]);
        face([[-width,0,depth],[-width,eave,depth],[width,eave,depth],[width,0,depth]],[214,225,235]);
      }
      if(type==='german') {
        for(const side of [-1,1]) for(let z=-depth;z<depth-.01;z+=depth/3) {
          face([[0,3.85,z],[side*(width+.16),eave,z],[side*(width+.16),eave,z+depth/3],[0,3.85,z+depth/3]],roof);
        }
        for(const z of [-depth,depth]) face([[-width-.16,eave,z],[0,3.85,z],[width+.16,eave,z]],roof);
      } else {
        // Curved pagoda roof: rings rise nonlinearly towards a tall central peak.
        const ring = t => {const r=(width+.18)*(1-t),y=eave+2.25*t*t;return [[-r,y,-r],[r,y,-r],[r,y,r],[-r,y,r]];};
        for(let j=0;j<12;j++){const a=ring(j/12),b=ring((j+1)/12);for(let i=0;i<4;i++)face([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],roof,false);}
      }
      const transform = ([x,y,z]) => { const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw),yy=y-1.9;return [xx,yy*Math.cos(tilt)-zz*Math.sin(tilt),yy*Math.sin(tilt)+zz*Math.cos(tilt)]; };
      const project = ([x,y,z]) => {const s=Math.min(w/10,h/7)*zoom*16/(16-z);return [w/2+x*s+panX*w,h*.51-y*s+panY*h];};
      faces.map(f=>({...f,v:f.v.map(transform)})).sort((a,b)=>a.v.reduce((s,p)=>s+p[2],0)/a.v.length-b.v.reduce((s,p)=>s+p[2],0)/b.v.length).forEach(f=>{
        const [a,b,c]=f.v, u=b.map((n,i)=>n-a[i]),v=c.map((n,i)=>n-a[i]);
        const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]], len=Math.hypot(...n)||1;
        const shade=.72+.28*Math.abs((n[0]*-.3+n[1]*.8+n[2]*.5)/len);
        ctx.beginPath(); f.v.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
        ctx.fillStyle=`rgb(${f.rgb.map(c=>Math.round(c*shade)).join(',')})`;ctx.fill();
        ctx.strokeStyle=f.line?'rgba(65,89,117,.22)':ctx.fillStyle;ctx.lineWidth=.6;ctx.stroke();
      });
    }
    function draw(){tilt=clamp(tilt,-.12,1.1);zoom=clamp(zoom,.65,1.75);panX=clamp(panX,-.25,.25);panY=clamp(panY,-.25,.25);if(visible&&!pending){pending=true;requestAnimationFrame(render);}}
    card.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
      const a=button.dataset.action;
      if(a==='left')yaw-=.25;if(a==='right')yaw+=.25;if(a==='in')zoom*=1.15;if(a==='out')zoom/=1.15;if(a==='reset')reset();
      if(a==='walls'){walls=!walls;button.setAttribute('aria-pressed',walls);}
      if(a==='pan'){move=!move;button.setAttribute('aria-pressed',move);}
      draw();
    }));
    card.querySelector('select').addEventListener('change',e=>{colour=e.target.value;draw();});
    canvas.addEventListener('pointerdown',e=>{points.set(e.pointerId,[e.clientX,e.clientY]);canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});
    canvas.addEventListener('pointermove',e=>{
      if(!points.has(e.pointerId))return;
      const old=points.get(e.pointerId),all=[...points.values()],distance=all.length===2?Math.hypot(all[0][0]-all[1][0],all[0][1]-all[1][1]):0;
      points.set(e.pointerId,[e.clientX,e.clientY]);
      if(points.size===2){const p=[...points.values()];if(distance>1)zoom*=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1])/distance;}
      else if(move||e.shiftKey){panX+=(e.clientX-old[0])/canvas.clientWidth;panY+=(e.clientY-old[1])/canvas.clientHeight;}
      else{yaw+=(e.clientX-old[0])*.009;tilt+=(e.clientY-old[1])*.007;}draw();
    });
    for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>points.delete(e.pointerId));
    canvas.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key))return;e.preventDefault();
      const dx=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0,dy=e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0;
      if(e.shiftKey){panX+=dx*.04;panY+=dy*.04;}else{yaw+=dx*.15;tilt+=dy*.1;}
      if(e.key==='+'||e.key==='=')zoom*=1.15;if(e.key==='-')zoom/=1.15;if(e.key==='Home')reset();draw();
    });
    new ResizeObserver(draw).observe(canvas);
    new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) draw(); }, { rootMargin: '200px 0px' }).observe(canvas);
  }
})();
