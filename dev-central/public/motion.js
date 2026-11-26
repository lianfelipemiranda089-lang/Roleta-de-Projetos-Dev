(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CARD_SELECTOR = '.card, .guide-card, .library-card, .module-card';
  const HBAR_SELECTOR = 'nav, .nav-tabs, .filter-bar, .category-bar, .categories, .tabs-bar, .toolbar, .playground-toolbar';

  // 1. Reflexo sutil (spotlight) acompanhando o cursor nos cards
  if (!prefersReduced) {
    document.addEventListener('pointermove', (event) => {
      const card = event.target.closest(CARD_SELECTOR);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }, { passive: true });
  }

  // 2. Permite rolar barras horizontais de filtro/abas usando a roda do mouse
  document.addEventListener('wheel', (event) => {
    const bar = event.target.closest(HBAR_SELECTOR);
    if (!bar || bar.scrollWidth <= bar.clientWidth) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      bar.scrollLeft += event.deltaY;
    }
  }, { passive: false });
})();