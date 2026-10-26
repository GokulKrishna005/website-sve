"use strict";
(() => {
  const root=document.documentElement, intro=document.querySelector('.brand-intro'), video=document.getElementById('intro-video'), count=document.getElementById('scene-count');
  if(!intro)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const saveData=navigator.connection?.saveData;
  let frame=0;
  function scroll(){frame=0;const vh=innerHeight||1;const distance=scrollY;
    const start=intro.offsetHeight-vh*.95;
    const progress=Math.max(0,Math.min(1,(distance-start)/(vh*.6)));
    root.style.setProperty('--world-open',progress.toFixed(3));
  }
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(scroll);},{passive:true});
  addEventListener('resize',scroll,{passive:true});scroll();
  function updateScene(){if(video.duration){const scene=Math.min(3,Math.floor(video.currentTime/(video.duration/3))+1);count.textContent=String(scene).padStart(2,'0')+' / 03';}}
  video.addEventListener('timeupdate',updateScene);
  function media(){if(reduced.matches||saveData){video.pause();root.classList.add('video-paused');return;}root.classList.remove('video-paused');video.play().catch(()=>root.classList.add('video-paused'));}
  const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)media();else video.pause();},{threshold:.05});observer.observe(intro);
  reduced.addEventListener('change',media);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(intro.getBoundingClientRect().bottom>0)media();});
})();
