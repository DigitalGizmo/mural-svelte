// Minimal hash router — works identically on a web server and a file:// kiosk,
// no server rewrite rules needed. Routes:
//   #/                     -> home
//   #/panels/<slug>        -> panel
import { slugOrder } from './data.js';

function parse() {
  const h = location.hash.replace(/^#/, '') || '/';
  const m = h.match(/^\/panels\/(.+)$/);
  if (m) {
    const slug = decodeURIComponent(m[1]);
    if (slugOrder.includes(slug)) return { name: 'panel', slug };
  }
  return { name: 'home', slug: null };
}

// Reactive current route (runes work in .js when consumed from a component).
export const route = $state(parse());

function update() {
  const r = parse();
  route.name = r.name;
  route.slug = r.slug;
}

window.addEventListener('hashchange', update);

export function go(path) {
  location.hash = path;
}

export const panelPath = (slug) => `#/panels/${slug}`;
export const homePath = '#/';
