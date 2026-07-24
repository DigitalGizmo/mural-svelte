<script>
  import { learnmoreSlide, arrowPrev, arrowNext, arrowGrayPrev, arrowGrayNext } from '../../lib/assets.js';

  let { pop } = $props();

  const lm = pop.learnmore;
  const slides = lm.slides;

  let slideIndex = $state(0);

  const current = $derived(slides[slideIndex]);
  const hasPrev = $derived(slideIndex > 0);
  const hasNext = $derived(slideIndex < slides.length - 1);

  const nextSlide = () => { if (hasNext) slideIndex += 1; };
  const prevSlide = () => { if (hasPrev) slideIndex -= 1; };
</script>

<div class="slide-container">
  <div class="pop-img">
    <nav class="slide-nav prev-slide">
      {#if hasPrev}
        <button onclick={prevSlide}>
          <img src={arrowPrev} alt="previous slide" class="slide-arrow" />
        </button>
      {:else}
        <span class="no-more"><img src={arrowGrayPrev} alt="no more slides" class="slide-arrow" /></span>
      {/if}
    </nav>

    <img class="slide-image" alt={lm.title}
      src={learnmoreSlide(pop.panelNum, pop.articleType, lm.learnmoreType, slideIndex + 1)} />

    <nav class="slide-nav next-slide">
      {#if hasNext}
        <button onclick={nextSlide}>
          <img src={arrowNext} alt="next slide" class="slide-arrow" />
        </button>
      {:else}
        <span class="no-more"><img src={arrowGrayNext} alt="no more slides" class="slide-arrow" /></span>
      {/if}
    </nav>

    <div>{@html current.caption}</div>
  </div>

  <div class="slide-caption">
    <h4>{@html current.title}</h4>
    <div>{@html current.narrative}</div>
  </div>
</div>
