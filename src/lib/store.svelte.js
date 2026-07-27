// Global UI state (Svelte 5 runes) — replaces the old GlobalContext reducer.
// Import `ui` and mutate its properties; mutations are reactive everywhere.
import { PANEL_SLIDE_MS } from './transitions.js';

export const ui = $state({
  contentIndex: 2, // 2 = Detail (panel overview), 0 = intro Article, 1 = fore Article
  linkDirection: 2, // 0 = prev, 1 = next, 2 = none — drives the panel slide direction (set by nav triggers before navigating)
  navigating: false, // true during a panel↔panel slide — hides the nav arrows so the two panels' arrows don't cross into an "X"
  pop: null, // open lightbox: { type, panelNum, articleType?, hotspot?, learnmore? }  — null when closed
});

export function setContent(i) {
  ui.contentIndex = i;
}

// Start a panel-to-panel navigation: set the slide direction and hide the nav
// arrows for the length of the slide. Setting `navigating` while the current panel
// is still live makes it re-render arrow-less BEFORE it freezes for the slide-out,
// so its arrows don't linger and cross the incoming panel's arrows.
let navTimer;
export function beginPanelNav(dir) {
  ui.linkDirection = dir;
  ui.navigating = true;
  clearTimeout(navTimer);
  navTimer = setTimeout(() => (ui.navigating = false), PANEL_SLIDE_MS + 50);
}

export function openPop(p) {
  ui.pop = p;
}

export function closePop() {
  ui.pop = null;
}
