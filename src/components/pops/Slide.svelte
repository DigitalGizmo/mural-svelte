<script>
  // Drives the slideshow: holds the current index + direction, and hands a frozen
  // snapshot of each slide to a keyed SlideContainer so slides cross-slide cleanly.
  import { tick } from 'svelte';
  import SlideContainer from './SlideContainer.svelte';
  import { learnmoreSlide } from '../../lib/assets.js';
  import { SLIDE_SHOW_MS } from '../../lib/transitions.js';

  let { pop } = $props();

  const lm = $derived(pop.learnmore);
  const slides = $derived(lm.slides);

  let slideIndex = $state(0);
  let dir = $state(1); // 1 = next, 0 = prev; read live by the slide transition
  let sliding = $state(false); // hides the arrows during a slide so the two slides' arrows don't cross into an "X"

  let slideTimer;
  // Set `sliding` and let the current slide re-render arrow-less (await tick) BEFORE
  // changing the index — otherwise it freezes for the slide-out still showing arrows.
  async function change(nextIndex, direction) {
    sliding = true;
    dir = direction;
    await tick();
    slideIndex = nextIndex;
    clearTimeout(slideTimer);
    slideTimer = setTimeout(() => (sliding = false), SLIDE_SHOW_MS + 50);
  }
  const nextSlide = () => { if (slideIndex < slides.length - 1) change(slideIndex + 1, 1); };
  const prevSlide = () => { if (slideIndex > 0) change(slideIndex - 1, 0); };
</script>

{#key slideIndex}
  <SlideContainer
    src={learnmoreSlide(pop.panelNum, pop.articleType, lm.learnmoreType, slideIndex + 1)}
    alt={lm.title}
    title={slides[slideIndex].title}
    caption={slides[slideIndex].caption}
    narrative={slides[slideIndex].narrative}
    hasPrev={slideIndex > 0}
    hasNext={slideIndex < slides.length - 1}
    {prevSlide}
    {nextSlide}
    {sliding}
    getDir={() => dir}
  />
{/key}
