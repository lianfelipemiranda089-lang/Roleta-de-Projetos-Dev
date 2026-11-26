import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LIBRARY_DIR = path.join(ROOT_DIR, 'src', 'data', 'library');
const GUIDES_DIR = path.join(ROOT_DIR, 'src', 'data', 'guides');
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LIBRARY_MODULES = [
  /* =====================================================================
     1. HTML INPUTS COMPLETO (TODOS OS 22 TIPOS + 12 ATRIBUTOS)
     ===================================================================== */
  {
    slug: 'html-inputs',
    title: 'HTML Inputs: Todos os 22 Tipos e Atributos',
    category: 'HTML',
    language: 'HTML / CSS / JS',
    runnable: true,
    summary: 'Catálogo completo dos 22 tipos oficiais de <input> e seus atributos de controle, validação nativa e acessibilidade.',
    explanation: 'A tag <input> sozinha cria uma caixa de texto simples (type="text"). Alterando apenas o atributo type, ela se transforma em 22 controles diferentes: senhas, calendários, seletores de cor, uploads, sliders e botões. Combinando com atributos como required, min, max, step, pattern e readonly, você controla totalmente o comportamento sem precisar reinventar validação manual.',
    tags: ['html', 'input', 'formularios', 'checkbox', 'radio', 'password', 'email', 'file', 'validacao'],
    references: [
      { group: 'Texto & Dados', syntax: 'type="text"', description: 'Caixa de texto comum de linha única (padrão do <input> sozinho).' },
      { group: 'Texto & Dados', syntax: 'type="password"', description: 'Oculta os caracteres digitados com bolinhas ou asteriscos.' },
      { group: 'Texto & Dados', syntax: 'type="email"', description: 'Valida formato de e-mail (@) e abre teclado específico no celular.' },
      { group: 'Texto & Dados', syntax: 'type="number"', description: 'Aceita números e exibe setas de incremento; usa min, max e step.' },
      { group: 'Texto & Dados', syntax: 'type="tel"', description: 'Abre teclado numérico em celulares (não restringe símbolos como + e -).' },
      { group: 'Texto & Dados', syntax: 'type="url"', description: 'Valida se o valor é um endereço web completo (https://...).' },
      { group: 'Texto & Dados', syntax: 'type="search"', description: 'Campo de pesquisa com botão rápido de limpar na maioria dos navegadores.' },
      { group: 'Seleção & Visual', syntax: 'type="checkbox"', description: 'Caixa de marcação independente; permite selecionar várias opções.' },
      { group: 'Seleção & Visual', syntax: 'type="radio"', description: 'Escolha única dentro de um grupo com o mesmo atributo name.' },
      { group: 'Seleção & Visual', syntax: 'type="range"', description: 'Barra deslizante (slider) para valores contínuos como volume ou preço.' },
      { group: 'Seleção & Visual', syntax: 'type="color"', description: 'Seletor visual de cor que retorna código hexadecimal (#rrggbb).' },
      { group: 'Datas & Horas', syntax: 'type="date"', description: 'Calendário nativo para dia, mês e ano (valor YYYY-MM-DD).' },
      { group: 'Datas & Horas', syntax: 'type="time"', description: 'Seletor de hora e minuto (HH:MM).' },
      { group: 'Datas & Horas', syntax: 'type="datetime-local"', description: 'Combina calendário e relógio no fuso horário do dispositivo.' },
      { group: 'Datas & Horas', syntax: 'type="month"', description: 'Seleciona apenas mês e ano (útil para validade de cartão).' },
      { group: 'Datas & Horas', syntax: 'type="week"', description: 'Seleciona uma semana específica do ano (ex.: 2026-W42).' },
      { group: 'Arquivos & Ocultos', syntax: 'type="file"', description: 'Abre o seletor de arquivos do sistema; combina com accept e multiple.' },
      { group: 'Arquivos & Ocultos', syntax: 'type="hidden"', description: 'Campo invisível que envia metadados (como ID ou token) no form.' },
      { group: 'Botões', syntax: 'type="submit"', description: 'Botão que valida e envia todos os dados do <form>.' },
      { group: 'Botões', syntax: 'type="reset"', description: 'Restaura todos os campos do <form> para o valor inicial.' },
      { group: 'Botões', syntax: 'type="button"', description: 'Botão clicável sem ação padrão, controlado via JavaScript.' },
      { group: 'Botões', syntax: 'type="image"', description: 'Atua como submit usando uma imagem (src e alt) no lugar do botão.' },
      { group: 'Atributos', syntax: 'placeholder="..."', description: 'Texto de dica cinza dentro do campo (não substitui o <label>).' },
      { group: 'Atributos', syntax: 'required', description: 'Impede o envio do formulário se o campo estiver vazio.' },
      { group: 'Atributos', syntax: 'disabled', description: 'Desabilita interação e exclui o campo dos dados enviados.' },
      { group: 'Atributos', syntax: 'readonly', description: 'Permite ler e copiar o valor, bloqueia edição, mas envia no form.' },
      { group: 'Atributos', syntax: 'checked', description: 'Faz checkbox ou radio iniciar já marcado.' },
      { group: 'Atributos', syntax: 'min / max / step', description: 'Define mínimo, máximo e salto em number, range e datas.' },
      { group: 'Atributos', syntax: 'minlength / maxlength', description: 'Define tamanho mínimo e máximo de caracteres aceitos.' },
      { group: 'Atributos', syntax: 'pattern="regex"', description: 'Valida o texto contra uma expressão regular nativa.' },
      { group: 'Atributos', syntax: 'multiple', description: 'Permite escolher vários arquivos (file) ou e-mails (email).' },
      { group: 'Atributos', syntax: 'accept="image/*,.pdf"', description: 'Filtra quais tipos de arquivo podem ser selecionados no type="file".' },
      { group: 'Atributos', syntax: 'autocomplete="email"', description: 'Orienta o preenchimento automático do navegador.' },
      { group: 'Atributos', syntax: 'value="..."', description: 'Define o valor inicial do campo ou o texto de um botão input.' }
    ],
    playground: {
      html: `<form id="inputs-lab" class="lab">
  <h2>Laboratório de Inputs</h2>

  <div class="grid">
    <label>Texto (text)
      <input name="nome" type="text" placeholder="Seu nome" minlength="2" required>
    </label>
    <label>Senha (password)
      <input name="senha" type="password" value="segredo123" minlength="6" required>
    </label>
    <label>E-mail (email)
      <input name="email" type="email" placeholder="dev@site.com" required>
    </label>
    <label>Número (number 18-99)
      <input name="idade" type="number" min="18" max="99" step="1" value="25">
    </label>
    <label>Data (date)
      <input name="nascimento" type="date" value="2000-05-15">
    </label>
    <label>Cor (color)
      <input id="cor" name="cor" type="color" value="#2563eb">
    </label>
  </div>

  <label>Volume (range): <strong id="vol-out">60</strong>%
    <input id="vol" name="volume" type="range" min="0" max="100" step="5" value="60">
  </label>

  <fieldset class="group">
    <legend>Plano (radio — escolha única)</legend>
    <label class="inline"><input type="radio" name="plano" value="free" checked> Gratuito</label>
    <label class="inline"><input type="radio" name="plano" value="pro"> Profissional</label>
  </fieldset>

  <label class="inline">
    <input type="checkbox" name="termos" checked required> Aceito os termos (checkbox)
  </label>

  <div class="actions">
    <input type="submit" value="Enviar e inspecionar">
    <input type="reset" value="Resetar">
  </div>
</form>`,
      css: `body { font-family: system-ui, sans-serif; padding: 18px; background: #f8fafc; color: #0f172a; }
.lab { max-width: 520px; display: grid; gap: 12px; background: #fff; padding: 18px; border: 1px solid #e2e8f0; border-radius: 10px; }
h2 { margin: 0; font-size: 1.05rem; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
label { display: grid; gap: 4px; font-size: 0.82rem; font-weight: 600; color: #334155; }
label.inline { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; margin-right: 12px; }
input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="reset"]) {
  padding: 7px 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.88rem;
}
input[type="color"] { height: 34px; padding: 2px; cursor: pointer; }
fieldset.group { border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; margin: 0; }
legend { font-size: 0.78rem; color: #64748b; padding: 0 4px; }
.actions { display: flex; gap: 8px; }
input[type="submit"] { flex: 1; padding: 9px; border: none; border-radius: 6px; background: #2563eb; color: #fff; font-weight: 600; cursor: pointer; }
input[type="reset"] { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f1f5f9; cursor: pointer; }`,
      js: `const form = document.getElementById('inputs-lab');
const vol = document.getElementById('vol');
const volOut = document.getElementById('vol-out');
const cor = document.getElementById('cor');

vol.addEventListener('input', () => { volOut.textContent = vol.value; });
cor.addEventListener('input', () => {
  form.querySelector('input[type="submit"]').style.background = cor.value;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.termos = form.elements.termos.checked;
  console.log('Dados coletados:', payload);
});`
    },
    experiments: [
      'Troque type="password" por type="text" para visualizar a senha digitada.',
      'Adicione disabled ou readonly no campo idade e observe no Console qual deles continua sendo enviado.',
      'Troque type="date" por type="datetime-local" ou type="month" e veja o seletor mudar imediatamente.'
    ]
  },

  /* =====================================================================
     2. HTML TAGS ESSENCIAIS, SEMÂNTICA E COMPONENTES NATIVOS
     ===================================================================== */
  {
    slug: 'html-tags-essenciais',
    title: 'HTML Tags Essenciais: Semântica, Links, Mídia e Modais',
    category: 'HTML',
    language: 'HTML / CSS / JS',
    runnable: true,
    summary: 'As tags mais usadas para estruturar páginas profissionais, criar menus, acordeões nativos, selects, botões e modais sem bibliotecas.',
    explanation: 'Usar a tag certa para cada função melhora SEO, acessibilidade (leitores de tela e teclado) e reduz muito código JavaScript. Tags nativas modernas como <details>, <dialog>, <select> e <button> já trazem comportamento pronto de fábrica.',
    tags: ['html', 'semantica', 'tags', 'button', 'select', 'details', 'dialog', 'links'],
    references: [
      { group: 'Estrutura', syntax: '<header> / <nav> / <main> / <footer>', description: 'Delimitam cabeçalho, navegação, conteúdo principal e rodapé.' },
      { group: 'Estrutura', syntax: '<section> / <article> / <aside>', description: 'Agrupam blocos temáticos, conteúdos independentes e barras laterais.' },
      { group: 'Texto', syntax: '<h1> até <h6> / <p> / <strong> / <em>', description: 'Hierarquia de títulos, parágrafos, destaque forte e ênfase.' },
      { group: 'Links', syntax: '<a href="url" target="_blank" rel="noopener noreferrer">', description: 'Abre link externo em nova aba com proteção contra tabnabbing.' },
      { group: 'Links', syntax: '<a href="arquivo.pdf" download>', description: 'Força o download do arquivo em vez de apenas abrir no navegador.' },
      { group: 'Formulário', syntax: '<select> + <option> + <optgroup>', description: 'Cria menus suspensos (dropdown) com opções agrupadas.' },
      { group: 'Formulário', syntax: '<textarea rows="4">', description: 'Campo de texto de múltiplas linhas (comentários, descrições).' },
      { group: 'Botão', syntax: '<button type="button | submit | reset">', description: 'Mais flexível que <input>; aceita ícones e textos internos. Defina type="button" fora de envios.' },
      { group: 'Interativo Nativo', syntax: '<details> + <summary>', description: 'Cria acordeão (abrir/fechar) 100% nativo sem nenhuma linha de JS.' },
      { group: 'Interativo Nativo', syntax: '<dialog> + showModal()', description: 'Cria janela modal nativa com fundo escurecido (::backdrop) e fechamento via Esc.' },
      { group: 'Mídia', syntax: '<img src="..." alt="..." loading="lazy">', description: 'Exibe imagem com descrição acessível e carregamento sob demanda.' },
      { group: 'Progresso', syntax: '<progress value="70" max="100">', description: 'Barra de progresso nativa controlada por value e max.' }
    ],
    playground: {
      html: `<main class="page">
  <header>
    <h1>Componentes Nativos HTML5</h1>
    <p>Tudo abaixo funciona com semântica real e quase zero JavaScript.</p>
  </header>

  <details open>
    <summary>Clique para abrir/fechar (tag &lt;details&gt; sem JS)</summary>
    <p>O elemento &lt;details&gt; resolve FAQs e menus expansíveis nativamente.</p>
  </details>

  <label class="field">
    Escolha uma stack (&lt;select&gt;):
    <select id="stack">
      <optgroup label="Front-end">
        <option value="HTML + CSS">HTML + CSS</option>
        <option value="JavaScript">JavaScript Moderno</option>
      </optgroup>
      <optgroup label="Back-end">
        <option value="Node.js">Node.js + Express</option>
        <option value="PostgreSQL">PostgreSQL</option>
      </optgroup>
    </select>
  </label>

  <label class="field">
    Progresso do curso (&lt;progress&gt;):
    <progress id="prog" value="65" max="100"></progress>
  </label>

  <button id="open-modal" type="button">Abrir Modal Nativo (&lt;dialog&gt;)</button>

  <dialog id="meu-modal">
    <h3>Modal 100% Nativo</h3>
    <p>Aperte ESC ou clique no botão abaixo para fechar.</p>
    <button id="close-modal" type="button">Fechar</button>
  </dialog>
</main>`,
      css: `body { font-family: system-ui, sans-serif; padding: 18px; background: #f8fafc; color: #0f172a; }
.page { max-width: 460px; display: grid; gap: 14px; background: #fff; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; }
h1 { margin: 0; font-size: 1.15rem; }
p { margin: 4px 0 0; font-size: 0.88rem; color: #475569; }
details { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; background: #f8fafc; }
summary { font-weight: 600; cursor: pointer; font-size: 0.88rem; }
.field { display: grid; gap: 6px; font-size: 0.84rem; font-weight: 600; }
select { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; }
progress { width: 100%; height: 14px; }
button { padding: 9px 14px; border: none; border-radius: 6px; background: #18181b; color: #fff; font-weight: 600; cursor: pointer; }
dialog { border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px; max-width: 320px; }
dialog::backdrop { background: rgba(15, 23, 42, 0.55); }`,
      js: `const modal = document.getElementById('meu-modal');
document.getElementById('open-modal').addEventListener('click', () => modal.showModal());
document.getElementById('close-modal').addEventListener('click', () => modal.close());

document.getElementById('stack').addEventListener('change', (e) => {
  console.log('Stack selecionada:', e.target.value);
});`
    },
    experiments: [
      'Remova a palavra open da tag <details open> para fazê-lo iniciar fechado.',
      'Mude value="65" no <progress> para value="90" ou remova o atributo value para ver o estado indeterminado.',
      'Adicione uma nova <option> dentro do <select> e selecione-a para ver o log no Console.'
    ]
  },

  /* =====================================================================
     3. HTML TABELAS E LISTAS
     ===================================================================== */
  {
    slug: 'html-tabelas-listas',
    title: 'HTML Tabelas e Listas Estruturadas',
    category: 'HTML',
    language: 'HTML / CSS',
    runnable: true,
    summary: 'Como construir listas ordenadas, não ordenadas, listas de definição e tabelas acessíveis com mesclagem de células.',
    explanation: 'Listas organizam coleções e menus; tabelas existem exclusivamente para dados tabulares (relatórios, comparativos, notas). Separar <thead>, <tbody> e <tfoot> garante acessibilidade e permite estilização limpa de cabeçalhos e totais.',
    tags: ['html', 'table', 'listas', 'ul', 'ol', 'colspan', 'rowspan'],
    references: [
      { group: 'Listas', syntax: '<ul> + <li>', description: 'Lista não ordenada (marcadores/bullets) usada para itens e menus.' },
      { group: 'Listas', syntax: '<ol start="1" reversed> + <li>', description: 'Lista numerada/ordenada; aceita start e reversed.' },
      { group: 'Listas', syntax: '<dl> + <dt> + <dd>', description: 'Lista de definição (termo + descrição), ótima para glossários.' },
      { group: 'Tabelas', syntax: '<table> + <caption>', description: 'Contêiner da tabela e título descritivo para acessibilidade.' },
      { group: 'Tabelas', syntax: '<thead> / <tbody> / <tfoot>', description: 'Separa cabeçalho, corpo de dados e rodapé de somatórios.' },
      { group: 'Tabelas', syntax: '<tr> / <th scope="col"> / <td>', description: 'Linha, célula de título (negrito/semântica) e célula de dado.' },
      { group: 'Mesclagem', syntax: 'colspan="2" / rowspan="2"', description: 'Faz uma célula ocupar várias colunas ou várias linhas.' }
    ],
    playground: {
      html: `<table>
  <caption>Resumo de Serviços (API)</caption>
  <thead>
    <tr>
      <th scope="col">Serviço</th>
      <th scope="col">Status</th>
      <th scope="col">Latência</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Auth API</td>
      <td class="ok">Online</td>
      <td>42 ms</td>
    </tr>
    <tr>
      <td>Database</td>
      <td class="ok">Online</td>
      <td>18 ms</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2"><strong>Média geral</strong></td>
      <td><strong>30 ms</strong></td>
    </tr>
  </tfoot>
</table>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; color: #0f172a; }
table { width: 100%; max-width: 460px; border-collapse: collapse; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
caption { text-align: left; font-weight: 700; margin-bottom: 8px; font-size: 0.95rem; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 0.88rem; }
thead { background: #f1f5f9; }
tfoot { background: #f8fafc; }
.ok { color: #059669; font-weight: 600; }`,
      js: ''
    },
    experiments: [
      'Adicione uma nova linha <tr> dentro do <tbody> com um terceiro serviço.',
      'Troque border-collapse: collapse por separate e adicione border-spacing: 6px para ver a diferença.'
    ]
  },

  /* =====================================================================
     4. CSS BOX MODEL, DISPLAY E OVERFLOW
     ===================================================================== */
  {
    slug: 'css-box-model-display',
    title: 'CSS Box Model, Display e Overflow',
    category: 'CSS',
    language: 'HTML / CSS',
    runnable: true,
    summary: 'Entenda como todo elemento calcula largura, espaçamento interno/externo, modos de exibição e rolagem de conteúdo.',
    explanation: 'No CSS, todo elemento é uma caixa composta por Conteúdo + Padding + Border + Margin. Definir box-sizing: border-box evita que padding e borda estourem a largura desejada. Já a propriedade display decide se o elemento ocupa a linha inteira (block), flui com o texto (inline) ou organiza filhos (flex/grid).',
    tags: ['css', 'box-model', 'display', 'overflow', 'padding', 'margin', 'border-box'],
    references: [
      { group: 'Box Model', syntax: 'box-sizing: border-box', description: 'Inclui padding e border dentro do width/height declarados.' },
      { group: 'Box Model', syntax: 'padding / margin', description: 'padding cria respiro interno; margin cria distância externa entre caixas.' },
      { group: 'Display', syntax: 'display: block', description: 'Ocupa 100% da largura disponível e quebra linha antes e depois.' },
      { group: 'Display', syntax: 'display: inline', description: 'Fica na mesma linha do texto; ignora width e height fixos.' },
      { group: 'Display', syntax: 'display: inline-block', description: 'Fica na mesma linha, mas respeita width, height e padding vertical.' },
      { group: 'Display', syntax: 'display: none', description: 'Remove o elemento da tela e do fluxo (não ocupa espaço).' },
      { group: 'Visibilidade', syntax: 'visibility: hidden / opacity: 0', description: 'Oculta visualmente, mas o elemento continua ocupando espaço no layout.' },
      { group: 'Overflow', syntax: 'overflow: hidden | auto | scroll', description: 'Controla o que acontece quando o conteúdo ultrapassa o tamanho da caixa.' }
    ],
    playground: {
      html: `<div class="demo">
  <div class="box border-box">border-box (largura real = 220px)</div>
  <div class="box content-box">content-box (220px + padding + borda)</div>

  <div class="scroll-box">
    <strong>overflow: auto</strong> — Quando o texto ultrapassa a altura fixa de 90px, a barra de rolagem aparece automaticamente sem vazar para fora da caixa. Experimente trocar para overflow: hidden ou visible no CSS!
  </div>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 18px; background: #f8fafc; color: #0f172a; }
.demo { display: grid; gap: 14px; }
.box {
  width: 220px;
  padding: 16px;
  border: 6px solid #2563eb;
  background: #dbeafe;
  font-size: 0.84rem;
  font-weight: 600;
}
.border-box { box-sizing: border-box; }
.content-box { box-sizing: content-box; border-color: #ef4444; background: #fee2e2; }

.scroll-box {
  width: 280px;
  height: 90px;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  font-size: 0.85rem;
  overflow: auto;
}`,
      js: ''
    },
    experiments: [
      'Compare visualmente a largura das duas caixas mesmo ambas tendo width: 220px.',
      'Mude overflow: auto para overflow: hidden e depois para overflow: visible no .scroll-box.'
    ]
  },

  /* =====================================================================
     5. CSS POSICIONAMENTO E Z-INDEX
     ===================================================================== */
  {
    slug: 'css-posicionamento-zindex',
    title: 'CSS Position (Relative, Absolute, Fixed, Sticky) e Z-Index',
    category: 'CSS',
    language: 'HTML / CSS',
    runnable: true,
    summary: 'Controle exatamente onde elementos flutuam, grudam na rolagem ou se sobrepõem em camadas.',
    explanation: 'A propriedade position define o ponto de referência de um elemento. Um erro clássico de iniciantes é usar position: absolute sem definir position: relative no elemento pai — nesse caso, o filho foge para o canto da janela inteira.',
    tags: ['css', 'position', 'absolute', 'relative', 'sticky', 'fixed', 'z-index'],
    references: [
      { group: 'Modos', syntax: 'position: static', description: 'Padrão do navegador; segue o fluxo normal e ignora top/left/z-index.' },
      { group: 'Modos', syntax: 'position: relative', description: 'Mantém espaço no fluxo e serve de âncora para filhos absolute.' },
      { group: 'Modos', syntax: 'position: absolute', description: 'Sai do fluxo e posiciona-se relativo ao ancestral posicionado mais próximo.' },
      { group: 'Modos', syntax: 'position: fixed', description: 'Fica fixo na tela (viewport) mesmo quando o usuário rola a página.' },
      { group: 'Modos', syntax: 'position: sticky', description: 'Age como relative até cruzar um limite (ex.: top: 0), quando gruda.' },
      { group: 'Coordenadas', syntax: 'top / right / bottom / left / inset', description: 'Define deslocamento; inset: 0 equivale a zerar os 4 lados.' },
      { group: 'Camadas', syntax: 'z-index: 10', description: 'Controla qual elemento posicionado aparece na frente em sobreposições.' }
    ],
    playground: {
      html: `<div class="scroll-area">
  <header class="sticky-bar">Cabeçalho Sticky (role para baixo)</header>

  <div class="card">
    <span class="badge">NOVO</span>
    <h3>Card com Badge Absolute</h3>
    <p>O selo azul fica preso ao canto superior direito porque o .card tem position: relative.</p>
  </div>

  <div class="spacer">Role para ver o cabeçalho sticky acompanhando o topo...</div>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 14px; background: #f8fafc; color: #0f172a; }
.scroll-area {
  height: 240px;
  overflow-y: auto;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #fff;
}
.sticky-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px 14px;
  background: #0f172a;
  color: #fff;
  font-size: 0.84rem;
  font-weight: 600;
}
.card {
  position: relative;
  margin: 18px 14px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}
.badge {
  position: absolute;
  top: -10px;
  right: 12px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
}
h3 { margin: 0 0 6px; font-size: 0.96rem; }
p { margin: 0; font-size: 0.84rem; color: #475569; }
.spacer { height: 240px; padding: 14px; color: #94a3b8; font-size: 0.85rem; }`,
      js: ''
    },
    experiments: [
      'Comente a linha position: relative; dentro de .card e veja o selo NOVO escapar da caixa.',
      'Altere right: 12px para left: 12px no .badge para movê-lo para o outro lado.'
    ]
  },

  /* =====================================================================
     6. CSS CORES, TIPOGRAFIA, GRADIENTES E EFEITOS VISUAIS
     ===================================================================== */
  {
    slug: 'css-cores-tipografia-efeitos',
    title: 'CSS Cores, Tipografia Fluida, Sombras e Glassmorphism',
    category: 'CSS',
    language: 'HTML / CSS',
    runnable: true,
    summary: 'Domine variáveis CSS, gradientes, clamp() responsivo, sombras em camadas e efeito vidro fosco (backdrop-filter).',
    explanation: 'Interfaces com aparência profissional raramente usam cores aleatórias ou sombras pesadas. O segredo está em variáveis CSS (:root), tipografia que escala com clamp(), sombras suaves com baixa opacidade e contraste legível.',
    tags: ['css', 'cores', 'gradiente', 'sombra', 'tipografia', 'clamp', 'backdrop-filter'],
    references: [
      { group: 'Variáveis', syntax: '--cor-primaria: #2563eb; var(--cor-primaria)', description: 'Centraliza paleta e facilita modo claro/escuro.' },
      { group: 'Tipografia', syntax: 'font-size: clamp(1rem, 2.5vw, 1.8rem)', description: 'Escala o texto suavemente entre um tamanho mínimo e máximo.' },
      { group: 'Gradientes', syntax: 'linear-gradient(135deg, #2563eb, #06b6d4)', description: 'Cria transição suave de cores em ângulo personalizado.' },
      { group: 'Profundidade', syntax: 'box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2)', description: 'Adiciona elevação natural (eixo X, Y, desfoque, expansão, cor).' },
      { group: 'Vidro Fosco', syntax: 'backdrop-filter: blur(12px)', description: 'Desfoca o que está atrás de um elemento semitransparente.' },
      { group: 'Imagens', syntax: 'object-fit: cover', description: 'Preenche o contêiner sem distorcer a proporção da imagem.' },
      { group: 'Filtros', syntax: 'filter: grayscale(100%) / brightness(1.1)', description: 'Aplica efeitos visuais em imagens, ícones ou cards.' }
    ],
    playground: {
      html: `<div class="hero">
  <div class="glass-card">
    <span class="pill">CSS MODERNO</span>
    <h1>Tipografia Fluida &amp; Efeito Vidro</h1>
    <p>Experimente alterar o ângulo do gradiente, o blur ou a opacidade no CSS.</p>
  </div>
</div>`,
      css: `body { margin: 0; font-family: system-ui, sans-serif; }
.hero {
  min-height: 250px;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #0891b2 100%);
}
.glass-card {
  max-width: 400px;
  padding: 22px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 36px -12px rgba(2, 6, 23, 0.55);
  color: #ffffff;
}
.pill {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}
h1 { margin: 10px 0 6px; font-size: clamp(1.15rem, 3vw, 1.55rem); line-height: 1.25; }
p { margin: 0; font-size: 0.88rem; color: rgba(255, 255, 255, 0.86); }`,
      js: ''
    },
    experiments: [
      'Mude o ângulo 135deg do linear-gradient para 45deg ou troque #1d4ed8 por #7c3aed.',
      'Altere rgba(255, 255, 255, 0.12) para 0.25 e observe a transparência do vidro.'
    ]
  },

  /* =====================================================================
     7. ANIMAÇÕES CSS COMPLETAS (TRANSITIONS, TRANSFORM E KEYFRAMES)
     ===================================================================== */
  {
    slug: 'css-animacoes',
    title: 'Animações CSS: Transition, Transform e @keyframes',
    category: 'Animações',
    language: 'HTML / CSS / JS',
    runnable: true,
    summary: 'Referência completa de todas as propriedades de animação no CSS com laboratório interativo para testar curvas, tempos e transformações.',
    explanation: 'No CSS existem dois motores principais de animação: transition (para ir de um estado A a um estado B, como hover/focus) e @keyframes + animation (para movimentos contínuos ou com múltiplas etapas). Para manter 60 FPS sem travar celulares, anime sempre transform e opacity.',
    tags: ['animacoes', 'css', 'keyframes', 'transition', 'transform', 'cubic-bezier', '60fps'],
    references: [
      { group: 'Transition', syntax: 'transition: transform 220ms cubic-bezier(0.22,1,0.36,1)', description: 'Define propriedade, duração e curva de aceleração entre dois estados.' },
      { group: 'Transform', syntax: 'transform: translate(X, Y)', description: 'Move o elemento no plano sem causar recálculo de layout (reflow).' },
      { group: 'Transform', syntax: 'transform: scale(1.05)', description: 'Aumenta ou reduz proporcionalmente (1 = normal, 0.96 = clique).' },
      { group: 'Transform', syntax: 'transform: rotate(15deg)', description: 'Rotaciona o elemento em torno do seu transform-origin.' },
      { group: 'Transform', syntax: 'transform: skewX(-8deg)', description: 'Inclina o elemento horizontal ou verticalmente.' },
      { group: 'Keyframes', syntax: '@keyframes nome { 0% {} 50% {} 100% {} }', description: 'Define a linha do tempo completa de uma animação multi-etapa.' },
      { group: 'Animation', syntax: 'animation-duration: 1.2s', description: 'Tempo total de um ciclo completo da animação.' },
      { group: 'Animation', syntax: 'animation-timing-function', description: 'Ritmo: linear, ease, ease-in-out, cubic-bezier(...) ou steps(4).' },
      { group: 'Animation', syntax: 'animation-delay: 150ms', description: 'Tempo de espera antes de iniciar (ótimo para entrada escalonada).' },
      { group: 'Animation', syntax: 'animation-iteration-count: infinite | 1', description: 'Quantas vezes a animação repete.' },
      { group: 'Animation', syntax: 'animation-direction: alternate', description: 'Faz a animação ir e voltar suavemente (evita pulo brusco).' },
      { group: 'Animation', syntax: 'animation-fill-mode: forwards | both', description: 'Mantém o estilo final (100%) após a animação terminar.' },
      { group: 'Animation', syntax: 'animation-play-state: paused | running', description: 'Permite pausar uma animação no hover ou via JavaScript.' },
      { group: 'Acessibilidade', syntax: '@media (prefers-reduced-motion: reduce)', description: 'Reduz ou desliga movimentos para quem prefere interface estática.' }
    ],
    playground: {
      html: `<div class="studio">
  <div class="controls">
    <button id="toggle-pause" type="button">Pausar / Retomar</button>
    <button id="replay" type="button">Repetir Entrada</button>
  </div>

  <div class="stage">
    <div id="orb" class="orb">Flutuando</div>
    <div id="card" class="reveal-card">
      <strong>Entrada Suave</strong>
      <p>Usa opacity + translateY com animation-fill-mode: both.</p>
    </div>
  </div>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 18px; background: #09090b; color: #fafafa; }
.studio { display: grid; gap: 16px; }
.controls { display: flex; gap: 8px; }
button {
  padding: 7px 12px; border: 1px solid #3f3f46; border-radius: 6px;
  background: #18181b; color: #fafafa; font-size: 0.82rem; font-weight: 600; cursor: pointer;
  transition: transform 150ms ease, border-color 150ms ease;
}
button:hover { border-color: #3b82f6; transform: translateY(-1px); }
button:active { transform: scale(0.96); }

.stage { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding: 16px; border: 1px solid #27272a; border-radius: 10px; background: #111114; }

.orb {
  width: 96px; height: 96px; display: grid; place-items: center;
  border-radius: 18px; font-size: 0.78rem; font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  animation: floatOrb 2s ease-in-out infinite alternate;
}
.orb.paused { animation-play-state: paused; }

.reveal-card {
  flex: 1; min-width: 200px; padding: 14px; border-radius: 8px;
  background: #18181b; border: 1px solid #27272a;
  animation: slideFadeIn 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.reveal-card p { margin: 4px 0 0; font-size: 0.82rem; color: #a1a1aa; }

@keyframes floatOrb {
  from { transform: translateY(0) rotate(0deg); }
  to { transform: translateY(-12px) rotate(6deg); }
}

@keyframes slideFadeIn {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}`,
      js: `const orb = document.getElementById('orb');
const card = document.getElementById('card');

document.getElementById('toggle-pause').addEventListener('click', () => {
  orb.classList.toggle('paused');
  console.log('Estado da animação:', orb.classList.contains('paused') ? 'pausada' : 'rodando');
});

document.getElementById('replay').addEventListener('click', () => {
  card.style.animation = 'none';
  void card.offsetWidth; // força reinício do keyframe
  card.style.animation = '';
});`
    },
    experiments: [
      'Troque alternate por normal em .orb e veja o salto seco no fim do ciclo.',
      'Mude rotate(6deg) para rotate(180deg) no @keyframes floatOrb.',
      'Altere 450ms para 150ms no .reveal-card e clique em "Repetir Entrada" para sentir a velocidade.'
    ]
  },

  /* =====================================================================
     8. RECEITAS DE ANIMAÇÕES DE UI (SHIMMER, SPINNER, SHAKE, STAGGER)
     ===================================================================== */
  {
    slug: 'css-animacoes-interativas-ui',
    title: 'Receitas de Animações de UI: Skeleton, Spinner, Shake e Stagger',
    category: 'Animações',
    language: 'HTML / CSS / JS',
    runnable: true,
    summary: 'Padrões reais usados em sistemas profissionais: carregamento Skeleton Shimmer, feedback de erro (Shake), Spinner CSS e entrada escalonada.',
    explanation: 'Em aplicativos reais, animações servem para comunicar estado: o Skeleton Shimmer reduz a percepção de espera enquanto a API responde; o Shake sinaliza erro de formulário sem texto agressivo; e o Stagger (atraso progressivo) ajuda o olho a escanear listas.',
    tags: ['animacoes', 'skeleton', 'spinner', 'shake', 'stagger', 'ux', 'microinteracoes'],
    references: [
      { group: 'Loading', syntax: 'Skeleton Shimmer (background-position)', description: 'Brilho deslizante que simula o layout enquanto os dados carregam.' },
      { group: 'Loading', syntax: 'Spinner CSS (border-top-color + rotate)', description: 'Indicador circular leve sem precisar importar GIF ou biblioteca.' },
      { group: 'Feedback', syntax: 'Shake Error (translateX ±6px)', description: 'Vibração curta (300ms) para indicar senha incorreta ou campo inválido.' },
      { group: 'Lista', syntax: 'Stagger (animation-delay: calc(var(--i) * 60ms))', description: 'Entrada sequencial elegante dos itens de uma lista.' }
    ],
    playground: {
      html: `<div class="grid">
  <section class="box">
    <h3>1. Skeleton Shimmer</h3>
    <div class="sk title"></div>
    <div class="sk line"></div>
    <div class="sk line short"></div>
  </section>

  <section class="box">
    <h3>2. Spinner + Erro Shake</h3>
    <div class="row">
      <div class="spinner" aria-label="Carregando"></div>
      <button id="btn-err" type="button">Simular Erro (Shake)</button>
    </div>
  </section>

  <section class="box full">
    <h3>3. Entrada Escalonada (Stagger)</h3>
    <ul class="stagger-list">
      <li style="--i: 0">Item 01 — delay 0ms</li>
      <li style="--i: 1">Item 02 — delay 70ms</li>
      <li style="--i: 2">Item 03 — delay 140ms</li>
    </ul>
  </section>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #09090b; color: #fafafa; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.box { padding: 14px; border-radius: 10px; background: #111114; border: 1px solid #27272a; }
.box.full { grid-column: 1 / -1; }
h3 { margin: 0 0 10px; font-size: 0.85rem; color: #a1a1aa; }

/* 1. Skeleton Shimmer */
.sk {
  height: 12px; border-radius: 6px; margin-bottom: 8px;
  background: linear-gradient(90deg, #1f1f24 25%, #2f2f37 50%, #1f1f24 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
.sk.title { height: 18px; width: 65%; }
.sk.short { width: 45%; margin-bottom: 0; }

/* 2. Spinner + Shake */
.row { display: flex; align-items: center; gap: 14px; }
.spinner {
  width: 26px; height: 26px; border-radius: 50%;
  border: 3px solid #27272a; border-top-color: #3b82f6;
  animation: spin 750ms linear infinite;
}
button {
  padding: 8px 12px; border: 1px solid #ef4444; border-radius: 6px;
  background: rgba(239, 68, 68, 0.14); color: #fca5a5; font-weight: 600; cursor: pointer;
}
button.shake { animation: shake 320ms ease-in-out; }

/* 3. Stagger */
.stagger-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
.stagger-list li {
  padding: 8px 10px; border-radius: 6px; background: #18181b; border: 1px solid #27272a; font-size: 0.84rem;
  animation: popIn 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 70ms);
}

@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-4px); }
}
@keyframes popIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`,
      js: `const btn = document.getElementById('btn-err');
btn.addEventListener('click', () => {
  btn.classList.remove('shake');
  void btn.offsetWidth;
  btn.classList.add('shake');
  console.warn('Erro simulado com feedback visual Shake.');
});`
    },
    experiments: [
      'Clique em "Simular Erro (Shake)" e ajuste os valores de ±6px no @keyframes shake.',
      'Aumente 70ms para 200ms no animation-delay da lista para ver o efeito cascata mais lento.'
    ]
  },

  /* =====================================================================
     9. ANIMAÇÕES COM JAVASCRIPT (WEB ANIMATIONS API & INTERSECTION OBSERVER)
     ===================================================================== */
  {
    slug: 'js-web-animations-api',
    title: 'Animações com JavaScript: Web Animations API e Scroll Reveal',
    category: 'Animações',
    language: 'HTML / CSS / JS',
    runnable: true,
    summary: 'Controle animações dinamicamente via JavaScript usando element.animate() e dispare entradas suaves ao rolar com IntersectionObserver.',
    explanation: 'Quando uma animação depende de coordenadas dinâmicas, cliques do usuário ou visibilidade na rolagem (scroll), o JavaScript assume com a Web Animations API (element.animate) — que roda na mesma engine performática do CSS — e o IntersectionObserver, que observa elementos sem pesar o evento de scroll.',
    tags: ['javascript', 'animacoes', 'web-animations-api', 'intersection-observer', 'scroll'],
    references: [
      { group: 'WAAPI', syntax: 'el.animate(keyframes, options)', description: 'Dispara animação nativa via JS retornando um objeto Animation controlável.' },
      { group: 'WAAPI', syntax: 'anim.pause() / play() / reverse() / finish()', description: 'Controla reprodução, inversão ou finalização em tempo real.' },
      { group: 'WAAPI', syntax: 'anim.finished', description: 'Promise resolvida automaticamente quando a animação termina.' },
      { group: 'Scroll', syntax: 'new IntersectionObserver(cb, { threshold: 0.2 })', description: 'Detecta quando um elemento entra na tela sem travar a rolagem.' },
      { group: 'Loop', syntax: 'requestAnimationFrame(fn)', description: 'Sincroniza atualizações contínuas com a taxa de quadros do monitor.' }
    ],
    playground: {
      html: `<div class="wrap">
  <div class="bar">
    <button id="go" type="button">Animar com JS</button>
    <button id="rev" type="button">Reverter</button>
  </div>
  <div class="track">
    <div id="box" class="box">JS</div>
  </div>
  <p class="hint">Clique em "Animar com JS" e depois em "Reverter" no meio do caminho.</p>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 18px; background: #09090b; color: #fafafa; }
.wrap { display: grid; gap: 12px; }
.bar { display: flex; gap: 8px; }
button { padding: 8px 12px; border: 1px solid #3f3f46; border-radius: 6px; background: #18181b; color: #fff; font-weight: 600; cursor: pointer; }
.track { padding: 14px; border-radius: 10px; background: #111114; border: 1px solid #27272a; }
.box {
  width: 56px; height: 56px; display: grid; place-items: center;
  border-radius: 12px; background: #3b82f6; font-weight: 800;
}
.hint { margin: 0; font-size: 0.82rem; color: #a1a1aa; }`,
      js: `const box = document.getElementById('box');
let currentAnim = null;

document.getElementById('go').addEventListener('click', () => {
  currentAnim = box.animate(
    [
      { transform: 'translateX(0) rotate(0deg)', background: '#3b82f6' },
      { transform: 'translateX(220px) rotate(180deg)', background: '#10b981' }
    ],
    { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
  );
  currentAnim.finished.then(() => console.log('Animação concluída!'));
});

document.getElementById('rev').addEventListener('click', () => {
  if (!currentAnim) return;
  currentAnim.reverse();
  console.log('Direção invertida!');
});`
    },
    experiments: [
      'Adicione um terceiro passo intermediário no array de keyframes (por exemplo, scale(1.25)).',
      'Altere duration: 900 para 300 ou 2000 e teste o botão Reverter no meio do trajeto.'
    ]
  },

  /* =====================================================================
     10. JAVASCRIPT VARIÁVEIS, CONDIÇÕES, LOOPS E OPERADORES MODERNOS
     ===================================================================== */
  {
    slug: 'js-variaveis-estruturas',
    title: 'JavaScript Fundamentos: Variáveis, Fluxo e Operadores Modernos',
    category: 'JavaScript',
    language: 'JavaScript',
    runnable: true,
    summary: 'Como declarar dados com const/let, tomar decisões limpas, iterar coleções e usar destructuring, spread, ?. e ??.',
    explanation: 'O JavaScript moderno prioriza const por padrão (mudando para let apenas quando a variável precisa ser reatribuída) e oferece operadores enxutos que evitam erros de "Cannot read properties of undefined" em produção.',
    tags: ['javascript', 'const', 'let', 'loops', 'destructuring', 'spread', 'optional-chaining'],
    references: [
      { group: 'Variáveis', syntax: 'const / let', description: 'const impede reatribuição (padrão); let permite reatribuir. Evite var.' },
      { group: 'Condição', syntax: 'condicao ? valorSim : valorNao', description: 'Operador ternário para escolhas curtas e legíveis.' },
      { group: 'Segurança', syntax: 'usuario?.perfil?.nome', description: 'Optional Chaining: retorna undefined em vez de quebrar se algo for nulo.' },
      { group: 'Segurança', syntax: 'valor ?? "padrão"', description: 'Nullish Coalescing: usa o padrão apenas se valor for null ou undefined (respeita 0 e "").' },
      { group: 'Loops', syntax: 'for (const item of lista)', description: 'Percorre arrays, strings, Maps e Sets de forma limpa.' },
      { group: 'Desestruturação', syntax: 'const { nome, idade } = usuario', description: 'Extrai propriedades de objetos ou arrays diretamente em variáveis.' },
      { group: 'Spread / Rest', syntax: '{ ...base, ativo: true }', description: 'Cria cópias rasas e combina objetos/arrays sem mutar o original.' }
    ],
    playground: {
      html: '<p style="font-family:system-ui;padding:16px;color:#334155">Veja o resultado no <strong>Console</strong> abaixo e altere o objeto <code>usuario</code> na aba JS.</p>',
      css: '',
      js: `const usuario = {
  nome: 'Lucas',
  pontos: 0,
  perfil: { cargo: 'Dev Back-end' }
};

// Optional chaining (?.) evita crash mesmo se endereco não existir
const cidade = usuario.endereco?.cidade ?? 'Não informada';

// Nullish coalescing (??) preserva 0 (diferente de || que trocaria 0 pelo padrão)
const pontosComNullish = usuario.pontos ?? 100;
const pontosComOu = usuario.pontos || 100;

// Destructuring + Spread imutável
const { nome, perfil: { cargo } } = usuario;
const usuarioAtualizado = { ...usuario, ativo: true };

console.log('Nome e cargo:', nome, '-', cargo);
console.log('Cidade:', cidade);
console.log('Pontos com ?? :', pontosComNullish, '| Pontos com || :', pontosComOu);
console.log('Cópia atualizada:', usuarioAtualizado);`
    },
    experiments: [
      'Adicione endereco: { cidade: "Florianópolis" } no objeto usuario e veja o Console atualizar.',
      'Mude pontos: 0 para pontos: null e observe a diferença entre ?? e ||.'
    ]
  },

  /* =====================================================================
     11. JAVASCRIPT STRINGS, NÚMEROS E FORMATAÇÃO (INTL)
     ===================================================================== */
  {
    slug: 'js-strings-numeros-datas',
    title: 'JavaScript Strings, Math e Formatação de Moeda/Data (Intl)',
    category: 'JavaScript',
    language: 'JavaScript',
    runnable: true,
    summary: 'Os métodos indispensáveis para manipular textos, cálculos e formatar Reais (R$) e datas brasileiras nativamente.',
    explanation: 'Antes de instalar bibliotecas externas para formatar dinheiro, datas ou manipular textos, o próprio JavaScript já traz a API nativa Intl e dezenas de métodos diretos em String e Math.',
    tags: ['javascript', 'strings', 'math', 'intl', 'moeda', 'datas'],
    references: [
      { group: 'Strings', syntax: 'str.trim() / toLowerCase() / toUpperCase()', description: 'Remove espaços extras nas pontas e normaliza caixa.' },
      { group: 'Strings', syntax: 'str.includes("x") / startsWith("x")', description: 'Verifica se o texto contém ou começa com determinado trecho.' },
      { group: 'Strings', syntax: 'str.split(",") / arr.join("-")', description: 'Quebra uma string em array e junta array de volta em string.' },
      { group: 'Strings', syntax: 'str.replaceAll("a", "b")', description: 'Substitui todas as ocorrências de um texto.' },
      { group: 'Strings', syntax: 'str.padStart(4, "0")', description: 'Preenche à esquerda (ex.: "7" -> "0007").' },
      { group: 'Números', syntax: 'Math.round / floor / ceil / random', description: 'Arredondamentos e geração de números aleatórios.' },
      { group: 'Formatação', syntax: 'Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })', description: 'Formata valores monetários no padrão R$ 1.250,50 sem gambiarra.' },
      { group: 'Datas', syntax: 'Intl.DateTimeFormat("pt-BR")', description: 'Formata datas no padrão brasileiro dd/mm/aaaa.' }
    ],
    playground: {
      html: '<p style="font-family:system-ui;padding:16px;color:#334155">Confira as saídas formatadas no <strong>Console</strong> abaixo.</p>',
      css: '',
      js: `const bruto = '   dev central   ';
const limpo = bruto.trim().replaceAll(' ', '-').toLowerCase();

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dataPt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });

const pedidoNum = String(42).padStart(5, '0');

console.log('Slug gerado:', limpo);
console.log('Pedido nº:', pedidoNum);
console.log('Preço formatado:', brl.format(1499.9));
console.log('Data hoje:', dataPt.format(new Date()));`
    },
    experiments: [
      'Troque currency: "BRL" por "USD" e "pt-BR" por "en-US" para ver o formato em Dólar.',
      'Altere padStart(5, "0") para padStart(8, "0").'
    ]
  },

  /* =====================================================================
     12. JAVASCRIPT ASYNC/AWAIT, FETCH E STATUS HTTP
     ===================================================================== */
  {
    slug: 'js-async-fetch-apis',
    title: 'JavaScript Assíncrono: Promises, async/await, Fetch e HTTP',
    category: 'JavaScript',
    language: 'JavaScript',
    runnable: true,
    summary: 'Como lidar com operações assíncronas sem travar a tela, tratar erros com try/catch, usar Promise.all e interpretar códigos HTTP.',
    explanation: 'Requisições de rede e timers são assíncronos. Em código profissional, combinamos async/await com try/catch, verificamos response.ok no fetch (pois erro 404/500 não rejeita a Promise sozinho) e aplicamos timeouts com AbortSignal.timeout().',
    tags: ['javascript', 'async', 'await', 'promises', 'fetch', 'http', 'api'],
    references: [
      { group: 'Assíncrono', syntax: 'async function fn() { const res = await ... }', description: 'Permite escrever código assíncrono com leitura sequencial limpa.' },
      { group: 'Concorrência', syntax: 'Promise.all([p1, p2])', description: 'Executa múltiplas Promises em paralelo e aguarda todas concluírem.' },
      { group: 'Concorrência', syntax: 'Promise.allSettled([p1, p2])', description: 'Aguarda todas mesmo se alguma falhar, retornando status individual.' },
      { group: 'Rede', syntax: 'fetch(url, { signal: AbortSignal.timeout(5000) })', description: 'Faz requisição HTTP com proteção contra servidor travado.' },
      { group: 'HTTP Status', syntax: '200 OK / 201 Created / 204 No Content', description: 'Sucesso na leitura, criação de recurso ou operação sem corpo.' },
      { group: 'HTTP Status', syntax: '400 Bad Request / 401 Unauthorized / 403 Forbidden / 404 Not Found', description: 'Erros do cliente: dado inválido, sem login, sem permissão ou inexistente.' },
      { group: 'HTTP Status', syntax: '429 Too Many Requests / 500 Internal Server Error', description: 'Limite de taxa (rate limit) atingido ou erro inesperado no servidor.' }
    ],
    playground: {
      html: '<div style="font-family:system-ui;padding:16px"><button id="run-async" style="padding:8px 14px;border:none;border-radius:6px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer">Simular Chamada Paralela</button></div>',
      css: '',
      js: `function simularApi(nome, ms, deveFalhar) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (deveFalhar) reject(new Error('Falha em ' + nome));
      else resolve({ servico: nome, tempoMs: ms });
    }, ms);
  });
}

async function carregarPainel() {
  console.log('Iniciando 2 requisições em paralelo...');
  try {
    const [perfil, pedidos] = await Promise.all([
      simularApi('Perfil', 300, false),
      simularApi('Pedidos', 500, false)
    ]);
    console.log('Tudo carregado:', { perfil, pedidos });
  } catch (err) {
    console.error('Erro capturado no try/catch:', err.message);
  }
}

document.getElementById('run-async').addEventListener('click', carregarPainel);
carregarPainel();`
    },
    experiments: [
      'Troque false para true em simularApi("Pedidos", 500, true) para ver o bloco catch agir.',
      'Troque Promise.all por Promise.allSettled e veja o resultado quando uma das chamadas falha.'
    ]
  },

  /* =====================================================================
     13. NODE.JS & EXPRESS: ROTAS, MIDDLEWARES E MÓDULOS NATIVOS
     ===================================================================== */
  {
    slug: 'node-express-comandos',
    title: 'Node.js & Express: Rotas, Middlewares e Segurança',
    category: 'Node.js',
    language: 'JavaScript (Node)',
    runnable: false,
    summary: 'Guia rápido dos comandos mais usados em back-end Node.js moderno (ESM) com Express e módulos nativos.',
    explanation: 'Um back-end profissional em Node.js separa rotas, validação, regras de negócio (services) e tratamento centralizado de erros, aproveitando módulos nativos (node:fs/promises, node:path, node:crypto) para evitar dependências desnecessárias.',
    tags: ['nodejs', 'express', 'api', 'middlewares', 'backend', 'seguranca'],
    references: [
      { group: 'Rotas Express', syntax: 'app.get / post / put / patch / delete', description: 'Mapeia cada verbo HTTP para um handler específico.' },
      { group: 'Entrada', syntax: 'req.params / req.query / req.body', description: 'Lê parâmetros de URL (:id), filtros (?q=...) e JSON enviado no corpo.' },
      { group: 'Saída', syntax: 'res.status(201).json({ ... })', description: 'Define o status HTTP correto e devolve JSON estruturado.' },
      { group: 'Middlewares', syntax: 'app.use((req, res, next) => ...)', description: 'Intercepta requisições para logs, autenticação, rate limit e headers.' },
      { group: 'Erro Global', syntax: 'app.use((err, req, res, next) => ...)', description: 'Captura exceções em um único lugar sem vazar stack trace em produção.' },
      { group: 'Nativos Node', syntax: 'import fs from "node:fs/promises"', description: 'Leitura e escrita assíncrona de arquivos sem bloquear o Event Loop.' },
      { group: 'Nativos Node', syntax: 'crypto.randomUUID()', description: 'Gera identificadores únicos criptograficamente seguros.' },
      { group: 'Segurança', syntax: 'app.disable("x-powered-by")', description: 'Oculta a assinatura do Express nos headers de resposta.' }
    ],
    codeSnippet: {
      filename: 'rota-segura-express.js',
      content: `import express from 'express';
import crypto from 'node:crypto';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb', strict: true }));

app.post('/api/items', (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';

  if (title.length < 3 || title.length > 80) {
    return res.status(400).json({
      error: { code: 'INVALID_TITLE', message: 'Título deve ter entre 3 e 80 caracteres.' }
    });
  }

  return res.status(201).json({
    id: crypto.randomUUID(),
    title,
    createdAt: new Date().toISOString()
  });
});`
    },
    experiments: [
      'Sempre valide tipo e tamanho de req.body antes de tocar no banco de dados.',
      'Use express.json({ limit: "16kb" }) para evitar ataques de exaustão de memória com payloads gigantes.'
    ]
  },

  /* =====================================================================
     14. GIT & TERMINAL: COMANDOS DO DIA A DIA PROFISSIONAL
     ===================================================================== */
  {
    slug: 'git-terminal-comandos',
    title: 'Git & Terminal: Fluxo Completo e Comandos de Emergência',
    category: 'Git & Terminal',
    language: 'Bash / Git',
    runnable: false,
    summary: 'Todos os comandos essenciais para versionar código em equipe, trabalhar com branches, desfazer erros com segurança e caçar bugs no histórico.',
    explanation: 'Dominar o Git tira o medo de experimentar mudanças grandes no código. Trabalhar com branches isoladas, revisar o git diff antes de commitar e saber reverter sem destruir histórico são hábitos básicos de todo dev profissional.',
    tags: ['git', 'github', 'terminal', 'branch', 'commit', 'bisect', 'revert'],
    references: [
      { group: 'Início', syntax: 'git init / git clone <url>', description: 'Inicia repositório local ou baixa um projeto existente.' },
      { group: 'Rotina', syntax: 'git status / git diff', description: 'Mostra arquivos modificados e as linhas exatas alteradas antes do commit.' },
      { group: 'Rotina', syntax: 'git add <arquivo> / git commit -m "msg"', description: 'Prepara alterações na área de stage e grava o ponto no histórico.' },
      { group: 'Branches', syntax: 'git switch -c feat/nome', description: 'Cria e já muda para uma nova branch isolada.' },
      { group: 'Branches', syntax: 'git merge feat/nome', description: 'Integra as alterações da branch na branch atual.' },
      { group: 'Remoto', syntax: 'git pull / git push -u origin branch', description: 'Sincroniza commits do servidor e envia sua branch para o GitHub.' },
      { group: 'Pausa', syntax: 'git stash / git stash pop', description: 'Guarda alterações inacabadas temporariamente para trocar de tarefa.' },
      { group: 'Desfazer Seguro', syntax: 'git restore <arquivo>', description: 'Descarta alterações locais não commitadas de um arquivo específico.' },
      { group: 'Desfazer Seguro', syntax: 'git revert <hash>', description: 'Cria um novo commit desfazendo um commit antigo sem reescrever histórico.' },
      { group: 'Investigação', syntax: 'git log --oneline -n 10 / git bisect', description: 'Exibe histórico resumido e faz busca binária para achar commit culpado de um bug.' }
    ],
    codeSnippet: {
      filename: 'fluxo-profissional.sh',
      content: `# 1. Crie uma branch isolada para a nova funcionalidade
git switch -c feat/biblioteca-interativa

# 2. Confira exatamente o que mudou antes de commitar
git status
git diff

# 3. Faça commit atômico e claro
git add src/data/library/
git commit -m "feat(library): adiciona catálogo interativo de HTML, CSS e Animações"

# 4. Envie para o repositório remoto
git push -u origin feat/biblioteca-interativa`
    },
    experiments: [
      'Adote o hábito de rodar git diff antes de todo git commit para pegar console.log esquecido.',
      'Em projetos em equipe, prefira git revert em vez de git reset --hard em branches já enviadas.'
    ]
  }
];

/* =====================================================================
   NOVOS GUIAS PROFUNDOS SOBRE ANIMAÇÕES WEB (src/data/guides/)
   ===================================================================== */
const NEW_GUIDES = [
  {
    slug: 'guia-completo-animacoes-web',
    title: 'Guia Definitivo de Animações Web a 60 FPS',
    pillar: 'frontend',
    level: 'Intermediário',
    readTime: '8 min',
    summary: 'Aprenda como o navegador renderiza animações, por que animar apenas transform e opacity, como escolher durações e curvas profissionais e respeitar acessibilidade.',
    tags: ['animacoes', 'css', 'performance', '60fps', 'cubic-bezier', 'gpu', 'ux'],
    sections: [
      {
        title: '1. O segredo dos 60 FPS: GPU (Composite) vs Reflow',
        explanation: 'Para uma animação parecer fluida, o navegador precisa desenhar cada quadro em menos de 16,6ms. Propriedades como width, height, top, left e margin forçam o navegador a recalcular o layout da página inteira a cada frame (Layout Thrashing). Já transform e opacity rodam direto na camada de composição (GPU), mantendo fluidez até em celulares simples.',
        code: {
          language: 'css',
          filename: 'gpu-vs-reflow.css',
          content: `/* EVITE: força recálculo de layout em todos os elementos vizinhos */
.card-lento {
  transition: margin-top 250ms ease, width 250ms ease;
}
.card-lento:hover {
  margin-top: -6px;
}

/* PREFIRA: roda direto na GPU sem empurrar o layout */
.card-fluido {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;
}
.card-fluido:hover {
  transform: translateY(-4px);
}`
        },
        tip: 'Use will-change: transform apenas em elementos que realmente animam com frequência; exagerar no will-change consome memória de vídeo à toa.'
      },
      {
        title: '2. Tabela prática de durações e curvas (Timing)',
        explanation: 'Animações profissionais são quase imperceptíveis: rápidas o bastante para não atrasar o usuário, suaves o bastante para guiar o olhar. Use curvas ease-out para elementos que entram na tela (começam rápido e freiam suave) e ease-in para elementos que saem.',
        code: {
          language: 'css',
          filename: 'tokens-animacao.css',
          content: `:root {
  /* Micro-interações: hover em botões, checkboxes, ícones */
  --dur-fast: 150ms;

  /* Transições médias: cards, menus dropdown, modais */
  --dur-medium: 260ms;

  /* Movimentos amplos: gavetas laterais (drawers), troca de tela */
  --dur-slow: 380ms;

  /* Curvas profissionais */
  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1); /* entrada natural */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* deslocamento na tela */
}`
        },
        tip: 'Se uma transição demora mais de 500ms em um menu ou botão, o usuário sente que o site está lento.'
      },
      {
        title: '3. Quando escolher Transition, @keyframes ou JavaScript',
        explanation: 'Não complique a ferramenta: use transition para respostas simples de estado (:hover, :focus, classe .open); use @keyframes para ciclos contínuos (spinner, pulse, shimmer) ou sequências de 3+ passos; use Web Animations API (element.animate) ou IntersectionObserver quando a animação depender de dados dinâmicos ou rolagem.',
        code: {
          language: 'javascript',
          filename: 'scroll-reveal.js',
          content: `// Revela elementos suavemente conforme entram na área visível
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // anima só uma vez
      }
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));`
        },
        tip: 'Chamar observer.unobserve(entry.target) evita que a página fique piscando toda vez que o usuário sobe e desce a rolagem.'
      },
      {
        title: '4. Acessibilidade obrigatória: prefers-reduced-motion',
        explanation: 'Algumas pessoas sofrem tontura ou desconforto com movimentos paralaxe e deslocamentos grandes. Com uma única media query CSS, seu site respeita automaticamente a configuração do Windows, macOS, Android ou iOS.',
        code: {
          language: 'css',
          filename: 'acessibilidade-motion.css',
          content: `@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`
        },
        tip: 'Você pode testar esse modo no Chrome DevTools pressionando Ctrl+Shift+P e digitando "Emulate CSS prefers-reduced-motion: reduce".'
      }
    ],
    checklist: [
      'Animar prioritariamente transform e opacity (evitar animar width, height, top e left).',
      'Manter interações de botão e hover entre 120ms e 220ms.',
      'Usar ease-out para entradas e ease-in para saídas.',
      'Incluir sempre @media (prefers-reduced-motion: reduce) na folha de estilos.',
      'Validar a fluidez na aba Performance do DevTools sem quedas bruscas de FPS.'
    ]
  },
  {
    slug: 'animacoes-microinteracoes-ux',
    title: 'Micro-interações Profissionais: Feedback, Estados e Fluxo',
    pillar: 'frontend',
    level: 'Intermediário',
    readTime: '6 min',
    summary: 'Como usar pequenas animações intencionais para confirmar cliques, sinalizar erros, suavizar carregamentos e deixar a interface intuitiva.',
    tags: ['ux', 'microinteracoes', 'ui', 'animacoes', 'skeleton', 'feedback'],
    sections: [
      {
        title: '1. Os 4 estados que todo botão profissional precisa ter',
        explanation: 'Uma interface parece "viva" e confiável quando responde instantaneamente a cada ação do dedo ou mouse: repouso, hover (convite), active (pressão tátil com scale 0.97) e focus-visible (acessibilidade por teclado).',
        code: {
          language: 'css',
          filename: 'botao-tatil.css',
          content: `.btn-pro {
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1), background-color 140ms ease;
}

.btn-pro:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-pro:active {
  transform: scale(0.97);
}

.btn-pro:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}`
        },
        tip: 'Nunca remova o outline no :focus sem fornecer uma alternativa clara no :focus-visible.'
      },
      {
        title: '2. Entrada escalonada (Stagger) sem poluir o CSS',
        explanation: 'Em vez de escrever 10 classes .delay-1, .delay-2..., passe apenas o índice do elemento via variável CSS inline (--i: 0, 1, 2...) e calcule o atraso automaticamente com calc().',
        code: {
          language: 'css',
          filename: 'stagger-pattern.css',
          content: `.card-item {
  animation: enterUp 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 45ms);
}

@keyframes enterUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`
        },
        tip: 'Limpe o atraso máximo para listas longas (ex.: Math.min(index, 8)) para que o 30º card não demore 2 segundos para aparecer.'
      },
      {
        title: '3. Regra de ouro: propósito acima de enfeite',
        explanation: 'Toda animação deve responder a pelo menos uma destas perguntas: "Onde estou?", "O que acabou de mudar?" ou "O sistema está trabalhando?". Se um elemento fica quicando o tempo todo sem motivo, ele rouba atenção e cansa o usuário.',
        code: {
          language: 'text',
          filename: 'mapa-de-uso.txt',
          content: `CONFIRMAÇÃO DE CLIQUE  -> scale(0.97) no :active + troca de texto ("Copiado!")
CARREGAMENTO DE DADOS  -> Skeleton Shimmer (melhor que tela em branco)
ERRO DE VALIDAÇÃO      -> Shake horizontal curto (300ms) + borda vermelha + texto claro
NAVEGAÇÃO / MODAL      -> Fade + leve translateY(8px) em 200ms-280ms`
        },
        tip: 'Abra a Biblioteca de Códigos > Animações aqui mesmo no DevCentral para editar e testar todas essas receitas ao vivo.'
      }
    ],
    checklist: [
      'Garantir feedback visual imediato em botões (:hover, :active e :focus-visible).',
      'Substituir telas em branco por Skeleton Loaders ou spinners leves.',
      'Limitar o delay máximo em listas escalonadas (stagger).',
      'Evitar animações infinitas chamativas perto de textos de leitura.'
    ]
  }
];

async function writeJsonSafe(targetDir, item) {
  if (!item || typeof item.slug !== 'string' || !SLUG_REGEX.test(item.slug)) {
    throw new Error(`Slug inválido detectado: ${String(item?.slug)}`);
  }

  const base = path.resolve(targetDir) + path.sep;
  const fullPath = path.resolve(targetDir, `${item.slug}.json`);
  if (!fullPath.startsWith(base)) {
    throw new Error(`Caminho fora do diretório permitido: ${fullPath}`);
  }

  await fs.writeFile(fullPath, `${JSON.stringify(item, null, 2)}\n`, 'utf-8');
  return fullPath;
}

async function run() {
  await fs.mkdir(LIBRARY_DIR, { recursive: true });
  await fs.mkdir(GUIDES_DIR, { recursive: true });

  for (const mod of LIBRARY_MODULES) {
    await writeJsonSafe(LIBRARY_DIR, mod);
  }

  for (const guide of NEW_GUIDES) {
    await writeJsonSafe(GUIDES_DIR, guide);
  }

  console.log(
    `Conteúdo gerado com sucesso: ${LIBRARY_MODULES.length} módulos da Biblioteca e ${NEW_GUIDES.length} guias de Animações.`
  );
}

run().catch((err) => {
  console.error('Erro ao gerar conteúdo:', err.message);
  process.exit(1);
});