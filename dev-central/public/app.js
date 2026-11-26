const THEME_KEY = 'devcentral.theme';

const PRESETS = {
  blank: {
    html: '<div class="box">\n  <h2>Olá, DevCentral</h2>\n  <p>Edite o HTML, CSS ou JS para ver as mudanças em tempo real.</p>\n</div>',
    css: 'body { font-family: system-ui, sans-serif; padding: 24px; background: #f8fafc; color: #0f172a; }\n.box { padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }',
    js: 'console.log("Playground pronto!");'
  },
  card: {
    html: '<article class="card">\n  <span class="tag">PROJETO</span>\n  <h2>API REST com Node.js</h2>\n  <p>Arquitetura em camadas com validação e rate limiting.</p>\n  <button id="like-btn" type="button">Curtir (0)</button>\n</article>',
    css: 'body { font-family: system-ui, sans-serif; padding: 24px; background: #09090b; color: #fafafa; }\n.card { max-width: 340px; padding: 20px; background: #18181b; border: 1px solid #27272a; border-radius: 10px; }\n.tag { font-size: 11px; font-weight: 700; color: #60a5fa; letter-spacing: 0.06em; }\nh2 { margin: 8px 0 6px; font-size: 1.1rem; }\np { margin: 0 0 14px; color: #a1a1aa; font-size: 0.9rem; }\nbutton { padding: 8px 14px; border: none; border-radius: 6px; background: #2563eb; color: #fff; font-weight: 600; cursor: pointer; }',
    js: 'let count = 0;\nconst btn = document.getElementById("like-btn");\nbtn.addEventListener("click", () => {\n  count += 1;\n  btn.textContent = `Curtir (${count})`;\n  console.log("Total de curtidas:", count);\n});'
  },
  form: {
    html: '<form id="f" class="f">\n  <label>Usuário <input name="user" type="text" required placeholder="dev_pro"></label>\n  <label>Senha <input name="pass" type="password" minlength="6" required></label>\n  <button type="submit">Validar</button>\n</form>',
    css: 'body { font-family: system-ui, sans-serif; padding: 24px; background: #f8fafc; }\n.f { max-width: 300px; display: grid; gap: 12px; background: #fff; padding: 18px; border: 1px solid #e2e8f0; border-radius: 8px; }\nlabel { display: grid; gap: 4px; font-size: 0.85rem; font-weight: 600; }\ninput { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }\nbutton { padding: 9px; border: none; border-radius: 6px; background: #09090b; color: #fff; font-weight: 600; cursor: pointer; }',
    js: 'document.getElementById("f").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const data = Object.fromEntries(new FormData(e.target));\n  console.log("Formulário válido:", data);\n});'
  }
};

const state = {
  mode: 'library', // 'library' | 'guides' | 'playground'
  theme: 'dark',
  searchQuery: '',
  // Biblioteca
  libraryCategories: [],
  allLibraryItems: [],
  filteredLibraryItems: [],
  selectedCategory: '',
  activeLibraryItem: null,
  // Guias
  pillars: [],
  allGuides: [],
  filteredGuides: [],
  selectedPillar: '',
  activeGuide: null
};

let activeController = null;
const sandboxListeners = new Map();

const dom = {
  menuToggle: document.getElementById('menu-toggle'),
  sidebar: document.getElementById('sidebar'),
  backdrop: document.getElementById('sidebar-backdrop'),
  sidebarHeading: document.getElementById('sidebar-heading'),
  sidebarNav: document.getElementById('sidebar-nav'),
  resetFilters: document.getElementById('reset-filters'),
  brandHome: document.getElementById('brand-home'),
  modeTabs: document.querySelectorAll('.mode-tab'),
  searchInput: document.getElementById('search-input'),
  searchKbd: document.getElementById('search-kbd'),
  clearSearch: document.getElementById('clear-search'),
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  themeLabel: document.getElementById('theme-label'),
  statusBanner: document.getElementById('status-banner'),
  listView: document.getElementById('list-view'),
  detailView: document.getElementById('detail-view'),
  sandboxView: document.getElementById('sandbox-view'),
  pageKicker: document.getElementById('page-kicker'),
  pageTitle: document.getElementById('page-title'),
  pageDesc: document.getElementById('page-desc'),
  pageCount: document.getElementById('page-count'),
  filterBar: document.getElementById('filter-bar'),
  itemsGrid: document.getElementById('items-grid'),
  freePlaygroundMount: document.getElementById('free-playground-mount')
};

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  for (const handler of sandboxListeners.values()) {
    handler(event);
  }
});

function getSafeExternalUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return null;
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  state.theme = next;
  document.documentElement.setAttribute('data-theme', next);
  dom.themeIcon.textContent = next === 'light' ? '☾' : '☀';
  dom.themeLabel.textContent = next === 'light' ? 'Escuro' : 'Claro';
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch { /* ignore */ }
}

function initTheme() {
  let saved = '';
  try { saved = localStorage.getItem(THEME_KEY) || ''; } catch { saved = ''; }
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
    return;
  }
  applyTheme('dark');
}

function setSidebarOpen(open) {
  dom.sidebar.classList.toggle('open', open);
  dom.backdrop.classList.toggle('hidden', !open);
  dom.menuToggle.setAttribute('aria-expanded', String(open));
}

function showStatus(msg, isError = false) {
  dom.statusBanner.textContent = msg;
  dom.statusBanner.classList.toggle('error', isError);
  dom.statusBanner.classList.remove('hidden');
}

function hideStatus() {
  dom.statusBanner.textContent = '';
  dom.statusBanner.classList.add('hidden');
}

async function apiGet(url, { signal } = {}) {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 8000);
  const onAbort = () => ctrl.abort();
  if (signal) {
    if (signal.aborted) {
      window.clearTimeout(timer);
      throw new DOMException('Cancelado', 'AbortError');
    }
    signal.addEventListener('abort', onAbort, { once: true });
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
      credentials: 'same-origin'
    });
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(payload?.error?.message || `HTTP ${res.status}`);
    }
    return payload;
  } finally {
    window.clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.className = 'sr-only';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

/* =====================================================================
   COMPONENTE: PLAYGROUND INTERATIVO (HTML / CSS / JS + Preview + Console)
   ===================================================================== */
function createInteractivePlayground(initialCode, { idPrefix = 'pg' } = {}) {
  const code = {
    html: String(initialCode?.html ?? ''),
    css: String(initialCode?.css ?? ''),
    js: String(initialCode?.js ?? '')
  };
  const original = { ...code };
  let activeLang = code.html ? 'html' : code.css ? 'css' : 'js';
  let currentIframe = null;
  let currentRunId = '';
  let debounceTimer = null;

  const shell = document.createElement('div');
  shell.className = 'playground-shell';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'pg-toolbar';

  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'pg-tabs';

  const tabButtons = {};
  ['html', 'css', 'js'].forEach((lang) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pg-tab${lang === activeLang ? ' active' : ''}`;
    btn.textContent = lang.toUpperCase();
    btn.addEventListener('click', () => {
      activeLang = lang;
      textarea.value = code[activeLang];
      Object.entries(tabButtons).forEach(([k, b]) => b.classList.toggle('active', k === lang));
      textarea.focus();
    });
    tabButtons[lang] = btn;
    tabsWrap.appendChild(btn);
  });

  const actions = document.createElement('div');
  actions.className = 'pg-actions';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'pg-btn';
  copyBtn.textContent = 'Copiar aba';
  copyBtn.addEventListener('click', async () => {
    await copyText(code[activeLang]);
    copyBtn.textContent = 'Copiado!';
    window.setTimeout(() => { copyBtn.textContent = 'Copiar aba'; }, 1400);
  });

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'pg-btn';
  resetBtn.textContent = 'Resetar';
  resetBtn.addEventListener('click', () => {
    code.html = original.html;
    code.css = original.css;
    code.js = original.js;
    textarea.value = code[activeLang];
    runPreview();
  });

  const runBtn = document.createElement('button');
  runBtn.type = 'button';
  runBtn.className = 'pg-btn pg-btn-run';
  runBtn.textContent = '▶ Executar';
  runBtn.addEventListener('click', () => runPreview());

  actions.append(copyBtn, resetBtn, runBtn);
  toolbar.append(tabsWrap, actions);

  // Split Pane
  const split = document.createElement('div');
  split.className = 'pg-split';

  const editorPane = document.createElement('div');
  editorPane.className = 'pg-editor-pane';

  const textarea = document.createElement('textarea');
  textarea.className = 'pg-textarea';
  textarea.spellcheck = false;
  textarea.setAttribute('aria-label', 'Editor de código interativo');
  textarea.value = code[activeLang];

  textarea.addEventListener('input', () => {
    code[activeLang] = textarea.value;
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(runPreview, 320);
  });

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = `${textarea.value.slice(0, start)}  ${textarea.value.slice(end)}`;
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      code[activeLang] = textarea.value;
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runPreview();
    }
  });

  editorPane.appendChild(textarea);

  // Preview + Console Pane
  const previewPane = document.createElement('div');
  previewPane.className = 'pg-preview-pane';

  const previewBar = document.createElement('div');
  previewBar.className = 'pg-preview-bar';
  const previewLabel = document.createElement('span');
  previewLabel.textContent = 'PREVIEW AO VIVO (ISOLADO)';
  const shortcutHint = document.createElement('span');
  shortcutHint.textContent = 'Ctrl+Enter para rodar';
  previewBar.append(previewLabel, shortcutHint);

  const iframeHost = document.createElement('div');
  iframeHost.style.display = 'flex';
  iframeHost.style.flex = '1';

  const consoleWrap = document.createElement('div');
  consoleWrap.className = 'pg-console';

  const consoleHead = document.createElement('div');
  consoleHead.className = 'pg-console-head';
  const consoleTitle = document.createElement('span');
  consoleTitle.textContent = 'CONSOLE';
  const clearConsoleBtn = document.createElement('button');
  clearConsoleBtn.type = 'button';
  clearConsoleBtn.className = 'text-btn';
  clearConsoleBtn.textContent = 'Limpar';
  consoleHead.append(consoleTitle, clearConsoleBtn);

  const consoleBody = document.createElement('div');
  consoleBody.className = 'pg-console-body';

  function resetConsole() {
    consoleBody.textContent = '';
    const empty = document.createElement('span');
    empty.className = 'console-empty';
    empty.textContent = 'Nenhuma saída no console ainda.';
    consoleBody.appendChild(empty);
  }

  function appendConsole(level, message) {
    const empty = consoleBody.querySelector('.console-empty');
    if (empty) empty.remove();
    const line = document.createElement('div');
    line.className = `console-line ${level}`;
    line.textContent = `> ${message}`;
    consoleBody.appendChild(line);
    consoleWrap.scrollTop = consoleWrap.scrollHeight;
  }

  clearConsoleBtn.addEventListener('click', resetConsole);
  consoleWrap.append(consoleHead, consoleBody);

  previewPane.append(previewBar, iframeHost, consoleWrap);
  split.append(editorPane, previewPane);
  shell.append(toolbar, split);

  const listenerKey = `${idPrefix}-${Math.random().toString(36).slice(2)}`;

  sandboxListeners.set(listenerKey, (event) => {
    if (!currentIframe || event.source !== currentIframe.contentWindow) return;
    const msg = event.data;
    if (msg.type === 'SANDBOX_READY') {
      currentIframe.contentWindow.postMessage(
        { type: 'RUN_CODE', runId: currentRunId, html: code.html, css: code.css, js: code.js },
        '*'
      );
    } else if (msg.type === 'SANDBOX_LOG' && msg.runId === currentRunId) {
      appendConsole(msg.level || 'log', String(msg.message ?? ''));
    }
  });

  function runPreview() {
    resetConsole();
    currentRunId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    iframeHost.textContent = '';

    const iframe = document.createElement('iframe');
    iframe.className = 'pg-iframe';
    iframe.title = 'Preview isolado do código';
    iframe.setAttribute('sandbox', 'allow-scripts allow-forms');
    iframe.src = '/sandbox.html';
    currentIframe = iframe;
    iframeHost.appendChild(iframe);
  }

  runPreview();

  return {
    element: shell,
    loadPreset(preset) {
      code.html = preset.html;
      code.css = preset.css;
      code.js = preset.js;
      original.html = preset.html;
      original.css = preset.css;
      original.js = preset.js;
      textarea.value = code[activeLang];
      runPreview();
    },
    destroy() {
      sandboxListeners.delete(listenerKey);
    }
  };
}

function createStaticCodeBox(filename, content) {
  const box = document.createElement('div');
  box.className = 'code-box';

  const head = document.createElement('div');
  head.className = 'code-box-head';

  const name = document.createElement('span');
  name.textContent = filename || 'código';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pg-btn';
  btn.textContent = 'Copiar';
  btn.addEventListener('click', async () => {
    await copyText(content);
    btn.textContent = 'Copiado!';
    window.setTimeout(() => { btn.textContent = 'Copiar'; }, 1500);
  });

  head.append(name, btn);

  const pre = document.createElement('pre');
  const codeEl = document.createElement('code');
  codeEl.textContent = content;
  pre.appendChild(codeEl);

  box.append(head, pre);
  return box;
}

/* =====================================================================
   NAVEGAÇÃO LATERAL E RENDERIZAÇÃO DE VIEWS
   ===================================================================== */
let activeDetailPlayground = null;
let freePlaygroundInstance = null;

function cleanupDetailPlayground() {
  if (activeDetailPlayground) {
    activeDetailPlayground.destroy();
    activeDetailPlayground = null;
  }
}

function renderSidebar() {
  dom.sidebarNav.textContent = '';

  if (state.mode === 'guides') {
    dom.sidebarHeading.textContent = 'Pilares & Guias';
    for (const pillar of state.pillars) {
      const group = document.createElement('div');
      group.className = 'nav-group';

      const items = state.allGuides.filter((g) => g.pillar === pillar.id);
      const labelBtn = document.createElement('button');
      labelBtn.type = 'button';
      labelBtn.className = `nav-group-label${!state.activeGuide && state.selectedPillar === pillar.id ? ' active' : ''}`;
      const nameSpan = document.createElement('span');
      nameSpan.textContent = pillar.name;
      const countSpan = document.createElement('span');
      countSpan.textContent = String(items.length);
      labelBtn.append(nameSpan, countSpan);
      labelBtn.addEventListener('click', () => {
        state.activeGuide = null;
        state.selectedPillar = state.selectedPillar === pillar.id ? '' : pillar.id;
        refreshList();
        setSidebarOpen(false);
      });
      group.appendChild(labelBtn);

      if (items.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'nav-list';
        for (const g of items) {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `nav-item-btn${state.activeGuide?.slug === g.slug ? ' active' : ''}`;
          btn.textContent = g.title;
          btn.addEventListener('click', () => {
            openGuide(g.slug);
            setSidebarOpen(false);
          });
          li.appendChild(btn);
          ul.appendChild(li);
        }
        group.appendChild(ul);
      }

      dom.sidebarNav.appendChild(group);
    }
    return;
  }

  // Modo Biblioteca ou Playground mostra categorias da Biblioteca
  dom.sidebarHeading.textContent = 'Biblioteca de Códigos';
  for (const cat of state.libraryCategories) {
    const group = document.createElement('div');
    group.className = 'nav-group';

    const items = state.allLibraryItems.filter((it) => it.category === cat.name);
    const labelBtn = document.createElement('button');
    labelBtn.type = 'button';
    labelBtn.className = `nav-group-label${state.mode === 'library' && !state.activeLibraryItem && state.selectedCategory === cat.name ? ' active' : ''}`;
    const nameSpan = document.createElement('span');
    nameSpan.textContent = cat.name;
    const countSpan = document.createElement('span');
    countSpan.textContent = String(items.length);
    labelBtn.append(nameSpan, countSpan);
    labelBtn.addEventListener('click', () => {
      state.mode = 'library';
      state.activeLibraryItem = null;
      state.selectedCategory = state.selectedCategory === cat.name ? '' : cat.name;
      syncModeTabs();
      refreshList();
      setSidebarOpen(false);
    });
    group.appendChild(labelBtn);

    const ul = document.createElement('ul');
    ul.className = 'nav-list';
    for (const item of items) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `nav-item-btn${state.mode === 'library' && state.activeLibraryItem?.slug === item.slug ? ' active' : ''}`;
      btn.textContent = item.title;
      btn.addEventListener('click', () => {
        state.mode = 'library';
        syncModeTabs();
        openLibraryItem(item.slug);
        setSidebarOpen(false);
      });
      li.appendChild(btn);
      ul.appendChild(li);
    }
    group.appendChild(ul);
    dom.sidebarNav.appendChild(group);
  }
}

function renderListView() {
  dom.filterBar.textContent = '';
  dom.itemsGrid.textContent = '';

  const isLibrary = state.mode === 'library';
  dom.pageKicker.textContent = isLibrary ? 'BIBLIOTECA DE CÓDIGOS' : 'GUIAS & FUNDAMENTOS';
  dom.pageTitle.textContent = isLibrary
    ? (state.selectedCategory || 'Referência Interativa de Códigos')
    : (state.selectedPillar
        ? (state.pillars.find((p) => p.id === state.selectedPillar)?.name || 'Guias')
        : 'Guias & Arquitetura');
  dom.pageDesc.textContent = isLibrary
    ? 'Explicações diretas, tabelas de comandos e exemplos editáveis com preview ao vivo.'
    : 'Fundamentos, hábitos de engenharia profissional, boas práticas e curadoria de fontes.';

  // Filtros
  const allChip = document.createElement('button');
  allChip.type = 'button';
  allChip.className = `filter-chip${(isLibrary ? !state.selectedCategory : !state.selectedPillar) ? ' active' : ''}`;
  allChip.textContent = 'Todos';
  allChip.addEventListener('click', () => {
    if (isLibrary) state.selectedCategory = '';
    else state.selectedPillar = '';
    refreshList();
  });
  dom.filterBar.appendChild(allChip);

  if (isLibrary) {
    for (const cat of state.libraryCategories) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `filter-chip${state.selectedCategory === cat.name ? ' active' : ''}`;
      chip.textContent = cat.name;
      chip.addEventListener('click', () => {
        state.selectedCategory = state.selectedCategory === cat.name ? '' : cat.name;
        refreshList();
      });
      dom.filterBar.appendChild(chip);
    }
  } else {
    for (const pillar of state.pillars) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `filter-chip${state.selectedPillar === pillar.id ? ' active' : ''}`;
      chip.textContent = pillar.name;
      chip.addEventListener('click', () => {
        state.selectedPillar = state.selectedPillar === pillar.id ? '' : pillar.id;
        refreshList();
      });
      dom.filterBar.appendChild(chip);
    }
  }

  const list = isLibrary ? state.filteredLibraryItems : state.filteredGuides;
  dom.pageCount.textContent = `${list.length} ${list.length === 1 ? 'item' : 'itens'}`;

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'callout';
    empty.textContent = 'Nenhum conteúdo encontrado para este filtro ou termo de busca.';
    dom.itemsGrid.appendChild(empty);
    return;
  }

  for (const entry of list) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'doc-card';
    card.addEventListener('click', () => {
      if (isLibrary) openLibraryItem(entry.slug);
      else openGuide(entry.slug);
    });

    const head = document.createElement('div');
    head.className = 'doc-card-head';

    const leftBadge = document.createElement('span');
    leftBadge.className = 'badge';
    leftBadge.textContent = isLibrary
      ? entry.category
      : (state.pillars.find((p) => p.id === entry.pillar)?.name || entry.pillar);

    const rightBadge = document.createElement('span');
    if (isLibrary && entry.runnable) {
      rightBadge.className = 'badge badge-live';
      rightBadge.textContent = '▶ Interativo';
    } else {
      rightBadge.className = 'badge';
      rightBadge.textContent = isLibrary ? (entry.language || 'Código') : (entry.level || 'Guia');
    }

    head.append(leftBadge, rightBadge);

    const body = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = entry.title;
    const p = document.createElement('p');
    p.textContent = entry.summary;
    body.append(h2, p);

    const tagsRow = document.createElement('div');
    tagsRow.className = 'tags-row';
    for (const tag of (entry.tags || []).slice(0, 4)) {
      const t = document.createElement('span');
      t.className = 'tag-item';
      t.textContent = `#${tag}`;
      tagsRow.appendChild(t);
    }

    card.append(head, body, tagsRow);
    dom.itemsGrid.appendChild(card);
  }
}

function renderLibraryDetail(item) {
  cleanupDetailPlayground();
  dom.detailView.textContent = '';

  const top = document.createElement('div');
  top.className = 'detail-top';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'btn-ghost';
  backBtn.textContent = '← Voltar para Biblioteca';
  backBtn.addEventListener('click', () => {
    state.activeLibraryItem = null;
    syncView();
  });

  const meta = document.createElement('div');
  meta.className = 'detail-meta';
  const catBadge = document.createElement('span');
  catBadge.className = 'badge';
  catBadge.textContent = item.category;
  meta.appendChild(catBadge);

  if (item.runnable) {
    const liveBadge = document.createElement('span');
    liveBadge.className = 'badge badge-live';
    liveBadge.textContent = '▶ Editor + Preview ao vivo';
    meta.appendChild(liveBadge);
  }

  top.append(backBtn, meta);

  const h1 = document.createElement('h1');
  h1.className = 'detail-title';
  h1.textContent = item.title;

  const lead = document.createElement('p');
  lead.className = 'detail-lead';
  lead.textContent = item.explanation || item.summary;

  dom.detailView.append(top, h1, lead);

  // Playground ao vivo ou Bloco estático
  if (item.runnable && item.playground) {
    const labBlock = document.createElement('section');
    labBlock.className = 'detail-block';
    const labTitle = document.createElement('h2');
    labTitle.textContent = 'Laboratório Interativo — Edite e veja o resultado na hora';
    activeDetailPlayground = createInteractivePlayground(item.playground, { idPrefix: item.slug });
    labBlock.append(labTitle, activeDetailPlayground.element);
    dom.detailView.appendChild(labBlock);
  } else if (item.codeSnippet?.content) {
    const codeBlock = document.createElement('section');
    codeBlock.className = 'detail-block';
    const codeTitle = document.createElement('h2');
    codeTitle.textContent = 'Exemplo Prático';
    codeBlock.append(codeTitle, createStaticCodeBox(item.codeSnippet.filename, item.codeSnippet.content));
    dom.detailView.appendChild(codeBlock);
  }

  // Sugestões do que testar
  if (Array.isArray(item.experiments) && item.experiments.length > 0) {
    const expBlock = document.createElement('section');
    expBlock.className = 'detail-block';
    const box = document.createElement('div');
    box.className = 'callout';
    const h3 = document.createElement('h3');
    h3.textContent = 'O que testar agora para fixar o conteúdo';
    const ul = document.createElement('ul');
    for (const tip of item.experiments) {
      const li = document.createElement('li');
      li.textContent = tip;
      ul.appendChild(li);
    }
    box.append(h3, ul);
    expBlock.appendChild(box);
    dom.detailView.appendChild(expBlock);
  }

  // Tabela completa de Tipos, Atributos e Comandos
  if (Array.isArray(item.references) && item.references.length > 0) {
    const refBlock = document.createElement('section');
    refBlock.className = 'detail-block';
    const refTitle = document.createElement('h2');
    refTitle.textContent = 'Tabela de Tipos, Atributos & Comandos';

    const wrap = document.createElement('div');
    wrap.className = 'ref-table-wrap';
    const table = document.createElement('table');
    table.className = 'ref-table';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['Grupo', 'Comando / Sintaxe', 'O que faz'].forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = document.createElement('tbody');
    for (const row of item.references) {
      const tr = document.createElement('tr');
      const tdGroup = document.createElement('td');
      tdGroup.textContent = row.group || 'Geral';

      const tdSyntax = document.createElement('td');
      const code = document.createElement('code');
      code.className = 'ref-code';
      code.textContent = row.syntax || '';
      tdSyntax.appendChild(code);

      const tdDesc = document.createElement('td');
      tdDesc.textContent = row.description || '';

      tr.append(tdGroup, tdSyntax, tdDesc);
      tbody.appendChild(tr);
    }

    table.append(thead, tbody);
    wrap.appendChild(table);
    refBlock.append(refTitle, wrap);
    dom.detailView.appendChild(refBlock);
  }
}

function renderGuideDetail(guide) {
  cleanupDetailPlayground();
  dom.detailView.textContent = '';

  const top = document.createElement('div');
  top.className = 'detail-top';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'btn-ghost';
  backBtn.textContent = '← Voltar para Guias';
  backBtn.addEventListener('click', () => {
    state.activeGuide = null;
    syncView();
  });

  const meta = document.createElement('div');
  meta.className = 'detail-meta';
  [
    state.pillars.find((p) => p.id === guide.pillar)?.name || guide.pillar,
    guide.level,
    guide.readTime
  ]
    .filter(Boolean)
    .forEach((label) => {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = label;
      meta.appendChild(b);
    });

  top.append(backBtn, meta);

  const h1 = document.createElement('h1');
  h1.className = 'detail-title';
  h1.textContent = guide.title;

  const lead = document.createElement('p');
  lead.className = 'detail-lead';
  lead.textContent = guide.summary;

  dom.detailView.append(top, h1, lead);

  for (const sec of guide.sections || []) {
    const block = document.createElement('section');
    block.className = 'detail-block';
    const h2 = document.createElement('h2');
    h2.textContent = sec.title;
    const p = document.createElement('p');
    p.className = 'detail-lead';
    p.textContent = sec.explanation;
    block.append(h2, p);

    if (sec.code?.content) {
      block.appendChild(createStaticCodeBox(sec.code.filename || sec.code.language, sec.code.content));
    }
    if (sec.tip) {
      const tip = document.createElement('div');
      tip.className = 'callout';
      tip.textContent = `Dica prática: ${sec.tip}`;
      block.appendChild(tip);
    }
    dom.detailView.appendChild(block);
  }

  if (Array.isArray(guide.resources) && guide.resources.length > 0) {
    const resBlock = document.createElement('section');
    resBlock.className = 'detail-block';
    const h2 = document.createElement('h2');
    h2.textContent = 'Referências Externas Recomendadas';
    const grid = document.createElement('div');
    grid.className = 'resources-grid';

    for (const r of guide.resources) {
      const safeUrl = getSafeExternalUrl(r.url);
      if (!safeUrl) continue;
      const a = document.createElement('a');
      a.className = 'resource-link';
      a.href = safeUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const strong = document.createElement('strong');
      strong.textContent = `${r.name} ↗`;
      const span = document.createElement('span');
      span.textContent = r.description || r.category || '';
      a.append(strong, span);
      grid.appendChild(a);
    }

    if (grid.childElementCount > 0) {
      resBlock.append(h2, grid);
      dom.detailView.appendChild(resBlock);
    }
  }

  if (Array.isArray(guide.checklist) && guide.checklist.length > 0) {
    const checkBlock = document.createElement('section');
    checkBlock.className = 'detail-block';
    const box = document.createElement('div');
    box.className = 'callout';
    const h3 = document.createElement('h3');
    h3.textContent = 'Checklist de Engenharia';
    const ul = document.createElement('ul');
    for (const item of guide.checklist) {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    }
    box.append(h3, ul);
    checkBlock.appendChild(box);
    dom.detailView.appendChild(checkBlock);
  }
}

function syncModeTabs() {
  dom.modeTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.mode === state.mode);
  });
}

function syncView() {
  syncModeTabs();
  renderSidebar();

  const isFreeSandbox = state.mode === 'playground';
  const isDetail =
    (state.mode === 'library' && Boolean(state.activeLibraryItem)) ||
    (state.mode === 'guides' && Boolean(state.activeGuide));

  dom.sandboxView.classList.toggle('hidden', !isFreeSandbox);
  dom.detailView.classList.toggle('hidden', !isDetail || isFreeSandbox);
  dom.listView.classList.toggle('hidden', isDetail || isFreeSandbox);

  if (isFreeSandbox) {
    if (!freePlaygroundInstance) {
      freePlaygroundInstance = createInteractivePlayground(PRESETS.card, { idPrefix: 'free' });
      dom.freePlaygroundMount.textContent = '';
      dom.freePlaygroundMount.appendChild(freePlaygroundInstance.element);
    }
    document.title = 'Playground Livre — DevCentral';
    return;
  }

  if (isDetail) {
    if (state.mode === 'library') {
      renderLibraryDetail(state.activeLibraryItem);
      document.title = `${state.activeLibraryItem.title} — DevCentral`;
    } else {
      renderGuideDetail(state.activeGuide);
      document.title = `${state.activeGuide.title} — DevCentral`;
    }
    return;
  }

  cleanupDetailPlayground();
  renderListView();
  document.title = 'DevCentral — Documentação & Laboratório Interativo';
}

/* =====================================================================
   CARREGAMENTO DE DADOS
   ===================================================================== */
async function refreshList() {
  hideStatus();
  if (activeController) activeController.abort();
  activeController = new AbortController();

  const params = new URLSearchParams();
  if (state.searchQuery) params.set('q', state.searchQuery);

  try {
    if (state.mode === 'library') {
      if (state.selectedCategory) params.set('category', state.selectedCategory);
      const url = params.toString() ? `/api/library?${params}` : '/api/library';
      const data = await apiGet(url, { signal: activeController.signal });
      state.filteredLibraryItems = Array.isArray(data.items) ? data.items : [];
      state.activeLibraryItem = null;
    } else if (state.mode === 'guides') {
      if (state.selectedPillar) params.set('pillar', state.selectedPillar);
      const url = params.toString() ? `/api/guides?${params}` : '/api/guides';
      const data = await apiGet(url, { signal: activeController.signal });
      state.filteredGuides = Array.isArray(data.guides) ? data.guides : [];
      state.activeGuide = null;
    }
    syncView();
  } catch (err) {
    if (err.name === 'AbortError') return;
    showStatus(err.message || 'Erro ao carregar conteúdo.', true);
  }
}

async function openLibraryItem(slug) {
  hideStatus();
  try {
    const data = await apiGet(`/api/library/${encodeURIComponent(slug)}`);
    state.activeLibraryItem = data.item;
    syncView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showStatus(err.message || 'Erro ao abrir item da biblioteca.', true);
  }
}

async function openGuide(slug) {
  hideStatus();
  try {
    const data = await apiGet(`/api/guides/${encodeURIComponent(slug)}`);
    state.activeGuide = data.guide;
    syncView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showStatus(err.message || 'Erro ao abrir guia.', true);
  }
}

function updateSearchUi() {
  const hasVal = dom.searchInput.value.length > 0;
  dom.clearSearch.classList.toggle('hidden', !hasVal);
  dom.searchKbd.classList.toggle('hidden', hasVal);
}

function bindEvents() {
  dom.themeToggle.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  dom.menuToggle.addEventListener('click', () => {
    setSidebarOpen(!dom.sidebar.classList.contains('open'));
  });
  dom.backdrop.addEventListener('click', () => setSidebarOpen(false));

  dom.modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      state.mode = tab.dataset.mode;
      if (state.mode === 'playground') {
        syncView();
      } else {
        refreshList();
      }
    });
  });

  dom.brandHome.addEventListener('click', (e) => {
    e.preventDefault();
    state.mode = 'library';
    state.selectedCategory = '';
    state.activeLibraryItem = null;
    state.searchQuery = '';
    dom.searchInput.value = '';
    updateSearchUi();
    refreshList();
  });

  dom.resetFilters.addEventListener('click', () => {
    state.selectedCategory = '';
    state.selectedPillar = '';
    state.activeLibraryItem = null;
    state.activeGuide = null;
    state.searchQuery = '';
    dom.searchInput.value = '';
    updateSearchUi();
    if (state.mode === 'playground') state.mode = 'library';
    refreshList();
    setSidebarOpen(false);
  });

  let searchTimer = null;
  dom.searchInput.addEventListener('input', () => {
    updateSearchUi();
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.searchQuery = dom.searchInput.value.trim();
      if (state.mode === 'playground') state.mode = 'library';
      refreshList();
    }, 180);
  });

  dom.clearSearch.addEventListener('click', () => {
    dom.searchInput.value = '';
    state.searchQuery = '';
    updateSearchUi();
    dom.searchInput.focus();
    refreshList();
  });

  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = PRESETS[btn.dataset.preset];
      if (preset && freePlaygroundInstance) {
        freePlaygroundInstance.loadPreset(preset);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const el = e.target;
    const isInput = el instanceof HTMLElement &&
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

    if (e.key === '/' && !isInput) {
      e.preventDefault();
      dom.searchInput.focus();
      dom.searchInput.select();
    } else if (e.key === 'Escape') {
      if (dom.sidebar.classList.contains('open')) {
        setSidebarOpen(false);
      } else if (state.mode === 'library' && state.activeLibraryItem) {
        state.activeLibraryItem = null;
        syncView();
      } else if (state.mode === 'guides' && state.activeGuide) {
        state.activeGuide = null;
        syncView();
      }
    }
  });
}

async function bootstrap() {
  initTheme();
  updateSearchUi();
  bindEvents();

  try {
    const [libraryRes, pillarsRes, guidesRes] = await Promise.all([
      apiGet('/api/library'),
      apiGet('/api/pillars'),
      apiGet('/api/guides')
    ]);

    state.libraryCategories = Array.isArray(libraryRes.categories) ? libraryRes.categories : [];
    state.allLibraryItems = Array.isArray(libraryRes.items) ? libraryRes.items : [];
    state.filteredLibraryItems = [...state.allLibraryItems];

    state.pillars = Array.isArray(pillarsRes.pillars) ? pillarsRes.pillars : [];
    state.allGuides = Array.isArray(guidesRes.guides) ? guidesRes.guides : [];
    state.filteredGuides = [...state.allGuides];

    syncView();
  } catch (err) {
    showStatus(`Erro ao conectar ao DevCentral: ${err.message}`, true);
  }
}

bootstrap();

// Tabela completa de Tipos, Atributos e Comandos com filtro rápido
  if (Array.isArray(item.references) && item.references.length > 0) {
    const refBlock = document.createElement('section');
    refBlock.className = 'detail-block';

    const refHeader = document.createElement('div');
    refHeader.className = 'ref-header';

    const refTitle = document.createElement('h2');
    refTitle.textContent = `Tabela de Tipos, Atributos & Comandos (${item.references.length})`;

    const filterInput = document.createElement('input');
    filterInput.type = 'search';
    filterInput.className = 'ref-filter-input';
    filterInput.placeholder = 'Filtrar nesta tabela...';
    filterInput.setAttribute('aria-label', 'Filtrar comandos desta tabela');

    refHeader.append(refTitle, filterInput);

    const wrap = document.createElement('div');
    wrap.className = 'ref-table-wrap';
    const table = document.createElement('table');
    table.className = 'ref-table';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['Grupo', 'Comando / Sintaxe', 'O que faz'].forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = document.createElement('tbody');

    function renderRows(term = '') {
      tbody.textContent = '';
      const q = term.trim().toLowerCase();
      const visible = item.references.filter((row) => {
        if (!q) return true;
        return `${row.group || ''} ${row.syntax || ''} ${row.description || ''}`
          .toLowerCase()
          .includes(q);
      });

      if (visible.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 3;
        td.textContent = 'Nenhum comando encontrado para esse filtro.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      for (const row of visible) {
        const tr = document.createElement('tr');
        const tdGroup = document.createElement('td');
        tdGroup.textContent = row.group || 'Geral';

        const tdSyntax = document.createElement('td');
        const code = document.createElement('code');
        code.className = 'ref-code';
        code.textContent = row.syntax || '';
        tdSyntax.appendChild(code);

        const tdDesc = document.createElement('td');
        tdDesc.textContent = row.description || '';

        tr.append(tdGroup, tdSyntax, tdDesc);
        tbody.appendChild(tr);
      }
    }

    filterInput.addEventListener('input', () => renderRows(filterInput.value));
    renderRows();

    table.append(thead, tbody);
    wrap.appendChild(table);
    refBlock.append(refHeader, wrap);
    dom.detailView.appendChild(refBlock);
  }