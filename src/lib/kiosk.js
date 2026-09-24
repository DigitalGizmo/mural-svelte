// Kiosk mode: the 2019 iPad kiosk design (see msm_mural_project, the Django app
// this is ported from). Turned on by VITE_KIOSK in .env.kiosk / .env.review —
// never by anything in the code, so the web build is unaffected.
import { closePop, setContent, ui } from './store.svelte.js';
import { attractPath, go, route } from './router.svelte.js';

export const KIOSK = import.meta.env.VITE_KIOSK === 'true';

// Seconds of no interaction before the attract loop takes over. Legacy timeout.js
// used 3 minutes. 0 disables it (e.g. if Kiosk Pro handles idle itself).
const IDLE_SECONDS = Number(import.meta.env.VITE_KIOSK_IDLE_SECONDS ?? 180);

// The legacy counted clicks only, so a visitor watching a video untouched would be
// thrown into the attract loop mid-video. Playing media now holds the timer off.
function mediaPlaying() {
  return [...document.querySelectorAll('video, audio')].some((m) => !m.paused && !m.ended);
}

export function startIdleTimer() {
  if (!IDLE_SECONDS) return;

  let handle;

  function fire() {
    if (mediaPlaying() || route.name === 'attract') return start();
    closePop();
    setContent(2);
    ui.linkDirection = 2; // arrive at home/attract without a slide
    go(attractPath);
  }

  function start() {
    clearTimeout(handle);
    handle = setTimeout(fire, IDLE_SECONDS * 1000);
  }

  window.addEventListener('pointerdown', start);
  window.addEventListener('keydown', start);
  start();
}
