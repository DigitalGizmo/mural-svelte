<script>
  // Kiosk panel overview — the legacy panels/panel_detail.html: just the panel
  // image with its hotspots (the blurb lives in the title block above).
  import { fade } from 'svelte/transition';
  import { openPop } from '../lib/store.svelte.js';
  import { panelBg } from '../lib/assets.js';

  let { panel } = $props();

  const openHotspot = (hotspot) =>
    openPop({ type: 'hotspot', panelNum: panel.ordinal, hotspot });
</script>

<div class="panel-image" transition:fade|local={{ duration: 300 }}>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 1800">
    <image x="0" y="0" href={panelBg(panel.slug)} width="800" height="1800" />

    {#each panel.hotspots as hotspot (hotspot.slug)}
      <a class="pop_item" href="/" aria-label={hotspot.title}
        onclick={(e) => { e.preventDefault(); openHotspot(hotspot); }}>
        <circle class="hotspot" cx={hotspot.x} cy={hotspot.y} r="72" />
      </a>
    {/each}
  </svg>
</div>
