// src/pages/career-advice-page.js
/**
 * Career Advice Page - Animation initialization
 * Uses unified SessionAnimations library
 */

import SessionAnimations from './session-animations.js';

document.addEventListener('DOMContentLoaded', function () {
  // Initialize cascade animations for this page
  const animations = new SessionAnimations({ type: 'cascade' });
  animations.init();

  // Cleanup on page unload (important for SPAs)
  window.addEventListener('beforeunload', () => animations.destroy());
});
