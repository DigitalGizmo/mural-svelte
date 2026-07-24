import { quadInOut } from 'svelte/easing';

// Panel-to-panel horizontal cross-slide, ported from the original framer-motion
// behavior in mural-gatsby (templates/panel.js): content slides in from the side
// you're heading toward and the old content slides off the opposite side while
// fading toward 0.2 opacity. Duration matched the original 1.4s.
//
// `dir` = ui.linkDirection: 1 = next (→), 0 = prev (←), 2 = none (no slide, e.g.
// arriving from home or on first load). `mode` = 'in' (incoming) | 'out' (leaving).
export const PANEL_SLIDE_MS = 1400; // tune to taste; original was 1.4s

export function panelSlide(node, { dir, mode }) {
  if (dir === 2) return { duration: 0 }; // direct/home entry — appear, don't slide

  const enterFrom = dir === 1 ? 100 : -100; // incoming starts off this side (%)
  const exitTo = dir === 1 ? -100 : 100; // leaving ends off the opposite side (%)

  return {
    duration: PANEL_SLIDE_MS,
    easing: quadInOut,
    // t: 0→1 present-ness (1 = in place); u = 1−t (1 = fully off/away)
    css: (t, u) =>
      mode === 'in'
        ? `transform: translateX(${u * enterFrom}%);`
        : `transform: translateX(${u * exitTo}%); opacity: ${0.2 + t * 0.8};`,
  };
}

// Learn-More slideshow cross-slide, ported from mural-gatsby Slide.js. Same
// horizontal slide as panels but no opacity fade, and the original's 1s duration.
// `dir` 1 = next, 0 = prev. Used with the `|local` modifier so it fires only on
// slide↔slide changes, not when the pop itself opens/closes.
export const SLIDE_SHOW_MS = 1000; // original was 1s

export function slideShow(node, { dir, mode }) {
  if (dir !== 0 && dir !== 1) return { duration: 0 }; // guard: no direction → no slide

  const enterFrom = dir === 1 ? 100 : -100;
  const exitTo = dir === 1 ? -100 : 100;

  return {
    duration: SLIDE_SHOW_MS,
    easing: quadInOut,
    css: (t, u) =>
      mode === 'in'
        ? `transform: translateX(${u * enterFrom}%);`
        : `transform: translateX(${u * exitTo}%);`,
  };
}
