// Global UI state (Svelte 5 runes) — replaces the old GlobalContext reducer.
// Import `ui` and mutate its properties; mutations are reactive everywhere.

export const ui = $state({
  contentIndex: 2, // 2 = Detail (panel overview), 0 = intro Article, 1 = fore Article
  linkDirection: 2, // 0 = prev, 1 = next, 2 = none (drives slide-transition direction; unused until animations land)
  pop: null, // open lightbox: { type, panelNum, articleType?, hotspot?, learnmore? }  — null when closed
});

export function setContent(i) {
  ui.contentIndex = i;
}

export function openPop(p) {
  ui.pop = p;
}

export function closePop() {
  ui.pop = null;
}
