"use strict";
(() => {
  const root=document.documentElement, intro=document.querySelector('.brand-intro'), video=document.getElementById('intro-video'), count=document.getElementById('scene-count');
  if(!intro)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const saveData=navigator.connection?.saveData;
  const narrow=matchMedia('(max-width: 700px)');
  function updateScene(){if(video.duration){const scene=Math.min(3,Math.floor(video.currentTime/(video.duration/3))+1);count.textContent=String(scene).padStart(2,'0')+' / 03';}}
  video.addEventListener('timeupdate',updateScene);
  function media(){if(reduced.matches||narrow.matches||saveData||document.hidden){video.pause();root.classList.add('video-paused');return;}root.classList.remove('video-paused');video.play().catch(()=>root.classList.add('video-paused'));}
  const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)media();else video.pause();},{threshold:.05});observer.observe(intro);
  reduced.addEventListener('change',media);
  narrow.addEventListener('change',media);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(intro.getBoundingClientRect().bottom>0)media();});
})();
