(() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('.section-heading,.hero-introduction,.welcome-features article,.hero-outro,.about-copy,.client-group,.process-grid article,.contact>div,.faq details,.detail-heading,.detail-cover,.detail-uses,.detail-photo,.detail-next,.detail-related-list a')];
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.remove('scroll-pending');entry.target.classList.add('scroll-shown');observer.unobserve(entry.target);});},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 targets.forEach(element=>{if(element.getBoundingClientRect().bottom<=0)return;element.classList.add('scroll-reveal','scroll-pending');observer.observe(element);});
 preference.addEventListener('change',()=>{if(preference.matches){observer.disconnect();targets.forEach(element=>element.classList.remove('scroll-pending'));}});
 document.addEventListener('focusin',event=>{const target=event.target.closest('.scroll-pending');if(target){target.classList.remove('scroll-pending');observer.unobserve(target);}});
})();
