"use strict";
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { const saved = localStorage.getItem('sve-theme'); if (saved === 'dark' || saved === 'light') preference = saved; } catch (_) { /* Themes also work when storage is unavailable. */ }
  function apply(theme) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1121' : '#ffffff');
    const button = document.getElementById('theme-toggle');
    if (button) {
      const dark = theme === 'dark';
      button.hidden = false;
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
    }
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(preference || (system.matches ? 'dark' : 'light'));
    document.getElementById('theme-toggle').addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('sve-theme', preference); } catch (_) { /* Keep the current selection for this visit. */ }
      apply(preference);
    });
    root.classList.add('brand-animate');
  });
  system.addEventListener('change', () => { if (!preference) apply(system.matches ? 'dark' : 'light'); });
})();
