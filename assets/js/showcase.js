(() => {
  const stage=document.querySelector('.intro-stage');
  if(!stage)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const photos=[
    ['German tent','https://image.made-in-china.com/202f0j00JSwlMmoBNLRd/China-Made-Transparent-Tent-with-White-PVC-Roof-and-Walls.webp','assets/images/work/german-tent-open-front-01.jpeg'],
    ['Pagoda tents','https://image.made-in-china.com/202f0j00huqflNToZZcC/5X5m-Pagoda-Marquee-Tents-for-Events-and-Advertising.webp','assets/images/work/pagoda-tent-pair-open-front-01.jpeg'],
    ['Transparent German tent','https://img.waimaoniu.net/1259/1259-202107081629515572.jpg','assets/images/work/clear-canopy-wedding-entrance-01.jpeg'],
    ['Banquet setting','https://image.made-in-china.com/202f0j00eAJWMshriHod/Aluminum-Wedding-Party-Tent-Marquee-Wedding-Chair-for-Party-Event-Tent.webp','assets/images/work/event-seating-banquet-blue-01.jpeg'],
    ['Evening celebration','https://www.cghearth.com/weddedonearth/images/brunton1.jpg','assets/images/work/event-stage-colour-lights-01.jpeg']
  ];
  const bar=document.createElement('div');bar.className='sticky-titlebar';
  const top=document.querySelector('.site-content>.topbar'),header=document.querySelector('.site-content>.header');
  top.before(bar);bar.append(top,header);
  new ResizeObserver(()=>document.documentElement.style.setProperty('--bar-height',bar.offsetHeight+'px')).observe(bar);
  const section=document.createElement('section');section.className='showcase wrap';section.setAttribute('aria-label','Event inspiration carousel');
  section.innerHTML='<p class="eyebrow">SPACES TO IMAGINE</p><h2>A setting for your occasion.</h2><p>Event inspiration from around the web.</p><div class="showcase-ring"></div><div class="showcase-controls"><button type="button" aria-label="Previous photograph">←</button><span class="showcase-caption" aria-live="polite"></span><button type="button" aria-label="Next photograph">→</button><button type="button" class="showcase-pause">Pause slideshow</button></div>';
  document.getElementById('services').before(section);
  const ring=section.querySelector('.showcase-ring');
  const makeImage=([label,src,fallback])=>{const img=new Image();img.alt=label;img.decoding='async';img.loading='lazy';img.src=src;img.onerror=()=>{img.onerror=null;img.src=fallback;};return img;};
  const cards=photos.map(photo=>{const card=document.createElement('div');card.className='showcase-photo';card.append(makeImage(photo));ring.append(card);return card;});
  let index=0,paused=reduced.matches,visible=false;
  function render(){cards.forEach((card,i)=>{const d=(i-index+5)%5;card.dataset.position=d===0?'front':d===1?'next':d===4?'previous':'hidden';card.setAttribute('aria-hidden',String(d!==0));});section.querySelector('.showcase-caption').textContent=photos[index][0];}
  const buttons=section.querySelectorAll('button');buttons[0].onclick=()=>{index=(index+4)%5;render();};buttons[1].onclick=()=>{index=(index+1)%5;render();};
  function pauseLabel(){buttons[2].textContent=paused?'Play slideshow':'Pause slideshow';buttons[2].setAttribute('aria-pressed',String(paused));}buttons[2].onclick=()=>{paused=!paused;pauseLabel();};pauseLabel();render();
  new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(section);
  setInterval(()=>{if(visible&&!paused&&!document.hidden&&!section.matches(':hover')&&!section.contains(document.activeElement)){index=(index+1)%5;render();}},3500);
  const background=document.createElement('div');background.className='intro-photos';background.setAttribute('aria-hidden','true');stage.prepend(background);
  let introVisible=false,backgroundIndex=0;
  new IntersectionObserver(e=>introVisible=e[0].isIntersecting).observe(stage);
  const backgroundImages=photos.map(photo=>{const img=makeImage(photo);img.loading='lazy';background.append(img);return img;});
  setTimeout(()=>{background.classList.add('ready');backgroundImages[0].classList.add('active');},4200);
  setInterval(()=>{if(!introVisible||document.hidden||reduced.matches)return;backgroundImages[backgroundIndex].classList.remove('active');backgroundIndex=(backgroundIndex+1)%5;backgroundImages[backgroundIndex].classList.add('active');},6000);
})();
