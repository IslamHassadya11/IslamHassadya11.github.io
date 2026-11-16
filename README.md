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
- `wc2026/` is the production build of [WC2026Echo](https://github.com/IslamHassadya11/WC2026Echo) (`npx vite build --base=/wc2026/`).
- `assets/shots/` holds the project screenshots (1200×750 JPEG, plus `-t` thumbnails).
