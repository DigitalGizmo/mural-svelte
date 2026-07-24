<script>
  import { closePop } from '../../lib/store.svelte.js';
  import Slide from './Slide.svelte';
  import Voice from './Voice.svelte';
  import Video from './Video.svelte';
  import Credits from './Credits.svelte';
  import Hotspot from './Hotspot.svelte';

  let { pop } = $props();

  const isHotspot = $derived(pop.type === 'hotspot');
  const subtitle = $derived(isHotspot ? 'Hotspot' : pop.learnmore.learnmoreType);
  const title = $derived(isHotspot ? pop.hotspot.title : pop.learnmore.title);

  // Close only when the click lands on the backdrop or a close affordance
  // (mirrors the original id-based check), never on inner content.
  function onOverlayClick(e) {
    const id = e.target.id;
    if (id === 'slimpop-overlay' || id === 'close-link' || id === 'pop-close') {
      e.preventDefault();
      closePop();
    }
  }

  // Escape closes the lightbox from anywhere (keyboard users also have the Close link).
  function onWindowKeydown(e) {
    if (e.key === 'Escape') closePop();
  }

  // Enter/Space activates the focused backdrop (close), matching role="button".
  // Guard on currentTarget so key presses on inner controls don't bubble up and close.
  function onOverlayKeydown(e) {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      closePop();
    }
  }
</script>

<svelte:window onkeydown={onWindowKeydown} />

<div
  id="slimpop-overlay"
  role="button"
  tabindex="-1"
  aria-label="Close"
  onclick={onOverlayClick}
  onkeydown={onOverlayKeydown}
>
  <div id="slimpop-container">
    <div class="slimpop-wrapper">
      <p class="pop-close">
        <a id="close-link" href="/" onclick={onOverlayClick}>Close</a>
      </p>

      <h4 class="subhead">{subtitle}</h4>
      <h1>{title}</h1>

      {#if pop.type === 'images' || pop.type === 'objects'}
        <Slide {pop} />
      {:else if pop.type === 'voices'}
        <Voice {pop} />
      {:else if pop.type === 'video'}
        <Video {pop} />
      {:else if pop.type === 'credits'}
        <Credits {pop} />
      {:else if pop.type === 'hotspot'}
        <Hotspot {pop} />
      {/if}
    </div>
  </div>
</div>
