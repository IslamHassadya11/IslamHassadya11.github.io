"""Builds islamhassadya.com/mesila/ from the Mesila repository (github.com/IslamHassadya11/Mesila).

The app can sign people in with their Claude account when it runs as a Claude artifact. On this
site there is no such account, so this build makes the start page lead straight into guest mode:
grades are kept in the visitor's own browser (localStorage) and nothing is sent anywhere.

Usage: python3 tools/build_mesila.py PATH_TO_MESILA_CHECKOUT
"""
import pathlib, shutil, sys

src = pathlib.Path(sys.argv[1])
out = pathlib.Path(__file__).resolve().parent.parent / 'mesila'
if out.exists():
    shutil.rmtree(out)
for part in ('css', 'js', 'data', 'fonts'):
    shutil.copytree(src / part, out / part)

html = (src / 'index.html').read_text(encoding='utf-8')
app = (src / 'js' / 'app.js').read_text(encoding='utf-8')


def rep(text, a, b):
    assert text.count(a) == 1, (text.count(a), a[:80])
    return text.replace(a, b)


# start page: one button, guest mode only
html = rep(html, '<button class="acct" id="acctBtn" type="button" disabled><span class="spin" id="acctSpin"></span><img id="acctImg" alt="" hidden><span><b id="acctName">Checking your Claude account…</b><small id="acctSub">One moment</small></span></button>\n<div class="or">or</div>\n<button class="btn sec" id="guestBtn" type="button">Continue as guest</button>',
           '<button class="btn" id="guestBtn" type="button">Get started</button>')
html = rep(html, '<h2 id="siT">Sign in</h2>', '<h2 id="siT">Check your chances</h2>')
html = rep(html, '<p class="mute" id="siP" style="margin:-6px 0 0">Save your grades and come back to them any time.</p>',
           '<p class="mute" id="siP" style="margin:-6px 0 0">No account needed. Your grades are saved on this device, so you can come back to them any time.</p>')
html = rep(html, '<p class="fine" id="siFine">No password here: signing in uses the Claude account you\'re already logged into. As a guest, your grades stay in this browser only.</p>',
           '<p class="fine" id="siFine">Everything is worked out in your browser. Nothing you type is sent anywhere.</p>\n<p class="fine"><a href="/">← Back to islamhassadya.com</a></p>')
html = rep(html, 'Signed in, your grades are saved to your account</li>', 'Your grades stay on your device</li>')
html = rep(html, '<button type="button" data-act="out">Sign out</button>', '<button type="button" data-act="out">Back to the start page</button>')
html = rep(html, '<title>Mesila · admission calculator</title>',
           '<title>Mesila · Israeli admission calculator</title>\n<meta name="description" content="Check your bagrut and psychometric against the admission rules of 600+ programs at Israel\'s universities and colleges.">')

# no Claude account on this site
app = rep(app, "function siState(){const b=$('#acctBtn');", "function siState(){const b=$('#acctBtn');if(!b)return;")
app = rep(app, 'async function initAccount(){', 'async function initAccount(){acctReady=true;return;')
app = rep(app, "'Guest · grades saved in this browser only'", "'Saved in this browser only'")

(out / 'index.html').write_text(html, encoding='utf-8')
(out / 'js' / 'app.js').write_text(app, encoding='utf-8')
print('mesila/ written from', src)
