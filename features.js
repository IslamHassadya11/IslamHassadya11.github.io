// islamhassadya.com: scroll progress, back-to-top, and the quick-jump menu (Ctrl+K or /).
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (new URLSearchParams(location.search).has('edit')) return; // keep the designer uncluttered

  // ── scroll progress + back to top ──
  const bar = $('#progress'), top = $('#toTop');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
    top.classList.toggle('show', scrollY > innerHeight * 0.9);
  };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // ── quick-jump menu ──
  const dlg = $('#cmdk'), input = $('#cmdkInput'), list = $('#cmdkList');
  if (!dlg || !dlg.showModal) return;
  const go = el => { dlg.close(); el && el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const open = url => { dlg.close(); window.open(url, url.startsWith('/') ? '_self' : '_blank', 'noopener'); };
  const toast = msg => window.PCsay ? window.PCsay(msg) : null;
  const email = 'ihassadya@gmail.com';

  const items = () => {
    const out = [];
    const sec = (label, id, ic) => { const el = document.getElementById(id); if (el) out.push({ g: 'Sections', label, ic, run: () => go(el) }); };
    sec('About me', 'about', '01'); sec('Projects', 'projects', '03'); sec('Community', 'community', '04');
    sec('Experience', 'experience', '05'); sec('Education and awards', 'education', '06'); sec('Skills', 'skills', '08'); sec('Contact', 'contact', '09');
    $$('#projects .case').forEach(c => {
      const h = $('h3', c), demo = $$('.p-links a', c).find(a => /Live demo|Open the app/i.test(a.textContent));
      out.push({ g: 'Projects', label: h.textContent.trim(), ic: '▲', hint: $('.label', c)?.textContent.trim(), run: () => go(c) });
      if (demo) out.push({ g: 'Open live', label: `Open ${h.textContent.trim()}`, ic: '↗', hint: demo.getAttribute('href'), run: () => open(demo.getAttribute('href')) });
    });
    out.push({ g: 'Open live', label: 'Open FureidisTech', ic: '↗', hint: '/fureidistech/', run: () => open('/fureidistech/') });
    const dark = document.documentElement.dataset.theme === 'dark';
    out.push({ g: 'Theme', label: dark ? 'Switch to light theme' : 'Switch to dark theme', ic: dark ? '☀' : '☾', hint: 'T', run: () => { IH.toggleTheme(); dlg.close(); } });
    const names = { ice: 'Ice blue', crimson: 'Crimson', emerald: 'Emerald', mono: 'Black and white only' };
    Object.keys(IH.ACCENTS).forEach(k => out.push({ g: 'Theme', label: `Dark theme: ${names[k]}`, ic: '●', color: IH.ACCENTS[k], run: () => { IH.setAccent(k); dlg.close(); } }));
    out.push({ g: 'Contact', label: 'Copy my email', ic: '⧉', hint: email, run: () => { navigator.clipboard?.writeText(email).then(() => toast('Email copied'), () => {}); dlg.close(); } });
    out.push({ g: 'Contact', label: 'Send me an email', ic: '✉', run: () => { dlg.close(); location.href = 'mailto:' + email; } });
    out.push({ g: 'Contact', label: 'GitHub', ic: '⌥', hint: 'IslamHassadya11', run: () => open('https://github.com/IslamHassadya11') });
    out.push({ g: 'Contact', label: 'LinkedIn', ic: 'in', run: () => open('https://www.linkedin.com/in/islamhassadya/') });
    return out;
  };

  let all = [], shown = [], cur = 0;
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const score = (it, q) => {
    if (!q) return 1;
    const t = (it.label + ' ' + (it.hint || '') + ' ' + it.g).toLowerCase();
    if (t.includes(q)) return 3 - (t.indexOf(q) === 0 ? 0 : 1);
    return q.split(/\s+/).every(w => t.includes(w)) ? 1 : 0; // every word appears somewhere
  };
  const render = () => {
    const q = input.value.trim().toLowerCase();
    shown = all.map(it => [it, score(it, q)]).filter(x => x[1] > 0).sort((a, b) => q ? b[1] - a[1] : 0).map(x => x[0]);
    cur = Math.min(cur, Math.max(0, shown.length - 1));
    if (!shown.length) { list.innerHTML = '<li class="cmdk-empty">Nothing matches. Try "projects" or "email".</li>'; return; }
    let g = '', html = '';
    shown.forEach((it, i) => {
      if (!q && it.g !== g) { g = it.g; html += `<li class="cmdk-group" role="presentation">${esc(g)}</li>`; }
      const ic = it.color ? `<span class="ic" style="background:${it.color};border-color:${it.color}"></span>` : `<span class="ic">${esc(it.ic)}</span>`;
      html += `<li class="cmdk-item${i === cur ? ' on' : ''}" role="option" aria-selected="${i === cur}" data-i="${i}">${ic}<span>${esc(it.label)}</span>${it.hint ? `<span class="hint">${esc(it.hint)}</span>` : ''}</li>`;
    });
    list.innerHTML = html;
    list.querySelector('.on')?.scrollIntoView({ block: 'nearest' });
  };
  const show = () => { all = items(); input.value = ''; cur = 0; render(); dlg.showModal(); input.focus(); };

  $('#cmdBtn').addEventListener('click', show);
  input.addEventListener('input', () => { cur = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { cur = (cur + 1) % Math.max(1, shown.length); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { cur = (cur - 1 + shown.length) % Math.max(1, shown.length); render(); e.preventDefault(); }
    else if (e.key === 'Enter') { shown[cur]?.run(); e.preventDefault(); }
  });
  list.addEventListener('mousemove', e => { const li = e.target.closest('.cmdk-item'); if (li && +li.dataset.i !== cur) { cur = +li.dataset.i; render(); } });
  list.addEventListener('click', e => { const li = e.target.closest('.cmdk-item'); if (li) shown[+li.dataset.i]?.run(); });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? dlg.close() : show(); }
    else if (!typing && !dlg.open && e.key === '/') { e.preventDefault(); show(); }
    else if (!typing && !dlg.open && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 't') IH.toggleTheme();
  });
})();
