/**
 * Personal Strategy Page - Animation & Interactivity
 * src/pages/personal-strategy-page.js
 */

import SessionAnimations from "./session-animations.js";

// Initialize animations using the simple approach
const animations = new SessionAnimations({
  type: "simple",
  selectors: {
    animItem: "._anim-items",
  },
  classes: {
    active: "_active",
  },
  intersectionOptions: {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  },
});

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => animations.init());
} else {
  animations.init();
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => animations.destroy());
