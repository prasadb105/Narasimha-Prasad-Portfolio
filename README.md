# Narasimha Prasad Bathini: Portfolio

Static portfolio site (HTML, CSS, vanilla JS). No build step.

## Structure

```
Prasad-Portfolio/
├── index.html
├── robots.txt
├── .nojekyll
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── favicon.svg
    ├── profile.jpg
    └── Narasimha-Prasad-Resume.pdf
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this folder's contents to the root of a public repo.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Site goes live at `https://<username>.github.io/<repo>/`.

## Customize

- Colors and fonts: CSS variables at the top of `css/styles.css`.
- Content: edit the sections in `index.html`.
- Photo: replace `assets/profile.jpg`. Resume: replace `assets/Narasimha-Prasad-Resume.pdf`.
- After deploying, set `og:image` and add a canonical URL in `<head>` using the full site address.
