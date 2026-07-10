
(function () {
  const ROUTES = ['home', 'about', 'projects', 'contacts'];
  const DEFAULT_ROUTE = 'home';

  const TITLES = {
    home: 'python разработчик - telegram боты и веб сервисы',
    about: 'Обо мне - python разработчик',
    projects: 'Проекты - python разработчик',
    contacts: 'Контакты - python разработчик'
  };

  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-route]');
  const header = document.getElementById('siteHeader');

  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function getRouteFromHash() {
    const hash = window.location.hash.replace('#', '');
    return ROUTES.includes(hash) ? hash : DEFAULT_ROUTE;
  }

  function renderRoute() {
    const route = getRouteFromHash();

    pages.forEach((page) => {
      const isActive = page.dataset.page === route;
      page.classList.toggle('page--active', isActive);
      page.setAttribute('aria-hidden', String(!isActive));
    });

    navLinks.forEach((link) => {
      const isActive = link.dataset.route === route;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    document.title = TITLES[route] || TITLES[DEFAULT_ROUTE];
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeMobileNav();
  }

  window.addEventListener('hashchange', renderRoute);

  function openMobileNav() {
    mobileNav.classList.add('is-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('is-open');
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  function initHeaderScrollState() {
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.elements['name'].value.trim();
      const message = form.elements['message'].value.trim();

      if (!name || !message) {
        showFormStatus('Заполните имя и сообщение.', 'error');
        return;
      }

      const subject = encodeURIComponent(`Заявка с сайта от ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}`);
      const mailtoLink = `mailto:sabotagerabota@mail.ru?subject=${subject}&body=${body}`;

      showFormStatus('Открываю почтовый клиент…', 'success');
      window.location.href = mailtoLink;

      setTimeout(() => form.reset(), 400);
    });
  }

  function showFormStatus(text, type) {
    const status = document.getElementById('formStatus');
    if (!status) return;
    status.textContent = text;
    status.className = `form__status form__status--${type}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
      window.location.hash = DEFAULT_ROUTE;
    }

    renderRoute();
    initHeaderScrollState();
    initContactForm();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();