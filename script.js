// islamhassadya.com: menu, project filters, scroll spy, reveal, copy email.
// Add ?edit to the address (islamhassadya.com/?edit) to open the built-in designer.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // mobile menu
  const menu = $('#menuBtn'), links = $('#navLinks');
  menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });

  // theme: light violet or black with one accent colour; both remembered between visits
  // UI strings for the site chrome (page text itself lives in each language's HTML)
  const UI = {
    en: { toLight: 'Switch to the light theme', toDark: 'Switch to the dark theme', copied: 'Email copied' },
    he: { toLight: 'מעבר לערכת צבעים בהירה', toDark: 'מעבר לערכת צבעים כהה', copied: 'כתובת המייל הועתקה' },
  };
  const L = window.IH_L = k => (UI[document.documentElement.lang] || UI.en)[k] || UI.en[k] || k;
  const root = document.documentElement, tbtn = $('#themeBtn'), fav = $('#favicon'), meta = $('meta[name="theme-color"]'), logoDark = $('#logoDark'), logoLight = $('#logoLight');
  const ACCENTS = { pink: '#ff5fd2', purple: '#a77bff', yellow: '#ffd60a' };
  const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const paint = () => {
    const dark = root.dataset.theme === 'dark', picked = ACCENTS[root.dataset.accent] ? root.dataset.accent : '';
    const acc = picked || (dark ? 'pink' : 'purple');
    if (logoDark) logoDark.src = `/assets/logo-1is-${acc}.png?v=3`;
    if (logoLight) logoLight.src = acc === 'purple' ? '/assets/logo-1is.png?v=4' : `/assets/logo-1is-light-${acc}.png?v=1`;
    if (fav) fav.href = dark ? `/assets/favicon-${acc}.png?v=3` : acc === 'purple' ? '/assets/favicon.png?v=4' : `/assets/favicon-light-${acc}.png?v=1`;
    if (meta) meta.content = dark ? '#000000' : ({ purple: '#1c1a4d', pink: '#2a0f24', yellow: '#1d1a0e' })[acc];
    tbtn.setAttribute('aria-label', L(dark ? 'toLight' : 'toDark'));
    $$('.swatch').forEach(b => b.setAttribute('aria-pressed', b.dataset.accent === acc));
  };
  const setTheme = t => { if (t === 'dark') root.dataset.theme = 'dark'; else delete root.dataset.theme; save('ih-mode', t); paint(); };
  const setAccent = a => { root.dataset.accent = a; save('ih-accent', a); paint(); };
  window.IH = { toggleTheme: () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'), setTheme, setAccent, ACCENTS };
  tbtn.addEventListener('click', IH.toggleTheme);
  $$('.swatch').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
  paint();

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

  // "What I'm working on" reels: screenshots change every few seconds; the round dots pick one.
  // They pause while hovered or focused, when off screen, and for people who prefer less motion.
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const he = document.documentElement.lang === 'he';
  $$('[data-reel]').forEach((reel, n) => {
    const imgs = $$('img', reel), dots = $('.reel-dots', reel);
    let i = 0, timer = 0, paused = false, seen = false;
    imgs.forEach((im, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', he ? `צילום מסך ${k + 1} מתוך ${imgs.length}` : `Screenshot ${k + 1} of ${imgs.length}`);
      b.addEventListener('click', () => { show(k); restart(); });
      dots.appendChild(b);
    });
    const show = k => {
      i = (k + imgs.length) % imgs.length;
      const next = imgs[(i + 1) % imgs.length]; if (next.loading === 'lazy') next.loading = 'eager'; // fetch the next one early
      imgs.forEach((im, j) => im.classList.toggle('on', j === i));
      $$('button', dots).forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
    };
    const tick = () => { if (!paused && seen && !document.hidden) show(i + 1); };
    const restart = () => { clearInterval(timer); if (!calm) timer = setInterval(tick, 3800); };
    show(0);
    setTimeout(restart, n * 900); // cards change one after another, not all at once
    reel.addEventListener('mouseenter', () => paused = true);
    reel.addEventListener('mouseleave', () => paused = false);
    reel.addEventListener('focusin', () => paused = true);
    reel.addEventListener('focusout', () => paused = false);
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { seen = es[0].isIntersecting; }).observe(reel);
    else seen = true;
    $('.reel-view', reel).addEventListener('click', () => {
      const lb = $('#lightbox'); if (!lb || !lb.showModal) return;
      $('img', lb).src = imgs[i].src; $('img', lb).alt = imgs[i].alt; lb.showModal();
    });
  });

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
    (navigator.clipboard ? navigator.clipboard.writeText(em) : Promise.reject()).then(() => PCsay(L('copied')), () => PCsay(em));
  });

  $('#yr').textContent = new Date().getFullYear();

  // the designer only loads for you, at ?edit
  if (/[?&]edit\b/.test(location.search)) { const s = document.createElement('script'); s.src = '/designer.js'; document.body.appendChild(s); }
})();
var PCsay;
