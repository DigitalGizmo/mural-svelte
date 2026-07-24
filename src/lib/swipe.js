// Svelte action: detect a horizontal swipe/drag and fire onLeft / onRight.
// Ported from the framer-motion onPanStart gestures (panel nav + slideshow).
// Works with touch AND mouse-drag (so it's testable on a desktop). Pair with
// `touch-action: pan-y` (already set on the relevant elements) so vertical
// scrolling still works while horizontal is ours.
//
// Usage: <div use:swipe={{ onLeft, onRight }}>
const THRESHOLD = 45; // px of horizontal travel to count as a swipe

export function swipe(node, params = {}) {
  let opts = params;
  let startX = 0;
  let startY = 0;
  let tracking = false;

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return; // primary button only
    // Don't hijack taps/clicks that begin on an interactive target (links, buttons,
    // hotspots) — matches the original's tagName/pop_item guard.
    if (e.target.closest('a, button, .pop_item')) return;
    startX = e.clientX;
    startY = e.clientY;
    tracking = true;
  }

  function onPointerUp(e) {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESHOLD) {
      if (dx < 0) opts.onLeft?.();
      else opts.onRight?.();
    }
  }

  function cancel() {
    tracking = false;
  }

  node.addEventListener('pointerdown', onPointerDown);
  // On window so a drag that ends off the element still resolves.
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', cancel);

  return {
    update(p) {
      opts = p;
    },
    destroy() {
      node.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', cancel);
    },
  };
}
