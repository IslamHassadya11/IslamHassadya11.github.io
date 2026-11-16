// Islam Hassadya — portfolio interactions (theme, menu, filters, scroll spy, reveal, copy email)
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  // theme: saved choice → otherwise follow the system
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  if (!root.dataset.theme) root.dataset.theme = isDark() ? 'dark' : 'light';
  $('#themeBtn').addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('ih-theme', root.dataset.theme); } catch (e) { /* private mode */ }
  });

  // mobile menu
  const menu = $('#menuBtn'), links = $('#navLinks');
  menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });

  // nav border on scroll
  const nav = $('.nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

  // project filters
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.toggle('on', x === c));
    const f = c.dataset.f;
    $$('#projectGrid .project').forEach(p => { p.hidden = f !== 'all' && !p.dataset.cat.split(' ').includes(f); });
  }));

  // scroll spy + reveal
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
    const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.section h2, .now-card, .project, .timeline li, .edu li, .awards li, .skills > div').forEach(el => { el.classList.add('reveal'); rv.observe(el); });
  }

  // copy email
  const toast = $('#toast');
  const say = t => { toast.textContent = t; toast.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 1800); };
  $('#copyEmail').addEventListener('click', e => {
    const em = e.currentTarget.dataset.email;
    (navigator.clipboard ? navigator.clipboard.writeText(em) : Promise.reject()).then(() => say('Email copied'), () => say(em));
  });

  $('#yr').textContent = new Date().getFullYear();
})();
