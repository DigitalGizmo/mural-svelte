<script>
  // Drives the slideshow: holds the current index + direction, and hands a frozen
  // snapshot of each slide to a keyed SlideContainer so slides cross-slide cleanly.
  import SlideContainer from './SlideContainer.svelte';
  import { learnmoreSlide } from '../../lib/assets.js';

  let { pop } = $props();

  const lm = $derived(pop.learnmore);
  const slides = $derived(lm.slides);

  let slideIndex = $state(0);
  let dir = $state(1); // 1 = next, 0 = prev; read live by the slide transition

  const nextSlide = () => {
    if (slideIndex < slides.length - 1) { dir = 1; slideIndex += 1; }
  };
  const prevSlide = () => {
    if (slideIndex > 0) { dir = 0; slideIndex -= 1; }
  };
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
    getDir={() => dir}
  />
{/key}
