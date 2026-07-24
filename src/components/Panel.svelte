<script>
  import PanelChrome from './PanelChrome.svelte';
  import PanelContent from './PanelContent.svelte';
  import { setContent } from '../lib/store.svelte.js';

  let { panel } = $props();

  // Reset to the panel overview (Detail) whenever we land on a different panel.
  // Only the incoming PanelContent reflects this — the outgoing one is frozen.
  $effect(() => {
    panel.slug; // track slug
    setContent(2);
  });
</script>

<div class="wrapper">
  <PanelChrome {panel} />

  <!-- content-stack overlaps the outgoing & incoming .content-area in one grid cell
       so they cross-slide; overflow clips the panels moving off-screen. -->
  <div class="content-stack">
    {#key panel.slug}
      <PanelContent {panel} />
    {/key}
  </div>
</div>

<style>
  .content-stack {
    grid-area: content-area;
    display: grid;
    overflow: hidden;
  }
  /* Pin both keyed .content-area instances into the same cell so they overlap
     during the slide (defined in app.css, so reach it with :global). */
  .content-stack :global(.content-area) {
    grid-area: 1 / 1;
  }
</style>
