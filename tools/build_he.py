"""Build he/index.html (Hebrew, right-to-left) from index.html.

Run from the site root:  python3 tools/build_he.py
Every visible string is looked up in tools/he.py; anything missing is listed at the end.
"""
import re, sys, os
from bs4 import BeautifulSoup, NavigableString, Comment
sys.path.insert(0, os.path.dirname(__file__))
from he import HE

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
soup = BeautifulSoup(src, 'html.parser')
norm = lambda s: ' '.join(s.split())
# leave these as they are: names, tech, code, numbers, the other scripts
KEEP = re.compile(r'^([\W\d_]*|[A-Za-z0-9.+#/()★·•–\- ]*[A-Z0-9][A-Za-z0-9.+#/()★·•–\- ]*)$')
missing = []

def tr(text):
    k = norm(text)
    if not k or not re.search(r'[A-Za-z]', k): return None
    if k in HE: return HE[k]
    missing.append(k); return None

# text
for node in soup.find_all(string=True):
    if isinstance(node, Comment) or node.parent.name in ('script', 'style', 'code', 'kbd') or node.find_parent('svg'): continue
    if node.find_parent(class_=['geo-corner', 'geo-band', 'geo-contact']): continue
    he = tr(str(node))
    if he is None: continue
    lead = re.match(r'^\s*', str(node)).group(0); trail = re.search(r'\s*$', str(node)).group(0)
    if he.endswith(('ב', 'ב-', '-')): trail = ''          # Hebrew prefixes attach to the next word
    node.replace_with(NavigableString(lead + he + trail))

# attributes
for el in soup.find_all(True):
    for a in ('alt', 'aria-label', 'title', 'placeholder'):
        if el.has_attr(a):
            he = tr(el[a]);  el[a] = he if he is not None else el[a]
    if el.name == 'meta' and el.has_attr('content') and (el.get('name') in ('description',) or el.get('property') in ('og:title', 'og:description')):
        he = tr(el['content']);  el['content'] = he if he is not None else el['content']

# html element, title, alternates
html = soup.html; html['lang'] = 'he'; html['dir'] = 'rtl'
soup.title.string = HE.get(norm(soup.title.string), soup.title.string)
for m in soup.find_all('meta', property='og:url'): m['content'] = 'https://islamhassadya.com/he/'
og = soup.new_tag('meta', property='og:locale', content='he_IL'); soup.head.append(og)
for lang, href in (('en', 'https://islamhassadya.com/'), ('he', 'https://islamhassadya.com/he/'), ('x-default', 'https://islamhassadya.com/')):
    soup.head.append(soup.new_tag('link', rel='alternate', hreflang=lang, href=href))
fonts = soup.new_tag('link', rel='stylesheet', href='https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&display=swap')
soup.head.append(fonts)

# relative URLs point one folder up
for el in soup.find_all(True):
    for a in ('src', 'href', 'data-src'):
        v = el.get(a)
        if v and not re.match(r'^(#|/|https?:|mailto:|tel:|data:|javascript:)', v):
            el[a] = '../' + v

# language switch: EN on the Hebrew page
sw = soup.find(id='langLink')
if sw: sw['href'] = '/'; sw['hreflang'] = 'en'; sw['lang'] = 'en'; sw['title'] = 'English'; sw['aria-label'] = 'English version'; sw.string = 'EN'

out = str(soup)
os.makedirs(os.path.join(ROOT, 'he'), exist_ok=True)
open(os.path.join(ROOT, 'he', 'index.html'), 'w', encoding='utf-8').write(out)
miss = sorted(set(m for m in missing if not KEEP.match(m)))
print(f'he/index.html written. {len(miss)} untranslated strings' + (':' if miss else '.'))
for m in miss: print('  -', m)
