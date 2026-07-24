<script>
  import { setContent, openPop } from '../lib/store.svelte.js';
  import { panelBg } from '../lib/assets.js';

  let { panel } = $props();

  const intro = $derived(panel.articles[0]);
  const fore = $derived(panel.articles[1]);

  const openHotspot = (hotspot) =>
    openPop({ type: 'hotspot', panelNum: panel.ordinal, hotspot });
</script>

<div class="current-panel">
  <article>
    <h3>About This Panel</h3>
    <div>{@html panel.blurb}</div>
  </article>

  <div class="panel-image">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 1800">
      <image id="document" x="0" y="0" href={panelBg(panel.slug)} width="800" height="1800" />

      {#each panel.hotspots as hotspot (hotspot.slug)}
        <a class="pop_item" href="/" aria-label={hotspot.title}
          onclick={(e) => { e.preventDefault(); openHotspot(hotspot); }}>
          <circle class="hotspot" cx={hotspot.x} cy={hotspot.y} r="72" />
        </a>
      {/each}
    </svg>
  </div>

  <nav class="tabs">
    <h3>Learn More</h3>
    <ul>
      <li>
        <a href="/" onclick={(e) => { e.preventDefault(); setContent(0); }}>{intro.title}</a>
      </li>
      <li>
        <a href="/" onclick={(e) => { e.preventDefault(); setContent(1); }}>{fore.title}</a>
      </li>
    </ul>
  </nav>
</div>
