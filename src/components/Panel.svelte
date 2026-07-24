<script>
  import PanelChrome from './PanelChrome.svelte';
  import Detail from './Detail.svelte';
  import Article from './Article.svelte';
  import { panels, slugOrder } from '../lib/data.js';
  import { panelPath } from '../lib/router.svelte.js';
  import { ui, setContent } from '../lib/store.svelte.js';
  import { panelPrev, panelNext, arrowPrev, arrowNext } from '../lib/assets.js';

  let { panel } = $props();

  const idx = $derived(slugOrder.indexOf(panel.slug));
  const prevPanel = $derived(idx > 0 ? panels[idx - 1] : null);
  const nextPanel = $derived(idx < panels.length - 1 ? panels[idx + 1] : null);

  // Reset to the panel overview (Detail) whenever we land on a different panel.
  $effect(() => {
    panel.slug; // track slug
    setContent(2);
  });
</script>

<div class="wrapper">
  <PanelChrome {panel} />

  <div class="content-area">
    <div class="prev-panel">
      {#if prevPanel}
        <img src={panelPrev(panel.slug)} alt={`Previous panel is ${prevPanel.slug}`} />
        <a href={panelPath(prevPanel.slug)}>
          <img src={arrowPrev} alt="prev arrow" class="arrow" />
        </a>
      {/if}
    </div>

    {#if ui.contentIndex === 2}
      <Detail {panel} />
    {:else}
      <Article {panel} contentIndex={ui.contentIndex} />
    {/if}

    <div class="next-panel">
      {#if nextPanel}
        <img src={panelNext(panel.slug)} alt={`${nextPanel.slug} next`} />
        <a href={panelPath(nextPanel.slug)}>
          <img src={arrowNext} alt="next arrow" class="arrow" />
        </a>
      {/if}
    </div>
  </div>
</div>
