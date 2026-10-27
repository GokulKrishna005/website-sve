"use strict";
(() => {
  const root=document.documentElement, intro=document.querySelector('.brand-intro'), video=document.getElementById('intro-video'), count=document.getElementById('scene-count'), toggle=document.getElementById('motion-toggle');
  if(!intro)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const saveData=navigator.connection?.saveData;
  const narrow=matchMedia('(max-width: 700px)');
  let userPaused=false;
  try { userPaused=localStorage.getItem('sve-background-motion')==='paused'; } catch (_) {}
  function updateToggle(){toggle.textContent=userPaused?'Play video':'Pause video';toggle.setAttribute('aria-pressed',String(userPaused));}
  updateToggle();
  toggle.addEventListener('click',()=>{userPaused=!userPaused;try{localStorage.setItem('sve-background-motion',userPaused?'paused':'playing');}catch(_){}updateToggle();media();});
  let ready=false, visible=false;
  function updateScene(){if(video.duration){const scene=Math.min(3,Math.floor(video.currentTime/(video.duration/3))+1);count.textContent=String(scene).padStart(2,'0')+' / 03';}}
  video.addEventListener('timeupdate',updateScene);
  function media(){if(!ready||!visible||userPaused||reduced.matches||narrow.matches||saveData||document.hidden){video.pause();root.classList.add('video-paused');return;}root.classList.remove('video-paused');video.play().catch(()=>root.classList.add('video-paused'));}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;media();},{threshold:.05});observer.observe(intro);
  // Let the one-time SVG pavilion and wordmark finish before starting video decode.
  setTimeout(()=>{ready=true;media();},4100);
  reduced.addEventListener('change',media);
  narrow.addEventListener('change',media);
  document.addEventListener('visibilitychange',media);
})();
