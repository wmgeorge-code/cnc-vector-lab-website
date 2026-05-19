# CNC Vector Lab — marketing site

Single-page static site. No build step, no framework, no JS bundle. Drag-and-drop to any static host.

## Structure

```
website/
├── index.html        ← single page, all sections
├── styles.css        ← matches the app's warm-charcoal aesthetic
├── assets/           ← logo + workflow screenshots + Eagle demo art
│   ├── cnc-logo.png
│   ├── Eagle.png
│   └── 01-welcome.png ... 08b-preflight.png
└── README.md         ← this file
```

## Preview locally

```bash
cd website
python3 -m http.server 8080
open http://localhost:8080
```

Or just double-click `index.html` — relative paths work from the filesystem too.

## Before going live — placeholders to fill in

Search-and-replace in `index.html`:

| Placeholder | Replace with |
|---|---|
| `hello@cncvectorlab.com` | Your real contact email |
| `support@cncvectorlab.com` | Your support email |
| `href="#download"` download buttons | Real .dmg / .exe URLs (GitHub Releases, S3, etc.) |
| `href="#buy"` pricing buttons | LemonSqueezy checkout URLs |
| `href="https://github.com/"` | Your real GitHub repo URL |
| `href="#">Privacy` / `Terms` / `EULA` | Real legal pages |
| Form `onsubmit` handler | Formspree / Cloudflare Pages Forms / Basin endpoint |

## Deploy options

### Cloudflare Pages (recommended)
1. Push the `website/` folder to a Git repo
2. Connect to Cloudflare Pages, set the build directory to `website/`, no build command
3. Free tier covers everything you need; custom domain is free
4. Forms: enable Cloudflare Pages Functions or use a Forms endpoint

### GitHub Pages
1. Push the `website/` folder to a `gh-pages` branch (or `/docs` on main)
2. Repo settings → Pages → source = that branch
3. Custom domain via the Pages settings + a CNAME file
4. Forms: needs an external endpoint (Formspree, Basin, etc.)

### Netlify
1. Drag the `website/` folder onto Netlify
2. Done. Forms are built-in (`netlify` attribute on the form).

### S3 + CloudFront
For if you want maximum control. ~$1–2/mo for a low-traffic site.

## LemonSqueezy integration

In the pricing section, replace the `href="#buy"` links with your LS checkout URLs. LS gives you a hosted checkout per product variant.

For the 14-day trial flow:
1. Contact form captures "Trial code request" → forwards to your inbox
2. You issue a trial license via LS dashboard → emails the tester a key
3. Tester pastes key in app Settings → 14 days unlocked

## Image notes

The screenshots in `assets/` are taken from the project's existing workflow doc walkthroughs (`Images/workflow-screenshots/`). All ship as-is from the v0.1 build.

For higher fidelity:
- Re-capture at 2880×1800 (Retina) → the responsive layout will downscale crisply
- Keep the dark theme so the screenshots blend with the site background
- Consider WebP for the static deploy — ~70% smaller, all modern browsers support it

## What's intentionally NOT in this site

- No analytics. Add Plausible or Fathom if you want privacy-friendly tracking — not Google Analytics.
- No live chat widget. Email-only support matches the local-first ethos.
- No newsletter signup. Add ConvertKit or Buttondown later if there's an audience to nurture.
- No "social proof" block (testimonials). Adding fake ones is a tell; real ones come after launch.

## SEO basics included

- Semantic HTML5 sectioning
- Open Graph tags (title, description, image)
- Single H1, proper H2/H3 hierarchy
- `alt` text on every image
- Descriptive `<title>` and `<meta description>`
- Fast: no JS framework, no external fonts, no tracking scripts

Add a `sitemap.xml` and `robots.txt` once the URL is final.
