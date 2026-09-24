<script>
  // "Visit Our Exhibit" pop — kiosk only (the web layout has no visit link).
  // Mirrors the legacy pops/visit_detail.html: image, then narrative.
  import { visitImg } from '../../lib/assets.js';
  let { pop } = $props();
  const visit = $derived(pop.visit);
</script>

<div>
  <div class="pop-img">
    <img alt={visit.title} src={visitImg(pop.panelNum)} />
  </div>

  <div>{@html visit.narrative}</div>
</div>
