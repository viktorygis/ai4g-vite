// src/pages/session-animations.js
/**
 * Unified animation library for all session pages
 * Supports: career-advice, coaching-session, serf-session
 */

class SessionAnimations {
  constructor(config = {}) {
    this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.config = this.mergeConfig(config);
    this.observers = [];
  }

  // Default configuration for different session types
  static defaultConfigs = {
    // For career-advice and coaching-session
    cascade: {
      type: "cascade",
      selectors: {
        solution: ".solution__item",
        serviceContainer: ".session__servise",
        serviceImg: ".servise-session__img",
        serviceBlock: ".servise-session__block",
        serviceDecor: ".servise-session__decor-img",
      },
      classes: {
        visible: "visible",
        show: "show",
      },
      timing: {
        solutionDelay: 200, // Delay between items (ms)
        solutionInitialDelay: 500, // Initial delay before starting (ms)
        serviceImgDelay: 300, // Delay between service images
        serviceBlockDelay: 300, // Delay between service blocks
        serviceBlockInitialDelay: 300, // Initial delay for blocks (after images)
      },
      intersectionOptions: { threshold: 0.1 },
    },

    // For serf-session (simpler approach)
    simple: {
      type: "simple",
      selectors: {
        animItem: "._anim-items",
      },
      classes: {
        active: "_active",
      },
      timing: {},
      intersectionOptions: {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    },
  };

  mergeConfig(config) {
    const defaultType = config.type || "cascade";
    const baseConfig = { ...SessionAnimations.defaultConfigs[defaultType] };
    return { ...baseConfig, ...config };
  }

  /**
   * Initialize animations based on config
   */
  init() {
    if (this.prefersReducedMotion) {
      this.disableAnimations();
      return;
    }

    if (this.config.type === "simple") {
      this.initSimpleAnimations();
    } else if (this.config.type === "cascade") {
      this.initCascadeAnimations();
    }
  }

  /**
   * Simple animation: elements animate in when visible
   */
  initSimpleAnimations() {
    const animItems = document.querySelectorAll(this.config.selectors.animItem);
    if (!animItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(this.config.classes.active);
          observer.unobserve(entry.target);
        }
      });
    }, this.config.intersectionOptions);

    animItems.forEach((item) => observer.observe(item));
    this.observers.push(observer);
  }

  /**
   * Cascade animation: sequential animations with promises
   */
  initCascadeAnimations() {
    const solutionContainer = document.querySelector(this.config.selectors.solution);
    if (!solutionContainer) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateSolutions().then(() => this.animateService());
          observer.unobserve(entry.target);
        }
      });
    }, this.config.intersectionOptions);

    observer.observe(solutionContainer);
    this.observers.push(observer);
  }

  /**
   * Animate solution items with cascade effect
   */
  animateSolutions() {
    const solutionItems = Array.from(document.querySelectorAll(this.config.selectors.solution));
    return this.animateElementsCascade(solutionItems, this.config.timing.solutionDelay, this.config.timing.solutionInitialDelay, this.config.classes.visible);
  }

  /**
   * Animate service block elements
   */
  animateService() {
    const serviceContainer = document.querySelector(this.config.selectors.serviceContainer);
    if (!serviceContainer) return Promise.resolve();

    return new Promise((resolve) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgElements = Array.from(document.querySelectorAll(this.config.selectors.serviceImg));
            const blockElements = Array.from(document.querySelectorAll(this.config.selectors.serviceBlock));
            const decorImg = document.querySelector(this.config.selectors.serviceDecor);

            this.animateElementsCascade(imgElements, this.config.timing.serviceImgDelay, 0, this.config.classes.show)
              .then(() => this.animateElementsCascade(blockElements, this.config.timing.serviceBlockDelay, this.config.timing.serviceBlockInitialDelay, this.config.classes.show))
              .then(() => {
                if (decorImg) {
                  const totalDelay =
                    this.config.timing.serviceImgDelay * imgElements.length + this.config.timing.serviceBlockInitialDelay + this.config.timing.serviceBlockDelay * blockElements.length;
                  setTimeout(() => decorImg.classList.add(this.config.classes.show), totalDelay);
                }
                resolve();
              });

            observer.unobserve(entry.target);
          }
        });
      }, this.config.intersectionOptions);

      observer.observe(serviceContainer);
      this.observers.push(observer);
    });
  }

  /**
   * Animate elements with cascade effect (Promise-based)
   * @param {Array} elements - Elements to animate
   * @param {number} delayPerElement - Delay between each element (ms)
   * @param {number} initialDelay - Initial delay before starting (ms)
   * @param {string} className - CSS class to add
   */
  animateElementsCascade(elements, delayPerElement, initialDelay, className) {
    if (!elements.length) return Promise.resolve();

    return new Promise((resolve) => {
      elements.forEach((el, idx) => {
        setTimeout(
          () => {
            el.classList.add(className);
            if (idx === elements.length - 1) resolve();
          },
          initialDelay + idx * delayPerElement,
        );
      });
    });
  }

  /**
   * Disable animations (for prefers-reduced-motion)
   */
  disableAnimations() {
    if (this.config.type === "simple") {
      document.querySelectorAll(this.config.selectors.animItem).forEach((el) => el.classList.add(this.config.classes.active));
    } else if (this.config.type === "cascade") {
      document.querySelectorAll(this.config.selectors.solution).forEach((el) => el.classList.add(this.config.classes.visible));
      document.querySelectorAll(this.config.selectors.serviceImg).forEach((el) => el.classList.add(this.config.classes.show));
      document.querySelectorAll(this.config.selectors.serviceBlock).forEach((el) => el.classList.add(this.config.classes.show));
      document.querySelectorAll(this.config.selectors.serviceDecor).forEach((el) => el.classList.add(this.config.classes.show));
    }
  }

  /**
   * Cleanup: disconnect all observers
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Export for use in other files
export default SessionAnimations;
