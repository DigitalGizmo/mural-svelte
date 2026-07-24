<script>
  import { videoSrc, videoPoster } from '../../lib/assets.js';
  let { pop } = $props();
  const lm = $derived(pop.learnmore);
</script>

<div>
  <div id="video-content">
    <!-- svelte-ignore a11y_media_has_caption -->
    <video width="720" height="405" controls
      poster={videoPoster(pop.panelNum, pop.articleType, lm.learnmoreType)}>
      <source src={videoSrc(pop.panelNum, pop.articleType, lm.learnmoreType)} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div>{@html lm.caption}</div>
  </div>

  <div>{@html lm.narrative}</div>
</div>
