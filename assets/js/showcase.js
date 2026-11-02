(() => {
  const stage=document.querySelector('.intro-stage');
  if(!stage)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  // Replace each null with [caption, local image path, fallback path] when supplied.
  const photos=[["Illuminated transparent tent", "assets/images/work/carousel-project-1.jpeg", "assets/images/event-illustration.svg"], ["Evening canopy seating", "assets/images/work/carousel-project-2.jpeg", "assets/images/event-illustration.svg"], ["Decorated transparent entrance", "assets/images/work/carousel-project-3.jpeg", "assets/images/event-illustration.svg"], ["Celebration inside a transparent tent", "assets/images/work/carousel-project-4.jpeg", "assets/images/event-illustration.svg"], ["German tent at dusk", "assets/images/work/carousel-project-5.jpeg", "assets/images/event-illustration.svg"], ["Draped tent interior", "assets/images/work/carousel-project-6.jpeg", "assets/images/event-illustration.svg"], ["Pagoda tent on a lawn", "assets/images/work/carousel-project-7.jpeg", "assets/images/event-illustration.svg"], ["Exhibition stall layout", "assets/images/work/carousel-project-8.jpeg", "assets/images/event-illustration.svg"], ["Jewellery exhibition display", "assets/images/work/carousel-project-9.jpeg", "assets/images/event-illustration.svg"], ["Banquet seating arrangement", "assets/images/work/carousel-project-10.jpeg", "assets/images/event-illustration.svg"]];
  const bar=document.createElement('div');bar.className='sticky-titlebar';
  const top=document.querySelector('.site-content>.topbar'),header=document.querySelector('.site-content>.header');
  top.before(bar);bar.append(top,header);
  new ResizeObserver(()=>document.documentElement.style.setProperty('--bar-height',bar.offsetHeight+'px')).observe(bar);
  const section=document.createElement('section');section.className='showcase wrap';section.setAttribute('aria-label','Company photo carousel');
  section.innerHTML='<p class="eyebrow">SPACES TO IMAGINE</p><h2>A setting for your occasion.</h2><p>A selection of our company event setups.</p><div class="showcase-ring"></div><div class="showcase-controls"><button type="button" aria-label="Previous photograph">←</button><span class="showcase-caption" aria-live="polite"></span><button type="button" aria-label="Next photograph">→</button><button type="button" class="showcase-pause">Pause slideshow</button></div>';
  document.getElementById('services').before(section);
  const ring=section.querySelector('.showcase-ring');
  const makeImage=([label,src,fallback])=>{const img=new Image();img.alt=label;img.decoding='async';img.loading='lazy';img.src=src;img.onerror=()=>{img.onerror=null;img.src=fallback;};return img;};
  const cards=photos.map((photo,i)=>{const card=document.createElement('div');card.className='showcase-photo';if(photo){card.append(makeImage(photo));}else{const empty=document.createElement('div');empty.className='showcase-placeholder';empty.textContent='Photo '+String(i+1).padStart(2,'0')+' / 10 · Coming soon';card.append(empty);}ring.append(card);return card;});
  let index=0,paused=reduced.matches||photos.every(photo=>!photo),visible=false;
  function render(){cards.forEach((card,i)=>{const d=(i-index+photos.length)%photos.length;card.dataset.position=d===0?'front':d===1?'next':d===photos.length-1?'previous':'hidden';card.setAttribute('aria-hidden',String(d!==0));});section.querySelector('.showcase-caption').textContent=photos[index]?.[0] || 'Photo '+(index+1)+' of '+photos.length;}
  const buttons=section.querySelectorAll('button');buttons[0].onclick=()=>{index=(index+photos.length-1)%photos.length;render();};buttons[1].onclick=()=>{index=(index+1)%photos.length;render();};
  function pauseLabel(){buttons[2].textContent=paused?'Play slideshow':'Pause slideshow';buttons[2].setAttribute('aria-pressed',String(paused));}buttons[2].onclick=()=>{paused=!paused;pauseLabel();};pauseLabel();render();
  new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(section);
  setInterval(()=>{if(visible&&!paused&&!document.hidden&&!section.matches(':hover')&&!section.contains(document.activeElement)){index=(index+1)%photos.length;render();}},3500);
})();
