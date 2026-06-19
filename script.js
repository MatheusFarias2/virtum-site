
const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
const year = document.getElementById('year');
const toast = document.getElementById('toast');
let toastTimer;

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
  const closeMobileMenu = () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMobileMenu();
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

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

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Mensagem demonstrativa registrada na interface. Depois podemos ligar isso ao WhatsApp ou e-mail real.');
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

projectFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter;
    projectFilterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    projectCards.forEach((card) => {
      const categories = card.dataset.projectCategory || '';
      const visible = filter === 'all' || categories.split(' ').includes(filter);
      card.hidden = !visible;
    });
  });
});

// v0.6.7: header mais firme ao rolar a página
const siteHeader = document.querySelector('.site-header[data-header="refined"]');
if (siteHeader) {
  const syncHeaderScroll = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  syncHeaderScroll();
  window.addEventListener('scroll', syncHeaderScroll, { passive: true });
}


// v0.6.9: microinterações leves
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
  '.project-card, .tech-panel, .module-card, .summary-card-v064, .roadmap-card, .contact-card-v065, .flow-steps-v065 div'
);

glowCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });

  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
});

// Pequeno refinamento: feedback visual ao filtrar projetos sem travar layout
projectFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    projectCards.forEach((card) => {
      if (!card.hidden) {
        card.animate(
          [
            { opacity: 0.72, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
      }
    });
  });
});


// v0.7.0: polimento visual geral
const progressBarV070 = document.createElement('div');
progressBarV070.className = 'scroll-progress-v070';
progressBarV070.setAttribute('aria-hidden', 'true');
document.body.appendChild(progressBarV070);

function syncScrollProgressV070() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  progressBarV070.style.transform = `scaleX(${progress})`;
}

syncScrollProgressV070();
window.addEventListener('scroll', syncScrollProgressV070, { passive: true });
window.addEventListener('resize', syncScrollProgressV070);

// Evita foco preso depois de clique com mouse, mantendo acessibilidade por teclado
document.addEventListener('pointerdown', () => {
  document.body.classList.add('using-pointer');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    document.body.classList.remove('using-pointer');
  }
});


// v0.7.0.3: revisão fina pós-polimento
document.documentElement.classList.add('v0703-polished');
