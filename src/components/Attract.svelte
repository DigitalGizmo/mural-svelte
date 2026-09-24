<script>
  // Attract loop — ported from the legacy attract.html + attract.js (GSAP
  // TimelineMax). Same choreography, rebuilt on the Web Animations API so no
  // animation library is needed: each panel photo flies in from off-screen right
  // while fading up and back down, staggered; the title drifts across twice per
  // cycle. Any tap returns home.
  import { panels } from '../lib/data.js';
  import { panelBg } from '../lib/assets.js';
  import { go, homePath } from '../lib/router.svelte.js';
  import { ui } from '../lib/store.svelte.js';

  // Legacy timings: speedFactor 3 → each photo travels for 12s, starting 6s apart;
  // the title crosses in 36s and repeats once, so the whole loop is 72s.
  const SPEED = 3;
  const PHOTO_MS = 4 * SPEED * 1000;
  const STAGGER_MS = 2 * SPEED * 1000;
  const CYCLE_MS = STAGGER_MS * panels.length + PHOTO_MS;
  const TITLE_MS = 12 * SPEED * 1000;

  const begin = () => {
    ui.linkDirection = 2; // no slide on the way out
    go(homePath);
  };

  // `fly` and `drift` are Svelte actions: they start the loop when the node mounts
  // and cancel it when it unmounts.
  function fly(node, i) {
    // The motion occupies PHOTO_MS at the start of a CYCLE_MS-long iteration; the
    // rest of the cycle the photo simply waits, invisible, for its next turn.
    const f = PHOTO_MS / CYCLE_MS;
    const anim = node.animate(
      [
        { transform: 'translateX(calc(100vw + 400px))', opacity: 0, offset: 0 },
        { opacity: 1, offset: f * 0.25 },
        { opacity: 1, offset: f * 0.5 },
        { transform: 'translateX(0)', opacity: 0, offset: f },
        { transform: 'translateX(0)', opacity: 0, offset: 1 },
      ],
      {
        duration: CYCLE_MS,
        delay: i * STAGGER_MS,
        iterations: Infinity,
        easing: 'linear',
        fill: 'both',
      }
    );
    return { destroy: () => anim.cancel() };
  }

  function drift(node) {
    const anim = node.animate(
      [
        { transform: 'translateX(0)', opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { opacity: 1, offset: 0.75 },
        { transform: 'translateX(40vw)', opacity: 0 },
      ],
      { duration: TITLE_MS, iterations: Infinity, easing: 'linear', fill: 'both' }
    );
    return { destroy: () => anim.cancel() };
  }
</script>

<svelte:window onpointerdown={begin} onkeydown={begin} />

<div class="attract">
  <h1 class="attract-title" use:drift>
    <a href={homePath} onclick={(e) => { e.preventDefault(); begin(); }}>
      Touch anywhere to begin
    </a>
  </h1>

  <div class="attract-anim">
    {#each panels as panel, i (panel.slug)}
      <img src={panelBg(panel.slug)} alt="" use:fly={i} />
    {/each}
  </div>
</div>
