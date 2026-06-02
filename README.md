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
| Download buttons | Current URLs point to public release assets in `wmgeorge-code/cnc-vector-lab-downloads`. |
| Buy buttons | Current target is the subscription Worker `GET /checkout` route, which creates a Stripe Checkout Session. |
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

## Stripe Checkout integration

The public Buy buttons point to:

```text
https://cnc-vector-lab-subscriptions.wmgeorge54.workers.dev/checkout
```

That route lives in the subscription Worker and creates a Stripe Checkout Session using the Worker-side `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID`. Do not put Stripe secret keys in the website Worker.

Before going live, confirm:

1. The subscription Worker is deployed with the correct CNCVectorlab Stripe test/live secret.
2. `STRIPE_PRICE_ID` is the current recurring price.
3. `WEBSITE_BASE_URL` is `https://cncvectorlab.com`.
4. The v0.2.0 macOS DMG and Windows installer are uploaded to the public `wmgeorge-code/cnc-vector-lab-downloads` release.

## Installer downloads

Cloudflare Workers static assets are limited to 25 MiB per asset, so the installer binaries cannot be deployed as normal website assets. The website links to public release assets in a downloads-only GitHub repository:

```text
https://github.com/wmgeorge-code/cnc-vector-lab-downloads/releases/download/v0.2.0/CNC-Vector-Lab-0.2.0-mac.dmg
https://github.com/wmgeorge-code/cnc-vector-lab-downloads/releases/download/v0.2.0/CNC-Vector-Lab-0.2.0-Setup.exe
```

Upload/update the files with GitHub CLI:

```bash
gh release upload v0.2.0 /path/to/CNC-Vector-Lab-0.2.0-mac.dmg --repo wmgeorge-code/cnc-vector-lab-downloads --clobber
gh release upload v0.2.0 /path/to/CNC-Vector-Lab-0.2.0-Setup.exe --repo wmgeorge-code/cnc-vector-lab-downloads --clobber
```

For the 14-day trial flow:
1. Contact form captures "Trial code request" → forwards to your inbox
2. You issue a trial license from the Admin Console → emails the tester a key
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
