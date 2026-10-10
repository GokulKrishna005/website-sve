"use strict";
document.getElementById("year").textContent = String(new Date().getFullYear());
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("navigation");
toggle.hidden = false;
nav.classList.add("collapsed");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close −" : "Menu +";
  nav.classList.toggle("collapsed", !open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu +";
    nav.classList.add("collapsed");
  }
});
document.querySelectorAll("[data-service]").forEach(link => link.addEventListener("click", () => {
  document.getElementById("service").value = link.dataset.service;
}));
const content = window.SVE_CONTENT || { gallery: [] };
if (content.hero && content.hero.src) {
  const hero = document.getElementById("hero-image");
  hero.addEventListener("error", () => {
    hero.src = "assets/images/event-illustration.svg";
    hero.alt = "Architectural illustration of an event tent";
    document.getElementById("hero-caption").textContent = "Event concept illustration";
  }, { once: true });
  hero.src = content.hero.src;
  hero.alt = content.hero.alt || "Event setup";
  document.getElementById("hero-caption").textContent = content.hero.caption || "Sree Vijayalakshmi Enterprises";
}
const gallery = document.getElementById("gallery-grid");
const dialog = document.getElementById("photo-dialog");
const largePhoto = document.getElementById("large-photo");
const items = Array.isArray(content.gallery) ? content.gallery : [];
if (items.length && items.every(item => !item.illustration)) {
  document.getElementById("gallery-note").textContent = "A closer look at our event setups. Explore structures, exhibition spaces, and seating arrangements.";
}
function renderGallery(filter) {
  gallery.replaceChildren();
  const visible = items.filter(item => filter === "All" || item.category === filter);
  visible.forEach(item => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "View " + item.title);
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || item.title;
    img.loading = "lazy";
    img.width = 800;
    img.height = 600;
    let failed = false;
    img.addEventListener("error", () => {
      failed = true;
      img.src = "assets/images/event-illustration.svg";
      img.alt = "Event concept illustration; photograph unavailable";
      caption.textContent = item.category + " · Photograph unavailable; illustration shown";
    }, { once: true });
    button.append(img);
    const text = document.createElement("div");
    const labels = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const caption = document.createElement("p");
    caption.textContent = item.category + (item.illustration ? " · Concept illustration" : "");
    labels.append(title, caption);
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    text.append(labels, arrow);
    card.append(button, text);
    gallery.append(card);
    button.addEventListener("click", () => {
      largePhoto.src = img.src;
      largePhoto.alt = img.alt;
      document.getElementById("photo-caption").textContent = item.title + ((item.illustration || failed) ? " · Concept illustration" : "");
      dialog.showModal();
    });
  });
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.textContent = "Photos for this category are coming soon. Contact us to discuss your setup.";
    gallery.append(empty);
  }
  document.getElementById("gallery-status").textContent = visible.length + " gallery items shown.";
}
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-filter]").forEach(other => {
    other.classList.toggle("active", other === button);
    other.setAttribute("aria-pressed", String(other === button));
  });
  renderGallery(button.dataset.filter);
}));
document.getElementById("close-photo").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
renderGallery("All");
document.getElementById("enquiry-form").addEventListener("submit", event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const body = ["Hello SVE team,", "", "I would like a quotation for an event.", "",
    "Name: " + fields.get("name"), "Phone: " + fields.get("phone"),
    "Email: " + (fields.get("email") || "Not provided"),
    "Date: " + (fields.get("date") || "To be confirmed"),
    "Location: " + fields.get("location"),
    "Guests: " + (fields.get("guests") || "To be confirmed"),
    "Requirements: " + fields.get("service"), "", fields.get("message") || ""].join("\n");
  window.location.href = "mailto:sveevents@gmail.com?subject=" + encodeURIComponent("Event rental enquiry — " + fields.get("name")) + "&body=" + encodeURIComponent(body);
  document.getElementById("form-status").textContent = "Your email app should open with the details. Please press Send there. If it did not open, call +91 99020 44446 or email sveevents@gmail.com.";
});
