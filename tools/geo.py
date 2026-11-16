"""Generates the triangle mosaics used on the site (deterministic, original artwork).
Colours come from CSS classes .g1-.g4, so they follow the theme / the ?edit colour pickers.
Run:  python3 tools/geo.py  → rewrites the <!--GEO:...--> blocks in index.html"""
import math, random, re, pathlib

def mosaic(cols, rows, side, corner='tl', reach=0.85, seed=11, hollow=0.12):
    rnd = random.Random(seed)
    h = side * math.sqrt(3) / 2
    W, H = cols * side / 2 + side / 2, rows * h
    out = []
    for r in range(rows):
        for c in range(cols):
            up = (r + c) % 2 == 0
            x0 = c * side / 2
            y0, y1 = r * h, (r + 1) * h
            pts = [(x0, y1), (x0 + side / 2, y0), (x0 + side, y1)] if up else [(x0, y0), (x0 + side, y0), (x0 + side / 2, y1)]
            cx, cy = sum(p[0] for p in pts) / 3, sum(p[1] for p in pts) / 3
            fx = cx / W if 'l' in corner else 1 - cx / W
            fy = cy / H if 't' in corner else 1 - cy / H
            d = math.hypot(fx, fy * 1.25) / reach
            if rnd.random() > (1 - d) * 1.35 + 0.08 * rnd.random():
                continue
            cls = rnd.choices(['g1', 'g2', 'g3', 'g4'], [3, 4, 3, 2])[0]
            P = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
            if rnd.random() < hollow:
                k = 0.45
                inner = ' '.join(f'{cx + (x - cx) * k:.1f},{cy + (y - cy) * k:.1f}' for x, y in pts)
                out.append(f'<polygon class="{cls}" points="{inner}"/>')
            else:
                out.append(f'<polygon class="{cls}" points="{P}"/>')
    return W, H, out

def svg(name, cols, rows, side, corner, **kw):
    W, H, polys = mosaic(cols, rows, side, corner, **kw)
    return f'<svg class="geo geo-{name}" viewBox="0 0 {W:.0f} {H:.0f}" aria-hidden="true" focusable="false">{"".join(polys)}</svg>'

BLOCKS = {
    'corner': lambda: svg('corner', 15, 4, 70, 'tl', reach=0.95, seed=7),
    'band': lambda: svg('band', 34, 3, 64, 'tr', reach=1.6, seed=21, hollow=0.18),
    'contact': lambda: svg('contact', 13, 5, 80, 'br', reach=1.0, seed=3),
}
if __name__ == '__main__':
    p = pathlib.Path(__file__).resolve().parent.parent / 'index.html'
    s = p.read_text(encoding='utf-8')
    for k, f in BLOCKS.items():
        s = re.sub(rf'<!--GEO:{k}-->.*?<!--/GEO-->', f'<!--GEO:{k}-->{f()}<!--/GEO-->', s, flags=re.S)
    p.write_text(s, encoding='utf-8')
    print('ok')
