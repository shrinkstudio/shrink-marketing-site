// -----------------------------------------
// shrink-marketing-site — PAGE TRANSITIONS
// Barba.js + GSAP + Lenis
// -----------------------------------------

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
if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);

// Barba is disabled for now, so let the browser restore scroll on back/forward.
// (Set back to "manual" when Barba/transitions are restored.)
history.scrollRestoration = "auto";

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

CustomEase.create("osmo", "0.625, 0.05, 0, 1");
gsap.defaults({ ease: "osmo", duration: durationDefault });


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

function initAfterEnterFunctions(next, { reinitEmbeds = true } = {}) {
  nextPage = next || document;

  if (has('.nav'))                          initNavScrollHide(nextPage);
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

  // Re-evaluate inline scripts inside the new container (Webflow embeds).
  // Skipped when booting without Barba against the whole document — re-running
  // every <script> on the page would re-execute GSAP/Webflow/this bundle.
  if (reinitEmbeds) reinitScripts(nextPage);

  // Webflow IX2 reinit
  if (window.Webflow && window.Webflow.ready) {
    window.Webflow.ready();
  }

  if (hasLenis) lenis.resize();
  if (hasScrollTrigger) ScrollTrigger.refresh();
}


// -----------------------------------------
// PAGE TRANSITIONS (Osmo panel slide)
// Falls back to a simple fade when [data-transition-wrap] is absent
// -----------------------------------------

function runPageOnceAnimation(next) {
  const tl = gsap.timeline();
  tl.call(() => resetPage(next), null, 0);
  return tl;
}

function runPageLeaveAnimation(current, next) {
  const transitionWrap = document.querySelector("[data-transition-wrap]");

  const tl = gsap.timeline({
    onComplete: () => { current.remove(); }
  });

  if (reducedMotion) {
    return tl.set(current, { autoAlpha: 0 });
  }

  // No transition component on the page — clean fade fallback
  if (!transitionWrap) {
    tl.set(next, { autoAlpha: 0 }, 0);
    tl.to(current, { autoAlpha: 0, duration: 0.4 }, 0);
    return tl;
  }

  const transitionPanel = transitionWrap.querySelector("[data-transition-panel]");
  const transitionPanelTop = transitionWrap.querySelector("[data-transition-panel-top]");
  const transitionPanelBottom = transitionWrap.querySelector("[data-transition-panel-bottom]");
  const transitionLogo = transitionWrap.querySelector("[data-transition-logo]");
  const transitionLogoPath = transitionWrap.querySelectorAll("path");

  tl.set(transitionPanel, { autoAlpha: 1 }, 0);
  tl.set(transitionPanelTop, { scaleY: 0, height: "15vw" }, 0);
  tl.set(transitionPanelBottom, { scaleY: 1, height: "20vw" }, 0);
  tl.set(transitionLogo, { autoAlpha: 1 });
  tl.set(transitionLogoPath, { yPercent: 105 });
  tl.set(next, { autoAlpha: 0 }, 0);

  tl.fromTo(transitionPanel, { yPercent: 0 }, { yPercent: -100, duration: 1 }, 0);
  tl.fromTo(transitionPanelTop, { scaleY: 0 }, { scaleY: 1, duration: 1 }, "<");
  tl.fromTo(transitionLogoPath, { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: { amount: 0.06 } }, "<+=0.4");

  // Outgoing page eases up GENTLY behind the cover — power2.inOut so it drifts
  // up rather than snapping with the panel, and only -10dvh so it doesn't lurch.
  // (Ported from Buff Motion's tuned leave; the panel/logo choreography above is
  // Shrink's own and left untouched.)
  tl.fromTo(current, { y: "0vh" }, { y: "-10dvh", duration: 1, ease: "power2.inOut" }, 0);

  return tl;
}

function runPageEnterAnimation(next) {
  const transitionWrap = document.querySelector("[data-transition-wrap]");

  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, null, "pageReady"));
  }

  // No transition component on the page — clean fade fallback
  if (!transitionWrap) {
    tl.to(next, { autoAlpha: 1, duration: 0.4 }, 0);
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, null, "pageReady"));
  }

  const transitionPanel = transitionWrap.querySelector("[data-transition-panel]");
  const transitionPanelBottom = transitionWrap.querySelector("[data-transition-panel-bottom]");
  const transitionLogoPath = transitionWrap.querySelectorAll("path");

  tl.add("startEnter", 1.35);
  tl.set(next, { autoAlpha: 1 }, "startEnter");
  tl.fromTo(transitionPanel, { yPercent: -100 }, { yPercent: -200, duration: 1, overwrite: "auto", immediateRender: false }, "startEnter");
  tl.fromTo(transitionPanelBottom, { scaleY: 1 }, { scaleY: 0, duration: 1 }, "<");
  tl.set(transitionPanel, { autoAlpha: 0 }, ">");
  tl.to(transitionLogoPath, { yPercent: -130, duration: 1.2, ease: "expo.inOut", stagger: { amount: -0.06 } }, "startEnter-=0.4");

  // New page rises gently with power3.inOut (decelerates to a soft stop — no snap),
  // started +0.15s AFTER the panel begins its exit so the rise OVERLAPS the panel's
  // tail and the ease plays out in the open: the page is visibly settling JUST as
  // the panel clears, not lurching a beat later. Distance kept small (7dvh) so it
  // reads as a settle, not a jump. (Was y:25dvh with the default ease starting in
  // lockstep with the panel — the quarter-screen lurch behind the reported jank.)
  const PAGE_RISE_DUR = 0.9;
  const PAGE_RISE_DELAY = 0.15;
  tl.from(next, { y: "7dvh", duration: PAGE_RISE_DUR, ease: "power3.inOut" }, `startEnter+=${PAGE_RISE_DELAY}`);

  tl.add("pageReady");
  tl.call(resetPage, [next], "pageReady");

  return new Promise(resolve => {
    tl.call(resolve, null, "pageReady");
  });
}


// -----------------------------------------
// BARBA — DISABLED (temporary)
// -----------------------------------------
// Barba is fully turned OFF while the pages are built out. Navigation is plain
// Webflow (full page loads) — no fixed-positioning, no container swap, nothing
// to make the page "fall down". Without the Barba lifecycle there's no
// once/enter to boot the modules, so we init them directly against the whole
// document on load. The nav now lives inside data-barba="container" (standard
// structure) and is just static markup here.
//
// To bring transitions back: delete initNoBarba() + its listener below and
// un-comment the Barba hooks/init block underneath.

function initNoBarba() {
  applyThemeFrom(document.querySelector('[data-barba="container"]'));
  initOnceFunctions();                                        // Lenis + doc-level delegation
  initAfterEnterFunctions(document, { reinitEmbeds: false }); // all modules, scoped to document
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNoBarba);
} else {
  initNoBarba();
}

/* --- BARBA PARKED — restore this block (and remove initNoBarba above) to re-enable page transitions ---
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
--- end Barba parked block --- */


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
  gsap.set(container, {
    clearProps: "position,top,left,right,transform,translate,x,y,xPercent,yPercent,scale,rotate"
  });

  // Belt-and-braces (from Buff): clearProps zeros transforms but can leave an
  // identity `transform: translate(0,0)` inline rather than removing it. Per CSS
  // spec ANY transform other than `none` (identity included) makes the element a
  // containing block for position:fixed descendants — which is what leaks the
  // fixed nav / transition panel onto the container on the NEXT navigation.
  // Force-remove so the container returns to a truly transform-less state.
  ['transform', 'translate', 'scale', 'rotate'].forEach(prop => {
    container.style.removeProperty(prop);
  });

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
