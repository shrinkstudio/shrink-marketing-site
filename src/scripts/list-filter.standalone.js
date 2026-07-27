// -----------------------------------------
// LIST FILTER — standalone build
// Zero dependencies (no GSAP / Lenis / Barba), self-initialising, and ONLY the
// filter/search module. Drop this on any site that just needs list filtering —
// e.g. a Mast-framework build — without loading the full Barba bundle (which
// would boot every module and collide with the host site's own accordions etc).
//
// Build output: dist/list-filter.min.js
// Embed:  <script defer src="https://cdn.jsdelivr.net/gh/shrinkstudio/shrink-marketing-site@main/dist/list-filter.min.js"></script>
// -----------------------------------------

import { initListFilter } from './list-filter.js';

function boot() {
  initListFilter(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
