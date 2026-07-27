// -----------------------------------------
// shrink-marketing-site — PAGE TRANSITIONS
// Barba.js + GSAP + Lenis
// -----------------------------------------

import { initThemeToggle } from './theme-toggle.js';
import { initAccordions, destroyAccordions } from './accordion.js';
import { initTabs, destroyTabs } from './tabs.js';
import { initSliders, destroySliders } from './slider.js';
import { initInlineVideos, destroyInlineVideos } from './inline-video.js';
import { initModalDelegation, initModals, destroyModals } from './modal.js';
import { initFontSizeDetect, initFooterYear, initSkipLink } from './utilities.js';
import { initNavScrollHide, destroyNavScrollHide } from './nav.js';
import { initFormValidation, destroyFormValidation } from './form-validate.js';
import { initCopyClip, destroyCopyClip } from './copy-clip.js';

// --- Ported from shrink-studio-site (Shrink signature modules) ---
import { initMegaNav, destroyMegaNav } from './mega-nav.js';
import { initNavTheme, destroyNavTheme } from './nav-theme.js';
import { initCmsNest, destroyCmsNest } from './cms-nest.js';
import { initContentReveal, destroyContentReveal } from './content-reveal.js';
import { initSplitText, destroySplitText } from './split-text.js';
import { initWordScatter, destroyWordScatter } from './word-scatter.js';
import { initProjectList, destroyProjectList } from './project-list.js';
import { initProjectsListing, destroyProjectsListing } from './projects-listing.js';
import { initTOC, destroyTOC } from './toc.js';
import { initMagneticButtons, destroyMagneticButtons } from './magnetic-button.js';
import { initHoverList, destroyHoverList } from './hover-list.js';
import { initStackingCards, destroyStackingCards } from './stacking-cards.js';
import { initParallax, destroyParallax } from './parallax.js';
import { initFooterParallax, destroyFooterParallax } from './footer-parallax.js';
import { initTestimonialSlider, destroyTestimonialSlider } from './testimonial-slider.js';
import { initGsapSliders, destroyGsapSliders } from './gsap-slider.js';
import { initCurrentTime, destroyCurrentTime } from './current-time.js';
import { initListFilter, destroyListFilter } from './list-filter.js';

gsap.registerPlugin(CustomEase);
if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

history.scrollRestoration = "manual";

let lenis = null;
let nextPage = document;
let onceFunctionsInitialized = false;

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", e => (reducedMotion = e.matches));

const has = (s) => !!nextPage.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

CustomEase.create("shrink", "0.65, 0.05, 0, 1");
gsap.defaults({ ease: "shrink", duration: durationDefault });


// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  // Document-level delegation (bind once)
  initModalDelegation();
  initFontSizeDetect();
  initSkipLink();
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;

  // Destroy old instances before new page enters
  destroyNavScrollHide();
  destroyAccordions();
  destroyTabs();
  destroySliders();
  destroyInlineVideos();
  destroyModals();
  destroyFormValidation();
  destroyCopyClip();

  // Ported modules
  destroyMegaNav();
  destroyNavTheme();
  destroyCmsNest();
  destroyContentReveal();
  destroySplitText();
  destroyWordScatter();
  destroyProjectList();
  destroyProjectsListing();
  destroyTOC();
  destroyMagneticButtons();
  destroyHoverList();
  destroyStackingCards();
  destroyParallax();
  destroyFooterParallax();
  destroyTestimonialSlider();
  destroyGsapSliders();
  destroyCurrentTime();
  destroyListFilter();
}

function initAfterEnterFunctions(next) {
  nextPage = next || document;

  if (has('.nav'))                          initNavScrollHide(nextPage);
  if (has('[data-theme-toggle]'))           initThemeToggle(nextPage);
  if (has('details'))                       initAccordions(nextPage);
  if (has('[data-tabs-component]'))         initTabs(nextPage);
  if (has('[data-slider]'))                 initSliders(nextPage);
  if (has('[data-video]'))                  initInlineVideos(nextPage);
  if (has('dialog'))                        initModals(nextPage);
  if (has('[data-form-validate]'))          initFormValidation(nextPage);
  if (has('[data-footer-year]'))            initFooterYear(nextPage);
  if (has('[data-copy="trigger"]'))         initCopyClip(nextPage);

  // --- Ported modules ---
  if (has('[data-menu-wrap]'))              initMegaNav(nextPage);
  if (has('[data-section-theme]'))          initNavTheme(nextPage);
  if (has('[data-nest="target"]'))          initCmsNest(nextPage);
  if (has('[data-reveal-group]'))           initContentReveal(nextPage);
  if (has('[data-split="heading"]'))        initSplitText(nextPage);
  if (has('[data-highlight-text]'))         initWordScatter(nextPage);
  if (has('[data-project-list]'))           initProjectList(nextPage);
  if (has('.projects-listing__item'))       initProjectsListing(nextPage);
  if (has('[data-toc-list]'))               initTOC(nextPage);
  if (has('[data-magnetic-strength]'))      initMagneticButtons(nextPage);
  if (has('[data-hover-list]'))             initHoverList(nextPage);
  if (has('[data-stacking-cards-item]'))    initStackingCards(nextPage);
  if (has('[data-parallax="trigger"]'))     initParallax(nextPage);
  if (has('[data-footer-parallax]'))        initFooterParallax(nextPage);
  if (has('[data-testimonial-wrap]'))       initTestimonialSlider(nextPage);
  if (has('[data-gsap-slider-init]'))       initGsapSliders(nextPage);
  if (has('[data-current-time]'))           initCurrentTime(nextPage);
  if (has('[data-list]'))                    initListFilter(nextPage);

  // Re-evaluate inline scripts inside the new container (Webflow embeds)
  reinitScripts(nextPage);

  // Webflow IX2 reinit
  if (window.Webflow && window.Webflow.ready) {
    window.Webflow.ready();
  }

  if (hasLenis) lenis.resize();
  if (hasScrollTrigger) ScrollTrigger.refresh();
}


// -----------------------------------------
// PAGE TRANSITIONS (Simple Fade)
// Replace with project-specific animations
// -----------------------------------------

function runPageOnceAnimation(next) {
  const tl = gsap.timeline();
  tl.call(() => resetPage(next), null, 0);
  return tl;
}

function runPageLeaveAnimation(current, next) {
  const tl = gsap.timeline({
    onComplete: () => { current.remove(); }
  });

  if (reducedMotion) {
    return tl.set(current, { autoAlpha: 0 });
  }

  tl.set(next, { autoAlpha: 0 }, 0);

  tl.to(current, {
    autoAlpha: 0,
    duration: 0.4,
  }, 0);

  return tl;
}

function runPageEnterAnimation(next) {
  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, null, "pageReady"));
  }

  tl.to(next, {
    autoAlpha: 1,
    duration: 0.4,
  }, 0);

  tl.add("pageReady");
  tl.call(resetPage, [next], "pageReady");

  return new Promise(resolve => {
    tl.call(resolve, null, "pageReady");
  });
}


// -----------------------------------------
// BARBA HOOKS + INIT
// -----------------------------------------

barba.hooks.beforeEnter(data => {
  gsap.set(data.next.container, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
  });

  if (lenis && typeof lenis.stop === "function") {
    lenis.stop();
  }

  initBeforeEnterFunctions(data.next.container);
  applyThemeFrom(data.next.container);
});

barba.hooks.afterLeave(() => {
  if (hasScrollTrigger) {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
});

barba.hooks.enter(data => {
  initBarbaNavUpdate(data);
});

barba.hooks.afterEnter(data => {
  initAfterEnterFunctions(data.next.container);

  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
});

barba.init({
  debug: false,
  timeout: 7000,
  preventRunning: true,
  transitions: [
    {
      name: "default",
      sync: true,

      async once(data) {
        initOnceFunctions();
        // Barba's `once` does NOT fire the enter hooks, so the per-page modules
        // (list-filter, accordion, sliders…) must be initialised here too —
        // otherwise they never run on first load, only after a navigation.
        initAfterEnterFunctions(data.next.container);
        return runPageOnceAnimation(data.next.container);
      },

      async leave(data) {
        return runPageLeaveAnimation(data.current.container, data.next.container);
      },

      async enter(data) {
        return runPageEnterAnimation(data.next.container);
      }
    }
  ],
});


// -----------------------------------------
// HELPERS
// -----------------------------------------

const themeConfig = {
  light: { nav: "dark", transition: "light" },
  dark: { nav: "light", transition: "dark" }
};

function applyThemeFrom(container) {
  const pageTheme = container?.dataset?.pageTheme || "light";
  const config = themeConfig[pageTheme] || themeConfig.light;

  document.body.dataset.pageTheme = pageTheme;
  const transitionEl = document.querySelector('[data-theme-transition]');
  if (transitionEl) transitionEl.dataset.themeTransition = config.transition;

  const nav = document.querySelector('[data-theme-nav]');
  if (nav) nav.dataset.themeNav = config.nav;
}

function initLenis() {
  if (lenis) return;
  if (!hasLenis) return;

  lenis = new Lenis({
    lerp: 0.165,
    wheelMultiplier: 1.25,
  });

  window.__shrinkLenis = lenis;

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function resetPage(container) {
  window.scrollTo(0, 0);
  gsap.set(container, { clearProps: "position,top,left,right" });

  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }
}

function reinitScripts(container) {
  container.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    [...oldScript.attributes].forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

function initBarbaNavUpdate(data) {
  var tpl = document.createElement('template');
  tpl.innerHTML = data.next.html.trim();
  var nextNodes = tpl.content.querySelectorAll('[data-barba-update]');
  var currentNodes = document.querySelectorAll('nav [data-barba-update]');

  currentNodes.forEach(function (curr, index) {
    var next = nextNodes[index];
    if (!next) return;

    var newStatus = next.getAttribute('aria-current');
    if (newStatus !== null) {
      curr.setAttribute('aria-current', newStatus);
    } else {
      curr.removeAttribute('aria-current');
    }

    var newClassList = next.getAttribute('class') || '';
    curr.setAttribute('class', newClassList);
  });
}
