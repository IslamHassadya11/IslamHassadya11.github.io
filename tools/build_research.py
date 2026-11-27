"""Build research/index.html from index.html (header, contact, footer) and tools/research_section.html.

Run from the site root:  python3 tools/build_research.py   (then python3 tools/build_he.py builds both Hebrew pages)
"""
import os, re
from bs4 import BeautifulSoup
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
soup = BeautifulSoup(open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read(), 'html.parser')
main = soup.find('main')
for s in main.find_all('section', recursive=False):
    if s.get('id') != 'contact': s.decompose()
for c in list(main.children):
    if getattr(c, 'name', None) is None and 'section' not in str(c).lower(): pass
part = BeautifulSoup(open(os.path.join(ROOT, 'tools', 'research_section.html'), encoding='utf-8').read(), 'html.parser')
main.find('section', id='contact').insert_before(part)
# head
soup.title.string = 'Research & conferences | Islam Hassadya'
for m in soup.find_all('meta'):
    if m.get('property') == 'og:title': m['content'] = 'Research & conferences | Islam Hassadya'
    if m.get('property') == 'og:url': m['content'] = 'https://islamhassadya.com/research/'
    if m.get('name') == 'description' or m.get('property') == 'og:description':
        m['content'] = 'Research and academic conferences by Islam Hassadya: an M.A. thesis on religion and the sacred in the poetry of Wilfred Owen and Siegfried Sassoon, and talks at the University of Haifa.'
for l in soup.find_all('link', rel='canonical'): l['href'] = 'https://islamhassadya.com/research/'
for s in soup.find_all('script', type='application/ld+json'): s.decompose()
# links: sections live on the homepage
for a in soup.find_all('a', href=True):
    h = a['href']
    if h.startswith('#') and h not in ('#top', '#main', '#contact', '#research'): a['href'] = '/' + h
    if h == '/research/': a['class'] = (a.get('class') or []) + ['on']; a['aria-current'] = 'page'
soup.find(class_='logo')['href'] = '/'
soup.find(id='langLink')['href'] = '/he/research/'
for n in main.find('section', id='contact').find_all(class_='num'): n.decompose()
# relative asset URLs one folder up
for el in soup.find_all(True):
    for at in ('src', 'href', 'data-src'):
        v = el.get(at)
        if v and not re.match(r'^(#|/|https?:|mailto:|tel:|data:|javascript:)', v): el[at] = '../' + v
os.makedirs(os.path.join(ROOT, 'research'), exist_ok=True)
open(os.path.join(ROOT, 'research', 'index.html'), 'w', encoding='utf-8').write(str(soup))
print('research/index.html written.')
