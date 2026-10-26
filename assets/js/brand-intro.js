"use strict";
(() => {
  const intro = document.querySelector(".brand-intro");
  if (!intro) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let observer;
  let frame = 0;
  const sideArt = [...document.querySelectorAll('.side-art')];
  let lastIntro=-1, lastSide=-1, lastTurn=-1, lastTravel=NaN;
  const targets = [...document.querySelectorAll(".hero-copy, .hero-visual, .section-heading, .rental, .service-card, .gallery-card, .about > div, .process-section h2, .process-grid article, .contact > div, #enquiry-form, .faq > *")];
  function updateScroll() {
    frame = 0;
    const scroll = Math.max(0, window.scrollY);
    const viewport = window.innerHeight || 1;
    const progress = Math.min(1, scroll / Math.max(1, intro.offsetHeight * .7));
    const introProgress=reduced.matches?0:Math.round(progress*100)/100;
    if(introProgress!==lastIntro){intro.style.setProperty("--intro-progress",introProgress);lastIntro=introProgress;}
    const side=reduced.matches?0:Math.round(Math.min(1,Math.max(0,scroll-45)/(viewport*.5))*.65*100)/100;
    if(side!==lastSide){sideArt.forEach(el=>el.style.setProperty("--side-visibility",side));lastSide=side;}
    const turn=Math.round(scroll*.022), travel=Math.round(Math.sin(scroll/700)*55);
    if(turn!==lastTurn){sideArt.forEach(el=>el.style.setProperty("--side-turn",turn+"deg"));lastTurn=turn;}
    if(travel!==lastTravel){sideArt.forEach(el=>el.style.setProperty("--side-travel",travel+"px"));lastTravel=travel;}
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  function configureMotion() {
    if (observer) observer.disconnect();
    document.documentElement.classList.remove("motion-ready");
    if (!reduced.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .06, rootMargin: "0px 0px -12px 0px" });
      targets.forEach((el, index) => {
        el.classList.add("reveal");
        el.style.setProperty("--reveal-delay", (el.matches(".rental, .service-card, .process-grid article, .gallery-card") ? index % 3 * 85 : 0) + "ms");
        observer.observe(el);
      });
      document.documentElement.classList.add("motion-ready");
    }
    updateScroll();
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  reduced.addEventListener("change", configureMotion);
  configureMotion();
})();
