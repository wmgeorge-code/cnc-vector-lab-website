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

## Production deployment

The existing Cloudflare Worker `cnc-vector-lab-website` serves `cncvectorlab.com`.
`wrangler.jsonc` defines the static assets, `src/index.js` routes download/contact
requests, and the `EMAIL` binding handles the contact form. Keep its existing
custom domain and binding when deploying. This is a Workers deployment, not Pages.

Use the project's pinned Wrangler and authenticated Cloudflare account. Preview
with `wrangler dev`; inspect `wrangler deploy --dry-run` before deploying with
`wrangler deploy --keep-vars`. The GitHub workflow deploys changes merged to main.
`.assetsignore` excludes source/config, credentials, caches and installer binaries.

## Stripe Checkout integration

The public Buy buttons point to:

```text
https://api.cncvectorlab.com/checkout
```

That route lives in the subscription Worker and creates a Stripe Checkout Session using the Worker-side `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID`. Do not put Stripe secret keys in the website Worker.

Before going live, confirm:

1. The subscription Worker is deployed with the correct CNCVectorlab Stripe test/live secret.
2. `STRIPE_PRICE_ID` is the current recurring price.
3. `WEBSITE_BASE_URL` is `https://cncvectorlab.com`.
4. The subscription Worker selects the intended installer channel and shows private links after verified trial issuance or purchase.

## Installer downloads

Cloudflare Workers static assets are limited to 25 MiB per asset, so the installer binaries cannot be deployed as normal website assets. The website must not link directly to installer assets. Public download buttons route to:

```text
https://api.cncvectorlab.com/trial/request
```

For the 14-day trial flow:
1. User submits the Worker trial request form.
2. The Worker sends an email verification link.
3. After verification, D1 creates or reuses the user and trial license.
4. The confirmation page shows the license key and installer links.
5. User pastes key in app Settings → Account.

Installers already live in private R2 storage and are streamed using expiring,
platform-specific signed links. Active license holders can renew download links at
`https://api.cncvectorlab.com/account`.

### External trial — October 6, 2026

Version **1.1.4** reduces idle preview rendering and repeated selection/assignment
work. New/Open dialogs retain the current workspace, form values and keyboard
focus, and protect pending actions from repeated submissions and stale lists.
Saved-project deletion and vector-edit persistence remain included. The owner authorized unsigned outside trials while
signing credentials are unavailable. Supported downloads are **Apple Silicon Mac
DMG** and **Windows x64 EXE**. The website and download pages explicitly identify
them as unsigned, explain OS approval and preserve normal license activation.
No separate Python/Node installation is needed. Trial updates are manual.

The subscription Worker setting `TRIAL_RELEASE_VERSION=1.1.4` selects the separate
`trials/v1.1.4/` channel; 1.1.3 remains stored for rollback and existing links.
`/trial/release` exposes validated metadata. Signed stable
publishing and automatic update gates remain in place. The app repository's
`docs/external-trial-release.md` retains the exact CI build and installer hashes.

If trial downloads are disabled or superseded, update the version/platform/caveat
copy in `index.html` and coordinate the Worker configuration. Do not put installer
binaries, license keys or account tokens in this website repository.

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
