"""Builds islamhassadya.com/mesila/ from the Mesila artifact files.

The artifact can sign people in with their Claude account. On this site there is no such
account, so this build makes the start page lead straight into guest mode: grades are kept
in the visitor's own browser (localStorage) and nothing is sent anywhere.

Usage: python3 tools/build_mesila.py SRC_DIR   (SRC_DIR holds index.html, data-unis.js, data-cols.js)
"""
import pathlib, shutil, sys

src = pathlib.Path(sys.argv[1])
out = pathlib.Path(__file__).resolve().parent.parent / 'mesila'
out.mkdir(exist_ok=True)
s = (src / 'index.html').read_text(encoding='utf-8')

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:70])
    s = s.replace(a, b)

# start page: one button, guest mode only
rep('<button class="acct" id="acctBtn" type="button" disabled><span class="spin" id="acctSpin"></span><img id="acctImg" alt="" hidden><span><b id="acctName">Checking your Claude account…</b><small id="acctSub">One moment</small></span></button>\n<div class="or">or</div>\n<button class="btn sec" id="guestBtn" type="button">Continue as guest</button>',
    '<button class="btn" id="guestBtn" type="button">Get started</button>')
rep('<h2 id="siT">Sign in</h2>', '<h2 id="siT">Check your chances</h2>')
rep('<p class="mute" id="siP" style="margin:-6px 0 0">Save your grades and come back to them any time.</p>',
    '<p class="mute" id="siP" style="margin:-6px 0 0">No account needed. Your grades are saved on this device, so you can come back to them any time.</p>')
rep('<p class="fine" id="siFine">No password here: signing in uses the Claude account you\'re already logged into. As a guest, your grades stay in this browser only.</p>',
    '<p class="fine" id="siFine">Everything is worked out in your browser. Nothing you type is sent anywhere.</p>\n<p class="fine"><a href="/">← Back to islamhassadya.com</a></p>')
rep('<li><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>Signed in, your grades are saved to your account</li>',
    '<li><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>Your grades stay on your device</li>')
# account menu
rep('<button type="button" data-act="out">Sign out</button>', '<button type="button" data-act="out">Back to the start page</button>')
rep("'Guest · grades saved in this browser only'", "'Saved in this browser only'")
# no Claude account on this site
rep('function siState(){const b=$(\'#acctBtn\');', 'function siState(){const b=$(\'#acctBtn\');if(!b)return;')
rep('async function initAccount(){', 'async function initAccount(){acctReady=true;return;')
rep('<title>Mesila Admissions</title>', '<title>Mesila · Israeli admission calculator</title>\n<meta name="description" content="Check your bagrut and psychometric against the admission rules of 600+ programs at Israel\'s universities and colleges.">')

# fonts: Heebo served from this site instead of Google Fonts
HE = 'U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F'
LA = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
faces = ''.join(f"@font-face{{font-family:Heebo;font-weight:{w};font-display:swap;src:url(fonts/heebo-{n}-{w}-normal.woff2) format('woff2');unicode-range:{r}}}\n"
                for w in (400, 500, 600, 700, 800) for n, r in (('hebrew', HE), ('latin', LA)))
rep('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n<style>\n',
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%229%22 fill=%22%232f55d4%22/%3E%3Cpath d=%22M8 25 C12 17 20 17 24 8%22 stroke=%22%23fff%22 stroke-width=%223.2%22 fill=%22none%22 stroke-linecap=%22round%22/%3E%3Ccircle cx=%2224%22 cy=%228%22 r=%223%22 fill=%22%23ff6b3d%22/%3E%3C/svg%3E">\n<style>\n' + faces)

(out / 'index.html').write_text(s, encoding='utf-8')
for f in ('data-unis.js', 'data-cols.js'):
    shutil.copy(src / f, out / f)
print('mesila/ written')
