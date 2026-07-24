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

| Command | App base (`VITE_BASE_URL`) | Media source (`VITE_IMAGE_BASE`) | Media copied into `dist/`? | Use |
|---|---|---|---|---|
| `npm run dev` | `/` | local `public/` | (dev server) | Everyday dev; works offline |
| `npm run build` | `/` | local `public/` | yes (bundled) | Self-contained static at a server root (e.g. local nginx) |
| `npm run build:kiosk` | `./` | relative `./` | yes (bundled) | Offline kiosk — runs from `file://` or any subdir, no network |
| `npm run build:review` | `/maine-labor-mural/` | `https://assets.digitalgizmo.com/maine-labor-mural` | copied but unused | Online review on digitalgizmo |
| `npm run build:production` | `/maine-labor-mural/` | `https://assets.digitalgizmo.com/maine-labor-mural` | copied but unused | Production (confirm base path for the final host) |

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
