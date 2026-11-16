/* ─────────────────────────────────────────────────────────────
   Site designer. Only loads at islamhassadya.com/?edit (or index.html?edit).
   Change colours, fonts, the photo, shapes and any text on the page, then
   press "Download my site". Upload the downloaded index.html (and the photo,
   if you changed it) to the IslamHassadya11.github.io repository.
   ───────────────────────────────────────────────────────────── */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const VARS = [['--g1', 'Deep shapes & headings'], ['--g2', 'Main accent & buttons'], ['--g3', 'Light accent'], ['--g4', 'Highlight'], ['--bg', 'Page background'], ['--paper', 'Cards'], ['--ink', 'Text']];
  const PRESETS = {
    'Violet geometric': { '--g1': '#1c1a4d', '--g2': '#4a1fe8', '--g3': '#8b6cff', '--g4': '#e15bff', '--bg': '#f5f5f8', '--paper': '#ffffff', '--ink': '#16142e' },
    'Navy & magenta': { '--g1': '#1d1f4f', '--g2': '#7a2cf0', '--g3': '#c86bff', '--g4': '#ff5fd2', '--bg': '#f2f2f4', '--paper': '#ffffff', '--ink': '#17172b' },
    'Royal blue': { '--g1': '#0f1e46', '--g2': '#1f5eff', '--g3': '#6fa0ff', '--g4': '#22d3ee', '--bg': '#f4f6fa', '--paper': '#ffffff', '--ink': '#0e1a33' },
    'Midnight': { '--g1': '#e9e6ff', '--g2': '#8b6cff', '--g3': '#5b3fd6', '--g4': '#e15bff', '--bg': '#0f0d26', '--paper': '#17143a', '--ink': '#efeefe' },
    'Graphite': { '--g1': '#141414', '--g2': '#3b3b3b', '--g3': '#8a8a8a', '--g4': '#c9c9c9', '--bg': '#f6f6f6', '--paper': '#ffffff', '--ink': '#141414' },
  };
  const FONTS = ['Source Sans 3', 'Inter', 'Poppins', 'Montserrat', 'Space Grotesk', 'Manrope', 'DM Sans', 'Playfair Display', 'Archivo Black'];
  const SHAPES = [['hex', 'Hexagon'], ['circle', 'Circle'], ['square', 'Square'], ['triangle', 'Triangle']];
  const KEY = 'ih-designer-draft';
  const draft = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  const st = { vars: {}, head: null, body: null, radius: null, shape: null, photo: null, seeds: {}, hidden: [], text: {}, ...draft };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ ...st, photo: null })); } catch (e) { /* full */ } };
  const cur = v => getComputedStyle(root).getPropertyValue(v).trim();

  /* ── apply state to the live page ── */
  const loadFont = f => { if (!f || $(`link[data-font="${f}"]`)) return; const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.font = f; l.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900&display=swap`; document.head.appendChild(l); };
  function themeCSS() {
    const lines = Object.entries(st.vars).map(([k, v]) => `${k}: ${v};`);
    if (st.head) lines.push(`--head: '${st.head}', system-ui, sans-serif;`);
    if (st.body) lines.push(`--font: '${st.body}', system-ui, sans-serif;`);
    if (st.radius !== null) lines.push(`--radius: ${st.radius}px;`);
    return lines.length ? `:root { ${lines.join(' ')} }` : '';
  }
  function apply() {
    $('#custom-theme').textContent = themeCSS();
    loadFont(st.head); loadFont(st.body);
    const fig = $('.portrait');
    if (st.shape) fig.className = 'portrait shape-' + st.shape;
    if (st.photo) $('#portrait').src = st.photo;
    $$('main > section[id], main > .section').forEach(s => { s.hidden = st.hidden.includes(s.id); });
    save();
  }

  /* ── triangle mosaics (same maths as tools/geo.py) ── */
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function mosaic(cols, rows, side, corner, reach, seed, hollow) {
    const r = rng(seed), h = side * Math.sqrt(3) / 2, W = cols * side / 2 + side / 2, H = rows * h, out = [];
    const pick = () => { const x = r() * 12; return x < 3 ? 'g1' : x < 7 ? 'g2' : x < 10 ? 'g3' : 'g4'; };
    for (let y = 0; y < rows; y++) for (let c = 0; c < cols; c++) {
      const up = (y + c) % 2 === 0, x0 = c * side / 2, y0 = y * h, y1 = (y + 1) * h;
      const pts = up ? [[x0, y1], [x0 + side / 2, y0], [x0 + side, y1]] : [[x0, y0], [x0 + side, y0], [x0 + side / 2, y1]];
      const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
      const fx = corner.includes('l') ? cx / W : 1 - cx / W, fy = corner.includes('t') ? cy / H : 1 - cy / H;
      const d = Math.hypot(fx, fy * 1.25) / reach;
      if (r() > (1 - d) * 1.35 + 0.08 * r()) continue;
      const cls = pick(), k = r() < hollow ? 0.45 : 1;
      out.push(`<polygon class="${cls}" points="${pts.map(([x, yy]) => `${(cx + (x - cx) * k).toFixed(1)},${(cy + (yy - cy) * k).toFixed(1)}`).join(' ')}"/>`);
    }
    return { W, H, html: out.join('') };
  }
  const GEO = { corner: [15, 4, 70, 'tl', 0.95, 0.12], band: [34, 3, 64, 'tr', 1.6, 0.18], contact: [13, 5, 80, 'br', 1.0, 0.12] };
  function regen(name) {
    const svg = $('.geo-' + name); if (!svg) return;
    const [c, rws, side, corner, reach, hollow] = GEO[name];
    const m = mosaic(c, rws, side, corner, reach, st.seeds[name], hollow);
    svg.setAttribute('viewBox', `0 0 ${Math.round(m.W)} ${Math.round(m.H)}`); svg.innerHTML = m.html;
  }

  /* ── text editing ── */
  let editing = false;
  const editable = () => $$('[data-edit]');
  // page layout changed since the draft was saved? drop old text edits so they don't land in the wrong place
  if (st.textCount !== editable().length) { st.text = {}; st.textCount = editable().length; }
  editable().forEach((el, i) => { el.dataset.editId = i; if (st.text[i] !== undefined) el.innerHTML = st.text[i]; });
  document.addEventListener('input', e => { const el = e.target.closest('[data-edit]'); if (el) { st.text[el.dataset.editId] = el.innerHTML; save(); } });
  function setEditing(on) {
    editing = on;
    editable().forEach(el => { if (on) el.setAttribute('contenteditable', 'true'); else el.removeAttribute('contenteditable'); });
    document.body.classList.toggle('ds-editing', on);
  }
  // keep links usable for editing: don't navigate while editing
  document.addEventListener('click', e => { if (editing && e.target.closest('[data-edit]') && e.target.closest('a')) e.preventDefault(); }, true);

  /* ── panel ── */
  const css = document.createElement('style'); css.id = 'ds-style';
  css.textContent = `
  .ds { position: fixed; top: 84px; right: 16px; z-index: 100; width: 300px; max-height: calc(100vh - 100px); overflow: auto; background: #fff; color: #16142e; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,.25); font: 500 14px/1.4 'Source Sans 3', system-ui, sans-serif; }
  .ds.min .ds-body { display: none; }
  .ds h4 { margin: 0; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #4a1fe8; }
  .ds-top { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid #eee; position: sticky; top: 0; background: #fff; }
  .ds-top b { flex: 1; font-size: 15px; }
  .ds-top button, .ds-row button, .ds select, .ds input[type=range] { font: inherit; }
  .ds-sec { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; display: grid; gap: 8px; }
  .ds-cols { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 10px; }
  .ds label { display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .ds input[type=color] { width: 30px; height: 26px; border: 1px solid #ccc; border-radius: 6px; padding: 0; background: none; cursor: pointer; flex: none; }
  .ds select { width: 100%; padding: 6px; border-radius: 6px; border: 1px solid #ccc; }
  .ds-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .ds-row button { padding: 6px 10px; border-radius: 6px; border: 1px solid #ccc; background: #fafafa; cursor: pointer; }
  .ds-row button.on { background: #1c1a4d; color: #fff; border-color: #1c1a4d; }
  .ds .ds-main { width: 100%; padding: 10px; border: 0; border-radius: 8px; background: #4a1fe8; color: #fff; font-weight: 700; cursor: pointer; }
  .ds .ds-note { font-size: 12px; color: #666; }
  .ds-tog { display: flex; justify-content: space-between; }
  body.ds-editing [data-edit] { outline: 1.5px dashed rgba(74,31,232,.45); outline-offset: 3px; cursor: text; }
  body.ds-editing [data-edit]:focus { outline: 2px solid #4a1fe8; background: rgba(139,108,255,.08); }
  @media (max-width: 720px) { .ds { left: 8px; right: 8px; width: auto; top: auto; bottom: 8px; max-height: 60vh; } }`;
  document.head.appendChild(css);

  const p = document.createElement('aside');
  p.className = 'ds'; p.setAttribute('aria-label', 'Site designer');
  const sec = (title, html) => `<div class="ds-sec"><h4>${title}</h4>${html}</div>`;
  const sectionsList = $$('main > section[id]').map(s => [s.id, (s.querySelector('h2') || {}).textContent || s.id]);
  p.innerHTML = `
    <div class="ds-top"><b>🎨 Design your site</b><button id="dsMin" title="Minimise">–</button></div>
    <div class="ds-body">
      ${sec('Edit text', `<div class="ds-row"><button id="dsText">✏️ Edit text on the page</button></div><p class="ds-note">Click any heading or paragraph and type. Outlined text can be edited.</p>`)}
      ${sec('Colour presets', `<div class="ds-row">${Object.keys(PRESETS).map(n => `<button data-preset="${n}">${n}</button>`).join('')}</div>`)}
      ${sec('Colours', `<div class="ds-cols">${VARS.map(([v, l]) => `<label><input type="color" data-var="${v}">${l}</label>`).join('')}</div>`)}
      ${sec('Fonts', `<label>Headings <select id="dsHead">${FONTS.map(f => `<option>${f}</option>`).join('')}</select></label><label>Text <select id="dsBody">${FONTS.map(f => `<option>${f}</option>`).join('')}</select></label>`)}
      ${sec('Corners', `<label>Roundness <input type="range" id="dsRad" min="0" max="24" step="1"></label>`)}
      ${sec('Your photo', `<div class="ds-row">${SHAPES.map(([k, l]) => `<button data-shape="${k}">${l}</button>`).join('')}</div><label><input type="file" id="dsPhoto" accept="image/*"></label><p class="ds-note">If you change the photo, the download also saves it as <b>islam.jpg</b>. Upload it into the <b>assets</b> folder.</p>`)}
      ${sec('Triangles', `<div class="ds-row"><button data-regen="corner">Shuffle top</button><button data-regen="band">Shuffle middle</button><button data-regen="contact">Shuffle bottom</button></div>`)}
      ${sec('Sections', sectionsList.map(([id, t]) => `<label class="ds-tog">${t.trim()}<input type="checkbox" data-sec="${id}"></label>`).join(''))}
      <div class="ds-sec"><button class="ds-main" id="dsSave">⬇ Download my site</button><div class="ds-row"><button id="dsReset">Reset everything</button><a href="./" style="align-self:center;margin-inline-start:auto">Preview</a></div>
      <p class="ds-note">Then on GitHub: open <b>IslamHassadya11.github.io</b> → <b>Add file → Upload files</b> → drop <b>index.html</b> → <b>Commit</b>. The live site updates in about a minute.</p></div>
    </div>`;
  document.body.appendChild(p);

  // fill controls
  const fresh = () => {
    $$('[data-var]', p).forEach(i => { i.value = toHex(st.vars[i.dataset.var] || cur(i.dataset.var)); });
    $('#dsHead').value = st.head || 'Source Sans 3'; $('#dsBody').value = st.body || 'Source Sans 3';
    $('#dsRad').value = st.radius ?? 4;
    $$('[data-shape]', p).forEach(b => b.classList.toggle('on', (st.shape || 'hex') === b.dataset.shape));
    $$('[data-sec]', p).forEach(c => { c.checked = !st.hidden.includes(c.dataset.sec); });
  };
  function toHex(c) { if (/^#[0-9a-f]{6}$/i.test(c)) return c; const d = document.createElement('div'); d.style.color = c; document.body.appendChild(d); const m = getComputedStyle(d).color.match(/\d+/g); d.remove(); return m ? '#' + m.slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('') : '#000000'; }

  p.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset.var) { st.vars[t.dataset.var] = t.value; apply(); }
    if (t.id === 'dsRad') { st.radius = +t.value; apply(); }
  });
  p.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'dsHead') { st.head = t.value; apply(); }
    if (t.id === 'dsBody') { st.body = t.value; apply(); }
    if (t.dataset.sec) { st.hidden = t.checked ? st.hidden.filter(x => x !== t.dataset.sec) : [...st.hidden, t.dataset.sec]; apply(); }
    if (t.id === 'dsPhoto' && t.files[0]) {
      const img = new Image(), fr = new FileReader();
      fr.onload = () => { img.onload = () => {
        // square-crop to 800×800 JPEG so it stays light
        const s = Math.min(img.width, img.height), cv = document.createElement('canvas'); cv.width = cv.height = 800;
        cv.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 800, 800);
        st.photo = cv.toDataURL('image/jpeg', 0.88); apply(); PCsay && PCsay('Photo updated');
      }; img.src = fr.result; };
      fr.readAsDataURL(t.files[0]);
    }
  });
  p.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'dsMin') { p.classList.toggle('min'); b.textContent = p.classList.contains('min') ? '+' : '–'; }
    if (b.id === 'dsText') { setEditing(!editing); b.classList.toggle('on', editing); b.textContent = editing ? '✅ Done editing text' : '✏️ Edit text on the page'; }
    if (b.dataset.preset) { st.vars = { ...PRESETS[b.dataset.preset] }; apply(); fresh(); }
    if (b.dataset.shape) { st.shape = b.dataset.shape; apply(); fresh(); }
    if (b.dataset.regen) { st.seeds[b.dataset.regen] = Math.floor(Math.random() * 1e9); regen(b.dataset.regen); save(); }
    if (b.id === 'dsReset') { if (confirm('Reset all your design changes and text edits on this page?')) { localStorage.removeItem(KEY); location.reload(); } }
    if (b.id === 'dsSave') download();
  });

  /* ── export a clean index.html ── */
  function download() {
    const wasEditing = editing; setEditing(false);
    const doc = document.documentElement.cloneNode(true);
    doc.querySelectorAll('.ds, #ds-style, script[src="designer.js"], link[data-font]').forEach(n => n.remove());
    doc.querySelectorAll('[data-edit-id]').forEach(n => n.removeAttribute('data-edit-id'));
    doc.querySelectorAll('.reveal').forEach(n => n.classList.remove('reveal', 'in'));
    doc.querySelectorAll('[class=""]').forEach(n => n.removeAttribute('class'));
    doc.querySelector('body').classList.remove('ds-editing');
    doc.querySelectorAll('section[hidden]').forEach(n => n.removeAttribute('hidden'));
    st.hidden.forEach(id => { const s = doc.querySelector('#' + id); if (s) s.setAttribute('hidden', ''); });
    doc.querySelector('#custom-theme').textContent = themeCSS();
    // one Google Fonts link with every font in use
    const fams = [...new Set(['Source Sans 3', st.head, st.body].filter(Boolean))];
    const fl = doc.querySelector('link[href*="fonts.googleapis.com/css2"]');
    if (fl) fl.href = 'https://fonts.googleapis.com/css2?' + fams.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&') + '&display=swap';
    const img = doc.querySelector('#portrait'); if (img) img.setAttribute('src', 'assets/islam.jpg');
    doc.querySelector('#navLinks')?.classList.remove('open');
    doc.querySelectorAll('.nav-links a.on').forEach(a => a.classList.remove('on'));
    doc.querySelector('.nav')?.classList.remove('scrolled');
    const html = '<!DOCTYPE html>\n' + doc.outerHTML;
    const get = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); };
    get(new Blob([html], { type: 'text/html' }), 'index.html');
    if (st.photo) fetch(st.photo).then(r => r.blob()).then(b => setTimeout(() => get(b, 'islam.jpg'), 400));
    PCsay && PCsay(st.photo ? 'Downloaded index.html + islam.jpg' : 'Downloaded index.html');
    if (wasEditing) setEditing(true);
  }

  Object.keys(st.seeds).forEach(regen);
  apply(); fresh();
})();
