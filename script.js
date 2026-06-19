
const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
const year = document.getElementById('year');
const toast = document.getElementById('toast');
let toastTimer;
const prefersReducedMotionV076 = window.matchMedia('(prefers-reduced-motion: reduce)');
const canHoverFineV076 = window.matchMedia('(hover: hover) and (pointer: fine)');

if (year) {
  year.textContent = new Date().getFullYear();
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

if (menuButton && navLinks) {
  const navInnerLinksV082 = navLinks.querySelector('.nav-links');
  const desktopMenuQueryV082 = window.matchMedia('(min-width: 1181px)');

  const setMobileMenuStateV082 = (isOpen) => {
    navLinks.classList.toggle('open', isOpen);
    navInnerLinksV082?.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', isOpen);
  };

  const closeMobileMenu = () => setMobileMenuStateV082(false);

  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = !navLinks.classList.contains('open');
    setMobileMenuStateV082(isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (event) => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(event.target) || menuButton.contains(event.target)) return;
    closeMobileMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  const handleDesktopBreakpointV082 = (event) => {
    if (event.matches) closeMobileMenu();
  };

  if (typeof desktopMenuQueryV082.addEventListener === 'function') {
    desktopMenuQueryV082.addEventListener('change', handleDesktopBreakpointV082);
  } else if (typeof desktopMenuQueryV082.addListener === 'function') {
    desktopMenuQueryV082.addListener(handleDesktopBreakpointV082);
  }
}

const revealElementsV076 = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotionV076.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElementsV076.forEach((element) => observer.observe(element));
} else {
  revealElementsV076.forEach((element) => element.classList.add('visible'));
}

document.querySelectorAll('.project-more').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    if (!card) return;
    const expanded = card.classList.toggle('expanded');
    button.textContent = expanded ? 'Ocultar detalhes' : 'Ver detalhes';
  });
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

const VIRTUM_WHATSAPP_NUMBER = '5555996280930';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('contactName')?.value?.trim() || 'Visitante';
    const email = document.getElementById('contactEmail')?.value?.trim() || 'Não informado';
    const interest = document.getElementById('contactInterest')?.value || 'Não informado';
    const project = document.getElementById('contactProject')?.value || 'Outro assunto';
    const message = document.getElementById('contactMessage')?.value?.trim() || 'Mensagem não informada';

    const whatsappText = [
      'Olá, Virtum! Quero conversar sobre um projeto.',
      '',
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Interesse: ${interest}`,
      `Projeto: ${project}`,
      '',
      `Mensagem: ${message}`
    ].join('\n');

    const url = `https://wa.me/${VIRTUM_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Abrindo WhatsApp com a mensagem pronta.');
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
const roadmapItems = document.querySelectorAll('[data-roadmap-status]');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    roadmapItems.forEach((item) => {
      const visible = filter === 'all' || item.dataset.roadmapStatus === filter;
      item.classList.toggle('hidden', !visible);
    });
  });
});


const projectFilterButtons = document.querySelectorAll('[data-project-filter]');
const projectCards = document.querySelectorAll('[data-project-category]');

// : header mais firme ao rolar a página
const siteHeader = document.querySelector('.site-header[data-header="refined"]');
if (siteHeader) {
  const syncHeaderScroll = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  syncHeaderScroll();
  window.addEventListener('scroll', syncHeaderScroll, { passive: true });
}


// : microinterações leves
document.documentElement.classList.add('js-enabled');

const interactiveElements = document.querySelectorAll(
  '.button, .mini-button, .nav-link, .nav-cta, .project-more, .filter-button, .footer-whatsapp-v068, .whatsapp-contact-button'
);

interactiveElements.forEach((element) => {
  element.addEventListener('pointerdown', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'virtum-ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    element.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 650);
  });
});

const glowCards = document.querySelectorAll(
  '.project-card[data-legacy-glow]'
);

if (!prefersReducedMotionV076.matches && canHoverFineV076.matches) {
  glowCards.forEach((card) => {
    let glowFrame = 0;
    card.addEventListener('pointermove', (event) => {
      if (glowFrame) return;
      glowFrame = window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
        glowFrame = 0;
      });
    });

    card.addEventListener('pointerleave', () => {
      if (glowFrame) {
        window.cancelAnimationFrame(glowFrame);
        glowFrame = 0;
      }
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}


// : polimento visual geral
const progressBarV070 = document.createElement('div');
progressBarV070.className = 'scroll-progress-v070';
progressBarV070.setAttribute('aria-hidden', 'true');
document.body.appendChild(progressBarV070);

let scrollProgressFrameV076 = 0;
function syncScrollProgressV070() {
  scrollProgressFrameV076 = 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  progressBarV070.style.transform = `scaleX(${progress})`;
}

function requestScrollProgressV076() {
  if (scrollProgressFrameV076) return;
  scrollProgressFrameV076 = window.requestAnimationFrame(syncScrollProgressV070);
}

syncScrollProgressV070();
window.addEventListener('scroll', requestScrollProgressV076, { passive: true });
window.addEventListener('resize', requestScrollProgressV076);
window.addEventListener('load', requestScrollProgressV076, { once: true });

// Evita foco preso depois de clique com mouse, mantendo acessibilidade por teclado
document.addEventListener('pointerdown', () => {
  document.body.classList.add('using-pointer');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    document.body.classList.remove('using-pointer');
  }
});


// : revisão fina pós-polimento
document.documentElement.classList.add('v0703-polished');


// : busca e filtros combinados na vitrine de projetos
const projectSearchInputV074 = document.getElementById('projectSearch');
const projectEmptyV074 = document.getElementById('projectEmpty');
let activeProjectFilterV074 = 'all';


function normalizeSearchV082(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function applyProjectFiltersV074() {
  if (!projectCards.length) return;
  const query = normalizeSearchV082((projectSearchInputV074?.value || '').trim());
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = (card.dataset.projectCategory || '').split(' ');
    const haystack = normalizeSearchV082(`${card.dataset.projectName || ''} ${card.textContent || ''}`);
    const matchesFilter = activeProjectFilterV074 === 'all' || categories.includes(activeProjectFilterV074);
    const matchesSearch = !query || haystack.includes(query);
    const visible = matchesFilter && matchesSearch;

    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (projectEmptyV074) projectEmptyV074.hidden = visibleCount !== 0;
}

projectFilterButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    activeProjectFilterV074 = button.dataset.projectFilter || 'all';
    projectFilterButtons.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    applyProjectFiltersV074();

    projectCards.forEach((card) => {
      if (!card.hidden && typeof card.animate === 'function') {
        card.animate([
          { opacity: 0.72, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }
    });
  });
});

if (projectSearchInputV074) {
  projectSearchInputV074.addEventListener('input', applyProjectFiltersV074);
}

applyProjectFiltersV074();


// : ajustes técnicos de performance e acessibilidade aplicados.
document.documentElement.classList.add('v076-performance');


// : suporte publico, FAQ e status adicionados.
document.documentElement.classList.add('v079-support');


// : polimento visual final aplicado.
document.documentElement.classList.add('v081-final-polish');

// : revisão de bugs aplicada.
document.documentElement.classList.add('v082-bugfix-review');
