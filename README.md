# islamhassadya.com

Personal portfolio of **Islam Hassadya**: software engineering projects, experience, education and contact.

- Live: https://islamhassadya.com
- Plain HTML, CSS and JavaScript, with no build step. It's served by GitHub Pages; the custom domain is in `CNAME`.
- Project demos live in their own repositories and appear under this domain automatically (for example `islamhassadya.com/railyard/`).

## Designing the site yourself

Open **https://islamhassadya.com/?edit**. A design panel lets you:
- edit any text on the page by clicking it,
- change colours (or pick a preset), fonts and corner roundness,
- change the photo and its shape (hexagon, circle, square, triangle),
- reshuffle the triangle patterns and hide or show sections.

When you're done, press **Download my site**, then upload the downloaded `index.html` here (**Add file → Upload files → Commit**). If you changed the photo, also upload `islam.jpg` into the `assets` folder.
Drafts are kept in your browser until you press **Reset everything**. Visitors never see the panel, and nobody else can change the live site this way.

`tools/geo.py` regenerates the triangle artwork. Every shape takes its colour from the `--g1`–`--g4` variables in `style.css`.

## Hosted apps

- `petalcalc/` is the single-file build of [cutie-calc](https://github.com/IslamHassadya11/cutie-calc), served at islamhassadya.com/petalcalc/.
- `assets/shots/` holds the project screenshots (1200×750 JPEG, plus `-t` thumbnails).

## Themes

The button next to the menu switches between the light violet theme and a dark theme in black and white with an accent colour (the logo and browser icon switch too). The choice is remembered in the visitor's browser (`localStorage` key `ih-theme`). Dark colours live in the `html[data-theme="dark"]` block in `style.css`.

Dark theme update: black and white with one accent colour (Pink, Purple or Bright yellow), picked with the dots in the menu bar; each accent has its own logo (`assets/logo-1is-<accent>.png`).

## Shortcuts

- `Ctrl+K` (or `/`) opens the quick-jump menu: sections, every project, live demos, theme and accent, copy email.
- `T` switches between the light and dark themes.

## Hebrew version

`he/index.html` is generated from `index.html`. After editing the English page, run `python3 tools/build_he.py`; it applies the translations in `tools/he.py` and lists any new text that still needs a Hebrew version.

## Colours

The dots in the menu bar pick an accent colour (purple, pink or bright yellow) in both the light and dark themes; each has its own 1IS logo and browser icon.
