<script>
  // The sliding unit: prev-preview / current panel (Detail or Article) / next-preview.
  // Rendered inside a {#key slug} block in Panel.svelte so each panel is its own
  // instance — which lets us FREEZE the leaving panel's view (see `ci` below) so the
  // global contentIndex reset (→ Detail) only affects the incoming panel, not the one
  // sliding out.
  import Detail from './Detail.svelte';
  import Article from './Article.svelte';
  import { panels, slugOrder } from '../lib/data.js';
  import { panelPath, route, go } from '../lib/router.svelte.js';
  import { ui } from '../lib/store.svelte.js';
  import { panelPrev, panelNext, arrowPrev, arrowNext } from '../lib/assets.js';
  import { panelSlide } from '../lib/transitions.js';
  import { swipe } from '../lib/swipe.js';

  let { panel } = $props();

  const idx = $derived(slugOrder.indexOf(panel.slug));
  const prevPanel = $derived(idx > 0 ? panels[idx - 1] : null);
  const nextPanel = $derived(idx < panels.length - 1 ? panels[idx + 1] : null);

  // Swipe left → next panel, right → prev (mirrors the arrows; sets slide direction).
  const swipeNext = () => {
    if (nextPanel) { ui.linkDirection = 1; go(panelPath(nextPanel.slug)); }
  };
  const swipePrev = () => {
    if (prevPanel) { ui.linkDirection = 0; go(panelPath(prevPanel.slug)); }
  };

  // This instance is "active" only while it's the routed panel. While active, the
  // displayed content index tracks the global (so tab clicks work); once we navigate
  // away it detaches and keeps whatever it was last showing during the slide-out.
  const active = $derived(route.slug === panel.slug);
  let frozen = $state(ui.contentIndex);
  $effect(() => {
    if (active) frozen = ui.contentIndex;
  });
  const ci = $derived(active ? ui.contentIndex : frozen);
</script>

<div
  class="content-area"
  use:swipe={{ onLeft: swipeNext, onRight: swipePrev }}
  in:panelSlide|local={{ dir: ui.linkDirection, mode: 'in' }}
  out:panelSlide|local={{ dir: ui.linkDirection, mode: 'out' }}
>
  <div class="prev-panel">
    {#if prevPanel}
      <img src={panelPrev(panel.slug)} alt={`Previous panel is ${prevPanel.slug}`} />
      <a href={panelPath(prevPanel.slug)} onclick={() => (ui.linkDirection = 0)}>
        <img src={arrowPrev} alt="prev arrow" class="arrow" />
      </a>
    {/if}
  </div>

  {#if ci === 2}
    <Detail {panel} />
  {:else}
    {#key ci}
      <Article {panel} contentIndex={ci} />
    {/key}
  {/if}

  <div class="next-panel">
    {#if nextPanel}
      <img src={panelNext(panel.slug)} alt={`${nextPanel.slug} next`} />
      <a href={panelPath(nextPanel.slug)} onclick={() => (ui.linkDirection = 1)}>
        <img src={arrowNext} alt="next arrow" class="arrow" />
      </a>
    {/if}
  </div>
</div>
