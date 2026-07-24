<script>
  import { hotspotImg } from '../../lib/assets.js';
  let { pop } = $props();
  const h = $derived(pop.hotspot);
</script>

<div>
  <div class="pop-img">
    <img alt={`learn more: ${h.title} `} src={hotspotImg(pop.panelNum, h.slug)} />
    <div>{@html h.caption}</div>
  </div>

  <h4>{@html h.title}</h4>
  <div>{@html h.narrative}</div>
</div>
