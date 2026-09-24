# Deploy notes — mural-svelte

A self-contained Svelte 5 + Vite build of the Maine Labor Mural. Content comes
from `src/data/all-panels.json` (bundled). Media (images/audio/video, ~298 MB)
is a **separate payload** kept out of git and, for online deploys, served from a
CDN rather than shipped with the app.

## The two independent knobs

1. **Where the app *looks* for media** — baked in at build time by
   `VITE_IMAGE_BASE` (a URL prefix on every media path; see `src/lib/assets.js`).
2. **Which files you *upload*** — entirely your deploy step; Vite has no say.

They don't have to match your file layout — you just have to point the app
(knob 1) at wherever the media physically lives. A separate knob,
`VITE_BASE_URL`, sets the URL *path the app itself is served from* (Vite `base`);
if that's wrong the app's own JS/CSS 404s and you get a blank page.

Env values live in the committed `.env.*` files (no secrets, just URLs).

## Build matrix

| Command | Layout | App base (`VITE_BASE_URL`) | Media source (`VITE_IMAGE_BASE`) | Media copied into `dist/`? | Use |
|---|---|---|---|---|---|
| `npm run dev` | web | `/` | local `public/` | (dev server) | Everyday dev; works offline |
| `npm run dev:kiosk` | **kiosk** | `./` | relative `./` | (dev server) | Kiosk-layout dev; test at 1024x1366 portrait |
| `npm run dev:review` | **kiosk** | `/maine-labor-mural/` | CDN | (dev server) | Kiosk layout against the live CDN media |
| `npm run build` | web | `/` | local `public/` | yes (bundled) | Self-contained static at a server root (e.g. local nginx) |
| `npm run build:kiosk` | **kiosk** | `./` | relative `./` | yes (bundled) | Offline kiosk — runs from any subdir, no network |
| `npm run build:review` | **kiosk** | `/maine-labor-mural/` | `https://assets.digitalgizmo.com/maine-labor-mural` | copied but unused | Online kiosk review on digitalgizmo |
| `npm run build:production` | web | `/maine-labor-mural/` | `https://assets.digitalgizmo.com/maine-labor-mural` | copied but unused | Production web (confirm base path for the final host) |

## The third knob: which layout

`VITE_KIOSK=true` (set in `.env.kiosk` and `.env.review`) selects the **kiosk layout** —
the museum's 2019 iPad design, ported from `msm_mural_project`. Everything else gets the
web layout. The flag is read once in `src/lib/kiosk.js`; `App.svelte` picks the component
tree and `src/kiosk.css` (loaded only in kiosk builds, scoped to `html.kiosk`) carries the
styling, so the two layouts cannot interfere with each other.

`VITE_KIOSK_IDLE_SECONDS` (default 180) is how long the app waits, with no touches and no
media playing, before handing over to the attract loop at `#/attract`. Set it to `0` to
disable — e.g. if Kiosk Pro is configured to do its own idle reset. Lower it (say 10) when
you want to test the attract loop.

**Review is the kiosk layout.** It is the same build as `build:kiosk` in every respect
except that media comes from the CDN instead of being bundled, so what the museum reviews
online is what runs on the iPad.

## Media as a managed payload

The three media dirs — `public/panels/`, `public/pops/`, `public/images/` — are
gitignored. They are **not** reconstructable from the repo alone; keep the
archive (the original SiteSucker capture) safe. Restore them into `public/`
before any build that needs to bundle media (local / kiosk).

Naming convention (how JSON fields map to files) is encoded in
`src/lib/assets.js` — mirror the same `panels/ pops/ images/` tree wherever you
host the media.

## Online deploy (review / production)

Assets already live at `https://assets.digitalgizmo.com/maine-labor-mural/`
(upload the `panels/ pops/ images/` tree there, preserving structure).

1. `npm run build:review`  (or `build:production`)
2. Upload **`dist/` minus the three media dirs** to the site server:
   - Everything in `dist/` **except** `dist/panels/`, `dist/pops/`, `dist/images/`.
   - Those copies (if present) are never referenced — the app loads media from
     the CDN — so skipping them is safe. Leaving media in `public/` and simply
     not uploading the copies is a perfectly fine workflow; the duplication into
     `dist/` is harmless waste, not a bug.
   - To avoid the wasteful copy entirely, build from a checkout with no media in
     `public/` (a clean gitignored clone has none) — optional.
3. The app loads its own JS/CSS from `/maine-labor-mural/…` and media from the
   CDN. Because it's a **hash router**, no nginx/Apache SPA-rewrite rules are
   needed — every route is `index.html#/…`, plain static serving works.

## Offline kiosk deploy

1. Restore media into `public/`.
2. `npm run build:kiosk` → `dist/` is fully self-contained (relative paths,
   media bundled).
3. Copy the whole `dist/` to the kiosk. Opens from `file://` or any static
   server; needs no network.

## Gotchas (what typically breaks a deploy)

- **Broken images** → `VITE_IMAGE_BASE` for the build mode doesn't match where
  the media actually is. Fix the env / pick the right mode; re-build.
- **Blank page / 404 on app JS** → `VITE_BASE_URL` doesn't match the URL path the
  app is served from. Fix the env for that mode; re-build.
- **Font falls back to sans-serif offline** → futura-pt loads from Typekit
  (`index.html`), which needs network. Self-host the font for a true offline
  kiosk. (Known / pending.)
