(() => {
 const stage=document.querySelector('.intro-stage');if(!stage)return;
 const host=document.createElement('div');host.className='opening-panels';
 stage.querySelector('.entry-cue').before(host);
 const groups=[['Our tent & pagoda setups',[3,4,5,6],['Decorated transparent tent interior','Outdoor pagoda tent row','Draped event tent interior','Illuminated German tent exterior']],['Awards & team',[1,2],['Award presentation at an event','Team group photograph']]];
 let visible=false;new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(stage);
 groups.forEach(([title,ids,alts])=>{
  const panel=document.createElement('figure');panel.className='opening-panel';panel.setAttribute('aria-label',title);host.append(panel);
  const images=ids.map((id,i)=>{const img=new Image();img.src=`assets/images/opening/company-${id}.jpg`;img.alt=alts[i];img.decoding='async';img.className=i===0?'active':'';img.setAttribute('aria-hidden',String(i!==0));panel.append(img);return img;});
  const caption=document.createElement('figcaption');caption.textContent=title;panel.append(caption);
  let index=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const button=document.createElement('button');button.type='button';button.className='opening-pause';panel.append(button);
  const label=()=>{button.textContent=paused?'Play':'Pause';button.setAttribute('aria-label',`${paused?'Play':'Pause'} ${title} slideshow`);};label();button.onclick=()=>{paused=!paused;label();};
  setInterval(()=>{if(paused||!visible||document.hidden)return;images[index].classList.remove('active');images[index].setAttribute('aria-hidden','true');index=(index+1)%images.length;images[index].classList.add('active');images[index].setAttribute('aria-hidden','false');},2000);
 });
})();
