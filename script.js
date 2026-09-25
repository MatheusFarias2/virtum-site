const body = document.body;
const siteHeader = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const navPanel = document.getElementById('navPanel');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

const syncHeader = () => siteHeader.classList.toggle('scrolled', window.scrollY > 12);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

function closeMenu() {
  navPanel.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const open = !navPanel.classList.contains('open');
  navPanel.classList.toggle('open', open);
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  body.classList.toggle('menu-open', open);
});

navPanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navPanel.classList.contains('open')) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1120) closeMenu();
});

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -44px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionLinks = [...navPanel.querySelectorAll('a[href^="#"]')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  }, { rootMargin: '-25% 0px -58% 0px', threshold: [0.05, 0.25, 0.5] });
  sections.forEach((section) => sectionObserver.observe(section));
}

const demos = {
  academy: {
    context: 'OPERAÇÃO / SEMESTRE ATUAL',
    title: 'Visão acadêmica',
    status: 'Sistema ativo',
    metrics: [
      ['Aulas organizadas', '128', 'neste ciclo'],
      ['Conflitos', '0', 'após validação'],
      ['Exportações', '24', 'PDF + Excel']
    ],
    chart: ['38%', '62%', '46%', '78%', '58%', '88%', '70%', '94%', '68%', '82%']
  },
  veyra: {
    context: 'NAVEGAÇÃO / CONTROLE & SHIELD',
    title: 'Sessão Veyra',
    status: 'Proteção ativa',
    metrics: [
      ['Grupos de abas', '06', 'organizados'],
      ['Perfis', '03', 'contextos'],
      ['Downloads', '12', 'gerenciados']
    ],
    chart: ['54%', '42%', '72%', '63%', '86%', '51%', '76%', '67%', '91%', '74%']
  },
  svs: {
    context: 'MICROSCOPIA / LÂMINA DIGITAL',
    title: 'Exploração da amostra',
    status: 'Viewer pronto',
    metrics: [
      ['Ampliação', '40×', 'visual atual'],
      ['Nível', '08', 'pirâmide SVS'],
      ['Marcadores', '06', 'na amostra']
    ],
    chart: ['28%', '44%', '76%', '58%', '84%', '67%', '92%', '62%', '80%', '55%']
  }
};

const demoContext = document.getElementById('demoContext');
const demoTitle = document.getElementById('demoTitle');
const demoStatus = document.getElementById('demoStatus');
const metricGrid = document.getElementById('metricGrid');
const demoShell = document.getElementById('demoShell');
const chartBars = [...document.querySelectorAll('.chart span')];
const productTabs = [...document.querySelectorAll('.product-tab')];

function setDemo(name, tabId) {
  const demo = demos[name];
  if (!demo) return;

  demoContext.textContent = demo.context;
  demoTitle.textContent = demo.title;
  demoStatus.textContent = demo.status;
  metricGrid.innerHTML = demo.metrics.map(([label, value, hint]) =>
    `<article><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`
  ).join('');
  chartBars.forEach((bar, index) => bar.style.setProperty('--h', demo.chart[index]));
  demoShell.setAttribute('aria-labelledby', tabId);

  if (!reduceMotion) {
    demoShell.classList.remove('demo-animate');
    void demoShell.offsetWidth;
    demoShell.classList.add('demo-animate');
  }
}

function activateDemo(button) {
  if (!button || button.classList.contains('active')) return;
  productTabs.forEach((tab) => {
    const active = tab === button;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  setDemo(button.dataset.demo, button.id);
}

productTabs.forEach((button, index) => {
  button.addEventListener('click', () => activateDemo(button));
  button.addEventListener('focus', () => activateDemo(button));
  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') activateDemo(button);
  });
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = productTabs[(index + direction + productTabs.length) % productTabs.length];
    next.focus();
  });
});

const filterButtons = document.querySelectorAll('.filter-button');
const productCards = document.querySelectorAll('#productGrid > .product-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    productCards.forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  productCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

const projects = {
  academy: {
    monogram: 'A',
    kicker: 'Gestão acadêmica · Desktop',
    title: 'Virtum Academy',
    description: 'Uma central de operação para organizar o calendário acadêmico, reduzir conflitos e transformar dados de cursos, tutores, disciplinas e salas em decisões claras.',
    meta: ['PySide6', 'SQLite', 'OpenPyXL', 'PDF + Excel'],
    features: ['Matrizes, disciplinas, turmas e tutores conectados', 'Alocação com validação de conflitos e feriados', 'Calendários e relatórios individuais ou em massa'],
    accent: '#2f6bff'
  },
  veyra: {
    monogram: 'V',
    kicker: 'Navegador · Desktop',
    title: 'Virtum Veyra',
    description: 'Um navegador com identidade própria, desenhado para dar mais controle sobre abas, perfis, downloads, privacidade e o ritmo de navegação.',
    meta: ['QtWebEngine', 'Perfis', 'Grupos de abas', 'Control & Shield'],
    features: ['Organização de abas em grupos e sessões', 'Controles de áudio, cookies, downloads e suspensão', 'Importação de favoritos, senhas e preferências'],
    accent: '#36ddff'
  },
  svs: {
    monogram: 'S',
    kicker: 'Microscopia digital · Web',
    title: 'Virtum SVS Viewer',
    description: 'Visualização de lâminas histológicas em alta resolução com uma interface compacta, pensada para computadores, Chromebooks e telas sensíveis ao toque.',
    meta: ['OpenSeadragon', 'SVS', 'Touch', 'Uso local'],
    features: ['Zoom profundo com navegação fluida', 'Interface compacta para uso em laboratório', 'Abertura local com foco em privacidade e agilidade'],
    accent: '#8b6cff'
  },
  code: {
    monogram: 'C',
    kicker: 'Desenvolvimento · Desktop',
    title: 'Virtum Code',
    description: 'Uma IDE Python leve para estudar, organizar pequenos projetos e executar código sem carregar a complexidade de um ambiente maior.',
    meta: ['Python', 'PySide6', 'Terminal', 'Git'],
    features: ['Editor com abas e projetos locais', 'Terminal integrado e execução rápida', 'Fluxo visual para operações essenciais do Git'],
    accent: '#4f8bff'
  },
  ponto: {
    monogram: 'P',
    kicker: 'Controle de presença · Web',
    title: 'Virtum Ponto',
    description: 'Registro de presença simples e confiável para equipes, com uso rápido em modo totem e uma área administrativa completa.',
    meta: ['React', 'Supabase', 'Web', 'Relatórios'],
    features: ['Entrada e saída em poucos toques', 'Correções manuais com histórico de auditoria', 'Painel administrativo e exportação de relatórios'],
    accent: '#5ee9a0'
  },
  origins: {
    monogram: 'O',
    kicker: 'RPG autoral · 3D',
    title: 'Virtum Origins',
    description: 'Um universo de fantasia sombria sobre memória, sacrifício e uma voz que atravessa a fenda — criado como a frente narrativa da Virtum.',
    meta: ['Godot', '3D', 'Narrativa', 'Exploração'],
    features: ['Três continentes e progressão até Virtum', 'Dungeons, titãs e descobertas por camadas', 'Atmosfera sombria com narrativa autoral'],
    accent: '#7d6cff'
  },
  inventory: {
    monogram: 'I',
    kicker: 'Inventário · Desktop + Mobile',
    title: 'Virtum Inventory',
    description: 'Controle visual de itens físicos por ambiente, com conferências, registros fotográficos, status e relatórios de pendências.',
    meta: ['Desktop', 'Mobile', 'Fotos', 'Relatórios'],
    features: ['Conferência por laboratório ou setor', 'Histórico de status e pendências', 'Registro fotográfico e relatórios objetivos'],
    accent: '#30b7e8'
  },
  architect: {
    monogram: 'R',
    kicker: 'Planejamento de software',
    title: 'Virtum Architect',
    description: 'Uma ferramenta para conduzir ideias de software desde o primeiro rascunho até requisitos, módulos, telas, MVP e roadmap.',
    meta: ['MVP', 'Diagramas', 'Requisitos', 'Roadmap'],
    features: ['Projetos organizados por níveis de maturidade', 'Definição guiada do MVP', 'Documentação viva ligada à evolução do produto'],
    accent: '#7797ff'
  },
  notes: {
    monogram: 'N',
    kicker: 'Conhecimento · Produtividade',
    title: 'Virtum Notes',
    description: 'Um espaço de escrita e organização para transformar anotações dispersas em uma base pessoal de conhecimento.',
    meta: ['Notas', 'Organização', 'Pesquisa', 'Produtividade'],
    features: ['Estrutura simples para capturar ideias', 'Organização por assuntos e projetos', 'Busca rápida e leitura sem distrações'],
    accent: '#9d77ff'
  }
};

const projectDialog = document.getElementById('projectDialog');
const dialogClose = document.getElementById('dialogClose');
const dialogMonogram = document.getElementById('dialogMonogram');
const dialogKicker = document.getElementById('dialogKicker');
const dialogTitle = document.getElementById('dialogTitle');
const dialogDescription = document.getElementById('dialogDescription');
const dialogMeta = document.getElementById('dialogMeta');
const dialogFeatures = document.getElementById('dialogFeatures');
const dialogVisual = document.getElementById('dialogVisual');
const dialogAction = document.getElementById('dialogAction');
let dialogTrigger = null;

function openProject(projectKey, trigger) {
  const project = projects[projectKey];
  if (!project) return;

  dialogTrigger = trigger;
  dialogMonogram.textContent = project.monogram;
  dialogKicker.textContent = project.kicker;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;
  dialogMeta.replaceChildren(...project.meta.map((item) => {
    const chip = document.createElement('span');
    chip.textContent = item;
    return chip;
  }));
  dialogFeatures.replaceChildren(...project.features.map((item) => {
    const row = document.createElement('li');
    row.textContent = item;
    return row;
  }));
  dialogVisual.style.setProperty('--dialog-accent', project.accent);
  dialogVisual.style.background = `radial-gradient(circle, ${project.accent}3d, transparent 42%), linear-gradient(145deg, #0d1626, #070a10)`;
  dialogAction.href = `https://wa.me/5555996280930?text=${encodeURIComponent(`Olá! Quero conversar sobre o ${project.title}.`)}`;

  if (typeof projectDialog.showModal === 'function') {
    projectDialog.showModal();
  } else {
    projectDialog.setAttribute('open', '');
  }
  body.classList.add('dialog-open');
  dialogClose.focus();
}

function closeProject() {
  if (typeof projectDialog.close === 'function') projectDialog.close();
  else projectDialog.removeAttribute('open');
  body.classList.remove('dialog-open');
  dialogTrigger?.focus();
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => openProject(button.dataset.project, button));
});

dialogClose.addEventListener('click', closeProject);
projectDialog.addEventListener('click', (event) => {
  const rect = projectDialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) closeProject();
});
projectDialog.addEventListener('close', () => body.classList.remove('dialog-open'));
