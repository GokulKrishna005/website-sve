"use strict";

// Keep the footer date current without requiring a build step.
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
