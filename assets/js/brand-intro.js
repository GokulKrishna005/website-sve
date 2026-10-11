"use strict";
(() => {
  const root = document.documentElement;
  const intro = document.querySelector(".brand-intro");
  if (!intro) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let observer;
  let frame = 0;
  const targets = [...document.querySelectorAll(".hero-copy, .hero-visual, .section-heading, .rental, .gallery-card, .about > div, .process-section h2, .process-grid article, .contact > div, #enquiry-form, .faq > *")];
  function updateScroll() {
    frame = 0;
    const scroll = Math.max(0, window.scrollY);
    const viewport = window.innerHeight || 1;
    const progress = Math.min(1, scroll / Math.max(1, intro.offsetHeight * .7));
    root.style.setProperty("--intro-progress", reduced.matches ? "0" : progress.toFixed(4));
    root.style.setProperty("--side-visibility", reduced.matches ? "0" : (Math.min(1, Math.max(0, scroll - 45) / (viewport * .5)) * .65).toFixed(3));
    root.style.setProperty("--side-turn", (scroll * .022).toFixed(2) + "deg");
    root.style.setProperty("--side-travel", (Math.sin(scroll / 700) * 55).toFixed(2) + "px");
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  function configureMotion() {
    if (observer) observer.disconnect();
    root.classList.remove("motion-ready");
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
        el.style.setProperty("--reveal-delay", (el.matches(".rental, .process-grid article, .gallery-card") ? index % 3 * 85 : 0) + "ms");
        observer.observe(el);
      });
      root.classList.add("motion-ready");
    }
    updateScroll();
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  reduced.addEventListener("change", configureMotion);
  configureMotion();
})();
