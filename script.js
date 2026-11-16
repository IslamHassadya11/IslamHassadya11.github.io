// islamhassadya.com: menu, project filters, scroll spy, reveal, copy email.
// Add ?edit to the address (islamhassadya.com/?edit) to open the built-in designer.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // mobile menu
  const menu = $('#menuBtn'), links = $('#navLinks');
  menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });

  // nav border once scrolled
  const nav = $('.nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

  // project filters
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.toggle('on', x === c));
    $$('#projectGrid .project').forEach(p => { p.hidden = c.dataset.f !== 'all' && !p.dataset.cat.split(' ').includes(c.dataset.f); });
  }));

  // scroll spy + reveal
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
    if (!location.search.includes('edit')) {
      const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
      $$('.sec-head, .now-card, .project, .timeline > li, .edu li, .awards li, .skills > div, .facts').forEach(el => { el.classList.add('reveal'); rv.observe(el); });
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
