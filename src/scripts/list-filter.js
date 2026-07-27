// -----------------------------------------
// LIST FILTER + SEARCH — unified, data-attribute driven
// One instance per [data-list] root. Filter (tags) and search (text)
// share a single visibility pass so they intersect correctly (filter ∩ search).
// Pagination / load-more is built in but OFF until data-list-page-size is set.
//
// Powers Tools and Glossary. No external deps (no List.js) — matches CANONICAL
// "build your own". Wired into the Barba registry via init/destroy.
// -----------------------------------------

let instances = [];

export function initListFilter(scope) {
  scope = scope || document;

  scope.querySelectorAll('[data-list]').forEach((root) => {
    if (root.hasAttribute('data-list-init')) return;
    root.setAttribute('data-list-init', '');
    instances.push(new ListInstance(root));
  });
}

export function destroyListFilter() {
  instances.forEach((inst) => inst.destroy());
  instances = [];
  document.querySelectorAll('[data-list-init]').forEach((el) => {
    el.removeAttribute('data-list-init');
  });
}

class ListInstance {
  constructor(root) {
    this.root = root;

    // --- Config (all optional, read off the root) ---
    this.select = (root.getAttribute('data-list-select') || 'multi').toLowerCase();      // 'single' | 'multi'
    this.match = (root.getAttribute('data-list-match') || 'any').toLowerCase();          // 'any' (OR) | 'all' (AND)
    this.pageSize = parseInt(root.getAttribute('data-list-page-size'), 10) || 0;         // 0 = show all (pagination off)
    this.transition = parseInt(root.getAttribute('data-list-transition'), 10) || 0;      // ms exit delay (0 = instant)

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = rm.matches;

    // --- Elements ---
    this.itemsWrap = root.querySelector('[data-list-items]') || root;
    this.input = root.querySelector('[data-list-search]');
    this.empty = root.querySelector('[data-list-empty]');
    this.countEl = root.querySelector('[data-list-count]');
    this.moreBtn = root.querySelector('[data-list-more]');

    // --- Build item records once ---
    this.records = [...this.itemsWrap.querySelectorAll('[data-list-item]')].map((el) => ({
      el,
      tags: this._tagsFor(el),
      search: this._searchTextFor(el),
      timer: null,
    }));

    // --- State ---
    this.query = '';
    this.page = 1;
    this.activeTags = this.select === 'single' ? null : new Set(['all']);

    this._bind();
    this.apply(false);
  }

  // Tags: explicit data-list-tags, or auto-collected from [data-list-tag] children
  _tagsFor(el) {
    let raw = (el.getAttribute('data-list-tags') || '').trim().toLowerCase();
    if (!raw) {
      const seen = new Set();
      el.querySelectorAll('[data-list-tag]').forEach((c) => {
        const v = (c.getAttribute('data-list-tag') || c.textContent || '').trim().toLowerCase();
        if (v) v.split(/\s+/).forEach((t) => seen.add(t));
      });
      raw = [...seen].join(' ');
      if (raw) el.setAttribute('data-list-tags', raw); // reflect for debugging/CSS
    }
    return new Set(raw ? raw.split(/\s+/).filter(Boolean) : []);
  }

  // Searchable text: concatenation of [data-list-field] children, else full item text. Tags always included.
  _searchTextFor(el) {
    const fields = [...el.querySelectorAll('[data-list-field]')].map((f) => f.textContent || '');
    const base = fields.length ? fields.join(' ') : (el.textContent || '');
    const tags = el.getAttribute('data-list-tags') || '';
    return (base + ' ' + tags).toLowerCase().replace(/\s+/g, ' ').trim();
  }

  _bind() {
    // Delegated clicks: filter buttons + load-more
    this._onClick = (e) => {
      const btn = e.target.closest('[data-list-filter]');
      if (btn && this.root.contains(btn)) {
        e.preventDefault(); // in Webflow these are <a> Buttons — don't let href jump the page
        this._toggleTag(btn.getAttribute('data-list-filter'));
        this.page = 1;
        this.apply(true);
        return;
      }
      if (this.moreBtn && e.target.closest('[data-list-more]')) {
        e.preventDefault();
        this.page += 1;
        this.apply(true);
      }
    };
    this.root.addEventListener('click', this._onClick);

    // Search input (light debounce for larger lists like the Glossary)
    if (this.input) {
      this._onInput = () => {
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => {
          this.query = (this.input.value || '').trim().toLowerCase();
          this.page = 1;
          this.apply(true);
        }, 120);
      };
      this.input.addEventListener('input', this._onInput);

      // Webflow inputs live inside a <form> — stop Enter from reloading the page
      this.form = this.input.closest('form');
      if (this.form) {
        this._onSubmit = (e) => e.preventDefault();
        this.form.addEventListener('submit', this._onSubmit);
      }
    }
  }

  _hasRealActive() {
    if (this.select === 'single') return this.activeTags !== null;
    return this.activeTags.size > 0 && !this.activeTags.has('all');
  }

  _reset() {
    if (this.select === 'single') {
      this.activeTags = null;
    } else {
      this.activeTags.clear();
      this.activeTags.add('all');
    }
  }

  _toggleTag(rawTarget) {
    const target = (rawTarget || '').trim().toLowerCase();

    if (target === 'all' || target === 'reset') {
      this._reset();
      return;
    }
    if (this.select === 'single') {
      this.activeTags = this.activeTags === target ? null : target;
      return;
    }
    // multi
    this.activeTags.delete('all');
    if (this.activeTags.has(target)) this.activeTags.delete(target);
    else this.activeTags.add(target);
    if (this.activeTags.size === 0) this._reset();
  }

  _matchesFilter(rec) {
    if (!this._hasRealActive()) return true;
    if (this.select === 'single') return rec.tags.has(this.activeTags);

    const selected = [...this.activeTags];
    if (this.match === 'all') return selected.every((t) => rec.tags.has(t)); // AND
    return selected.some((t) => rec.tags.has(t)); // ANY (OR)
  }

  _matchesSearch(rec) {
    if (!this.query) return true;
    // every query token must appear somewhere in the item's searchable text
    return this.query.split(/\s+/).every((tok) => rec.search.includes(tok));
  }

  apply(animate) {
    // Single visibility pass = filter ∩ search
    const matched = this.records.filter((r) => this._matchesFilter(r) && this._matchesSearch(r));

    let visible = matched;
    if (this.pageSize > 0) visible = matched.slice(0, this.page * this.pageSize);
    const visibleSet = new Set(visible.map((r) => r.el));

    this.records.forEach((r) => this._setVisible(r, visibleSet.has(r.el), animate));
    this._paintButtons();
    this._paintEmpty(matched.length);
    this._paintCount(visible.length, matched.length);
    this._paintMore(visible.length, matched.length);
  }

  _setVisible(rec, on, animate) {
    const el = rec.el;
    if (rec.timer) { clearTimeout(rec.timer); rec.timer = null; }

    if (on) {
      this._setStatus(el, 'active');
      return;
    }
    // hiding — optional exit-transition phase (skipped for reduced motion / instant)
    const wasActive = el.getAttribute('data-list-status') === 'active';
    if (animate && wasActive && this.transition > 0 && !this.reduced) {
      this._setStatus(el, 'transition-out');
      rec.timer = setTimeout(() => { this._setStatus(el, 'not-active'); rec.timer = null; }, this.transition);
    } else {
      this._setStatus(el, 'not-active');
    }
  }

  _setStatus(el, next) {
    if (el.getAttribute('data-list-status') === next) return;
    el.setAttribute('data-list-status', next);
    el.setAttribute('aria-hidden', next === 'active' ? 'false' : 'true');
  }

  _paintButtons() {
    this.root.querySelectorAll('[data-list-filter]').forEach((btn) => {
      const t = (btn.getAttribute('data-list-filter') || '').trim().toLowerCase();
      let on;
      if (t === 'all') on = !this._hasRealActive();
      else if (t === 'reset') on = this._hasRealActive();
      else on = this.select === 'single' ? this.activeTags === t : this.activeTags.has(t);

      if (btn.getAttribute('data-list-status') !== (on ? 'active' : 'not-active')) {
        btn.setAttribute('data-list-status', on ? 'active' : 'not-active');
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    });
  }

  _paintEmpty(matchedCount) {
    if (!this.empty) return;
    const show = matchedCount === 0;
    this.empty.style.display = show ? 'block' : 'none';
    if (show && this.query) {
      const p = this.empty.querySelector('[data-list-empty-query]') || this.empty.querySelector('p');
      if (p) p.textContent = `We couldn't find a match for "${this.query}"`;
    }
  }

  _paintCount(shown, total) {
    if (!this.countEl) return;
    // "9 / 42" when paginating, else just the total matched
    this.countEl.textContent = this.pageSize > 0 && shown < total ? `${shown} / ${total}` : `${total}`;
  }

  _paintMore(shown, total) {
    if (!this.moreBtn) return;
    this.moreBtn.style.display = this.pageSize > 0 && shown < total ? '' : 'none';
  }

  destroy() {
    this.root.removeEventListener('click', this._onClick);
    if (this.input && this._onInput) this.input.removeEventListener('input', this._onInput);
    if (this.form && this._onSubmit) this.form.removeEventListener('submit', this._onSubmit);
    clearTimeout(this._debounce);
    this.records.forEach((r) => { if (r.timer) clearTimeout(r.timer); });
    this.records = [];
  }
}
