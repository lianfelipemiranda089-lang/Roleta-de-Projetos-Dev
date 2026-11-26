const THEME_STORAGE_KEY = 'devcentral.theme';

const state = {
  pillars: [],
  allGuides: [],
  filteredGuides: [],
  selectedPillar: '',
  searchQuery: '',
  activeGuide: null,
  theme: 'dark'
};

const dom = {
  menuToggle: document.getElementById('menu-toggle'),
  sidebar: document.getElementById('sidebar'),
  backdrop: document.getElementById('sidebar-backdrop'),
  sidebarNav: document.getElementById('sidebar-nav'),
  resetFilters: document.getElementById('reset-filters'),
  brandHome: document.getElementById('brand-home'),
  searchInput: document.getElementById('search-input'),
  clearSearch: document.getElementById('clear-search'),
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  themeLabel: document.getElementById('theme-label'),
  statusBanner: document.getElementById('status-banner'),
  catalogSection: document.getElementById('catalog-section'),
  catalogTitle: document.getElementById('catalog-title'),
  catalogSubtitle: document.getElementById('catalog-subtitle'),
  catalogCount: document.getElementById('catalog-count'),
  pillarPills: document.getElementById('pillar-pills'),
  guidesGrid: document.getElementById('guides-grid'),
  guideReader: document.getElementById('guide-reader'),
  mainContent: document.getElementById('main-content')
};

function applyTheme(theme) {
  const normalized = theme === 'light' ? 'light' : 'dark';
  state.theme = normalized;
  document.documentElement.setAttribute('data-theme', normalized);

  if (normalized === 'light') {
    dom.themeIcon.textContent = '☾';
    dom.themeLabel.textContent = 'Tema Escuro';
  } else {
    dom.themeIcon.textContent = '☀';
    dom.themeLabel.textContent = 'Tema Claro';
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
  } catch {
    // Ignora caso o armazenamento local esteja indisponível
  }
}

function initTheme() {
  let saved = '';
  try {
    saved = localStorage.getItem(THEME_STORAGE_KEY) || '';
  } catch {
    saved = '';
  }

  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
    return;
  }

  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');
}

function setSidebarOpen(isOpen) {
  dom.sidebar.classList.toggle('open', isOpen);
  dom.backdrop.classList.toggle('hidden', !isOpen);
  dom.menuToggle.setAttribute('aria-expanded', String(isOpen));
}

function showStatus(message, { isError = false } = {}) {
  dom.statusBanner.textContent = message;
  dom.statusBanner.classList.toggle('error', isError);
  dom.statusBanner.classList.remove('hidden');
}

function hideStatus() {
  dom.statusBanner.textContent = '';
  dom.statusBanner.classList.remove('error');
  dom.statusBanner.classList.add('hidden');
}

async function apiGet(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000)
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const msg = payload?.error?.message || `Erro na requisição (HTTP ${response.status})`;
    throw new Error(msg);
  }

  return payload;
}

function getPillarName(pillarId) {
  const found = state.pillars.find((p) => p.id === pillarId);
  return found ? found.name : pillarId || 'Geral';
}

function renderSidebar() {
  dom.sidebarNav.textContent = '';

  if (state.pillars.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'Nenhum pilar carregado.';
    dom.sidebarNav.appendChild(empty);
    return;
  }

  for (const pillar of state.pillars) {
    const group = document.createElement('div');
    group.className = 'nav-group';

    const pillarBtn = document.createElement('button');
    pillarBtn.type = 'button';
    pillarBtn.className = 'nav-pillar-btn';
    if (!state.activeGuide && state.selectedPillar === pillar.id) {
      pillarBtn.classList.add('active');
    }

    const nameSpan = document.createElement('span');
    nameSpan.textContent = pillar.name;

    const matchingGuides = state.allGuides.filter((g) => g.pillar === pillar.id);
    const countSpan = document.createElement('span');
    countSpan.className = 'muted';
    countSpan.textContent = String(matchingGuides.length);

    pillarBtn.append(nameSpan, countSpan);
    pillarBtn.addEventListener('click', () => {
      state.activeGuide = null;
      state.selectedPillar = state.selectedPillar === pillar.id ? '' : pillar.id;
      syncView();
      setSidebarOpen(false);
    });

    group.appendChild(pillarBtn);

    if (matchingGuides.length > 0) {
      const list = document.createElement('ul');
      list.className = 'nav-guide-list';

      for (const guide of matchingGuides) {
        const li = document.createElement('li');
        const guideBtn = document.createElement('button');
        guideBtn.type = 'button';
        guideBtn.className = 'nav-guide-btn';
        if (state.activeGuide?.slug === guide.slug) {
          guideBtn.classList.add('active');
        }
        guideBtn.textContent = guide.title;
        guideBtn.addEventListener('click', () => {
          openGuide(guide.slug);
          setSidebarOpen(false);
        });

        li.appendChild(guideBtn);
        list.appendChild(li);
      }

      group.appendChild(list);
    }

    dom.sidebarNav.appendChild(group);
  }
}

function renderPillarPills() {
  dom.pillarPills.textContent = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = `pill-btn${state.selectedPillar === '' ? ' active' : ''}`;
  allBtn.textContent = 'Todos os pilares';
  allBtn.addEventListener('click', () => {
    state.selectedPillar = '';
    refreshGuides();
  });
  dom.pillarPills.appendChild(allBtn);

  for (const pillar of state.pillars) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pill-btn${state.selectedPillar === pillar.id ? ' active' : ''}`;
    btn.textContent = pillar.name;
    btn.addEventListener('click', () => {
      state.selectedPillar = state.selectedPillar === pillar.id ? '' : pillar.id;
      refreshGuides();
    });
    dom.pillarPills.appendChild(btn);
  }
}

function renderCatalog() {
  const total = state.filteredGuides.length;
  dom.catalogCount.textContent = `${total} ${total === 1 ? 'guia' : 'guias'}`;

  if (state.selectedPillar) {
    dom.catalogTitle.textContent = getPillarName(state.selectedPillar);
  } else if (state.searchQuery) {
    dom.catalogTitle.textContent = `Resultados para "${state.searchQuery}"`;
  } else {
    dom.catalogTitle.textContent = 'Referência Técnica & Guias';
  }

  dom.guidesGrid.textContent = '';

  if (total === 0) {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'guide-card';

    const title = document.createElement('h2');
    title.textContent = 'Nenhum guia encontrado';

    const desc = document.createElement('p');
    desc.textContent = 'Tente outro termo de busca ou limpe o filtro de pilar.';

    emptyCard.append(title, desc);
    dom.guidesGrid.appendChild(emptyCard);
    return;
  }

  for (const guide of state.filteredGuides) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'guide-card';
    card.addEventListener('click', () => openGuide(guide.slug));

    const top = document.createElement('div');
    top.className = 'guide-card-top';

    const pillarBadge = document.createElement('span');
    pillarBadge.className = 'meta-badge';
    pillarBadge.textContent = getPillarName(guide.pillar);

    const levelBadge = document.createElement('span');
    levelBadge.className = 'meta-badge';
    levelBadge.textContent = guide.level || 'Guia';

    top.append(pillarBadge, levelBadge);

    const body = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = guide.title;

    const summary = document.createElement('p');
    summary.textContent = guide.summary;

    body.append(title, summary);

    const tagsRow = document.createElement('div');
    tagsRow.className = 'tags-row';

    for (const tag of (guide.tags || []).slice(0, 4)) {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = `#${tag}`;
      tagsRow.appendChild(chip);
    }

    card.append(top, body, tagsRow);
    dom.guidesGrid.appendChild(card);
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function createCodeBlock(codeSpec) {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block';

  const header = document.createElement('div');
  header.className = 'code-header';

  const fileLabel = document.createElement('span');
  fileLabel.className = 'code-filename';
  fileLabel.textContent = codeSpec.filename || codeSpec.language || 'código';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'Copiar código';

  const contentText = String(codeSpec.content ?? '');

  copyBtn.addEventListener('click', async () => {
    try {
      await copyTextToClipboard(contentText);
      copyBtn.textContent = 'Copiado!';
      copyBtn.classList.add('copied');
      window.setTimeout(() => {
        copyBtn.textContent = 'Copiar código';
        copyBtn.classList.remove('copied');
      }, 1800);
    } catch {
      copyBtn.textContent = 'Falha ao copiar';
      window.setTimeout(() => {
        copyBtn.textContent = 'Copiar código';
      }, 1800);
    }
  });

  header.append(fileLabel, copyBtn);

  const pre = document.createElement('pre');
  const codeEl = document.createElement('code');
  codeEl.textContent = contentText;
  pre.appendChild(codeEl);

  wrapper.append(header, pre);
  return wrapper;
}

function renderGuideReader(guide) {
  dom.guideReader.textContent = '';

  const topBar = document.createElement('div');
  topBar.className = 'reader-top';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'back-btn';
  backBtn.textContent = '← Voltar para guias';
  backBtn.addEventListener('click', () => {
    state.activeGuide = null;
    syncView();
  });

  const metaGroup = document.createElement('div');
  metaGroup.className = 'reader-meta';

  const pillarBadge = document.createElement('span');
  pillarBadge.className = 'meta-badge';
  pillarBadge.textContent = getPillarName(guide.pillar);
  metaGroup.appendChild(pillarBadge);

  if (guide.level) {
    const levelBadge = document.createElement('span');
    levelBadge.className = 'meta-badge';
    levelBadge.textContent = guide.level;
    metaGroup.appendChild(levelBadge);
  }

  if (guide.readTime) {
    const timeBadge = document.createElement('span');
    timeBadge.className = 'meta-badge';
    timeBadge.textContent = guide.readTime;
    metaGroup.appendChild(timeBadge);
  }

  topBar.append(backBtn, metaGroup);

  const h1 = document.createElement('h1');
  h1.textContent = guide.title;

  const summary = document.createElement('p');
  summary.className = 'guide-summary';
  summary.textContent = guide.summary;

  dom.guideReader.append(topBar, h1, summary);

  for (const section of guide.sections || []) {
    const secEl = document.createElement('section');
    secEl.className = 'guide-section';

    const secTitle = document.createElement('h2');
    secTitle.textContent = section.title;

    const secExpl = document.createElement('p');
    secExpl.textContent = section.explanation;

    secEl.append(secTitle, secExpl);

    if (section.code && typeof section.code === 'object') {
      secEl.appendChild(createCodeBlock(section.code));
    }

    if (section.tip) {
      const tipEl = document.createElement('div');
      tipEl.className = 'tip-box';
      tipEl.textContent = `Dica prática: ${section.tip}`;
      secEl.appendChild(tipEl);
    }

    dom.guideReader.appendChild(secEl);
  }

  if (Array.isArray(guide.checklist) && guide.checklist.length > 0) {
    const checkBox = document.createElement('section');
    checkBox.className = 'checklist-box';

    const checkTitle = document.createElement('h2');
    checkTitle.textContent = 'Checklist rápido';

    const ul = document.createElement('ul');
    for (const item of guide.checklist) {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    }

    checkBox.append(checkTitle, ul);
    dom.guideReader.appendChild(checkBox);
  }
}

function syncView() {
  const isReading = Boolean(state.activeGuide);
  dom.catalogSection.classList.toggle('hidden', isReading);
  dom.guideReader.classList.toggle('hidden', !isReading);

  renderSidebar();
  renderPillarPills();

  if (isReading) {
    renderGuideReader(state.activeGuide);
    document.title = `${state.activeGuide.title} — DevCentral`;
  } else {
    renderCatalog();
    document.title = 'DevCentral — Base de Conhecimento & Código Limpo';
  }
}

async function refreshGuides() {
  hideStatus();

  const params = new URLSearchParams();
  if (state.selectedPillar) {
    params.set('pillar', state.selectedPillar);
  }
  if (state.searchQuery) {
    params.set('q', state.searchQuery);
  }

  const qs = params.toString();
  const url = qs ? `/api/guides?${qs}` : '/api/guides';

  try {
    const data = await apiGet(url);
    state.filteredGuides = Array.isArray(data.guides) ? data.guides : [];
    state.activeGuide = null;
    syncView();
  } catch (err) {
    showStatus(err.message || 'Não foi possível carregar os guias.', { isError: true });
  }
}

async function openGuide(slug) {
  hideStatus();
  try {
    const data = await apiGet(`/api/guides/${encodeURIComponent(slug)}`);
    if (!data?.guide) {
      throw new Error('Guia não encontrado.');
    }
    state.activeGuide = data.guide;
    syncView();
    dom.mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    showStatus(err.message || 'Erro ao abrir o guia.', { isError: true });
  }
}

function bindEvents() {
  dom.themeToggle.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  dom.menuToggle.addEventListener('click', () => {
    const isOpen = !dom.sidebar.classList.contains('open');
    setSidebarOpen(isOpen);
  });

  dom.backdrop.addEventListener('click', () => setSidebarOpen(false));

  dom.brandHome.addEventListener('click', (event) => {
    event.preventDefault();
    state.activeGuide = null;
    state.selectedPillar = '';
    state.searchQuery = '';
    dom.searchInput.value = '';
    dom.clearSearch.classList.add('hidden');
    refreshGuides();
  });

  dom.resetFilters.addEventListener('click', () => {
    state.activeGuide = null;
    state.selectedPillar = '';
    state.searchQuery = '';
    dom.searchInput.value = '';
    dom.clearSearch.classList.add('hidden');
    refreshGuides();
    setSidebarOpen(false);
  });

  let searchTimer = null;
  dom.searchInput.addEventListener('input', () => {
    const val = dom.searchInput.value.trim();
    dom.clearSearch.classList.toggle('hidden', val.length === 0);

    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.searchQuery = val;
      refreshGuides();
    }, 180);
  });

  dom.clearSearch.addEventListener('click', () => {
    dom.searchInput.value = '';
    state.searchQuery = '';
    dom.clearSearch.classList.add('hidden');
    dom.searchInput.focus();
    refreshGuides();
  });
}

async function bootstrap() {
  initTheme();
  bindEvents();

  try {
    const [pillarsRes, guidesRes] = await Promise.all([
      apiGet('/api/pillars'),
      apiGet('/api/guides')
    ]);

    state.pillars = Array.isArray(pillarsRes.pillars) ? pillarsRes.pillars : [];
    state.allGuides = Array.isArray(guidesRes.guides) ? guidesRes.guides : [];
    state.filteredGuides = [...state.allGuides];
    syncView();
  } catch (err) {
    showStatus(
      `Falha ao conectar à API do DevCentral: ${err.message}. Verifique se o servidor está rodando.`,
      { isError: true }
    );
  }
}

bootstrap();