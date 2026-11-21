// islamhassadya.com: menu, project filters, scroll spy, reveal, copy email.
// Add ?edit to the address (islamhassadya.com/?edit) to open the built-in designer.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // mobile menu
  const menu = $('#menuBtn'), links = $('#navLinks');
  menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });

  // theme: light violet / dark gold, remembered between visits
  const root = document.documentElement, tbtn = $('#themeBtn'), fav = $('#favicon'), meta = $('meta[name="theme-color"]');
  const applyTheme = t => {
    if (t === 'dark') root.dataset.theme = 'dark'; else delete root.dataset.theme;
    tbtn.setAttribute('aria-label', t === 'dark' ? 'Switch to the light violet theme' : 'Switch to the dark gold theme');
    if (fav) fav.href = t === 'dark' ? 'assets/favicon-gold.png?v=1' : 'assets/favicon.png?v=4';
    if (meta) meta.content = t === 'dark' ? '#0b0b0c' : '#1c1a4d';
  };
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  tbtn.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(t); try { localStorage.setItem('ih-theme', t); } catch (e) {}
  });

  // nav border once scrolled
  const nav = $('.nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

  // project filters
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.toggle('on', x === c));
    $$('#projects .project').forEach(p => { p.hidden = c.dataset.f !== 'all' && !p.dataset.cat.split(' ').includes(c.dataset.f); });
  }));

  // screenshot galleries: thumbnails swap the main image
  $$('.thumbs').forEach(t => t.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const img = t.parentElement.querySelector('.shot img');
    $$('button', t).forEach(x => x.classList.toggle('on', x === b));
    img.src = b.dataset.src; img.alt = b.querySelector('img').alt;
  }));

  // lightbox: click a screenshot to see it full size
  const lb = $('#lightbox');
  if (lb && lb.showModal) {
    $$('.shot').forEach(s => s.addEventListener('click', () => {
      if (document.body.classList.contains('ds-editing')) return;
      const i = $('img', s); $('img', lb).src = i.src; $('img', lb).alt = i.alt; lb.showModal();
    }));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) lb.close(); });
  }

  // scroll spy + reveal
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
    if (!location.search.includes('edit')) {
      const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
      $$('.sec-head, .sec-lead, .now-card, .project, .org, .org-card, .mini-head, .timeline > li, .edu li, .awards li, .skills > div, .facts').forEach(el => { el.classList.add('reveal'); rv.observe(el); });
    }
  }

  // copy email
  const toast = $('#toast');
  PCsay = t => { toast.textContent = t; toast.classList.add('show'); clearTimeout(PCsay.t); PCsay.t = setTimeout(() => toast.classList.remove('show'), 2000); };
  $('#copyEmail').addEventListener('click', e => {
    const em = e.currentTarget.dataset.email;
    (navigator.clipboard ? navigator.clipboard.writeText(em) : Promise.reject()).then(() => PCsay('Email copied'), () => PCsay(em));
  });

  $('#yr').textContent = new Date().getFullYear();

  // the designer only loads for you, at ?edit
  if (/[?&]edit\b/.test(location.search)) { const s = document.createElement('script'); s.src = 'designer.js'; document.body.appendChild(s); }
})();
var PCsay;
