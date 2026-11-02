(() => {
 const stage=document.querySelector('.intro-stage');if(!stage)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const host=document.createElement('div');host.className='opening-panels';stage.querySelector('.entry-cue').before(host);
 const panel=document.createElement('div');panel.className='opening-panel';host.append(panel);
 const ids=[3,4,5,6,1,2];const alts=['Decorated transparent tent','Pagoda tents','Draped tent interior','German tent at dusk','Award presentation','Team photograph'];
 const images=ids.map((id,i)=>{const img=new Image();img.src=`assets/images/opening/company-${id}.jpg`;img.alt=alts[i];img.decoding='async';img.className=i===0?'active':'';img.setAttribute('aria-hidden',String(i!==0));panel.append(img);return img;});
 let visible=false,ready=false,index=0;new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(stage);
 setTimeout(()=>{ready=true;host.classList.add('ready');setInterval(()=>{if(!visible||document.hidden||reduced.matches)return;images[index].classList.remove('active');images[index].setAttribute('aria-hidden','true');index=(index+1)%images.length;images[index].classList.add('active');images[index].setAttribute('aria-hidden','false');},3500);},reduced.matches?0:4200);
})();
