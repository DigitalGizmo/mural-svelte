<script>
  // One slide's worth of content, received as frozen props so the outgoing slide
  // keeps its own image/caption while sliding out (the parent's live index has
  // already advanced). `getDir` is read live at transition time so the OUT slide
  // exits toward the correct side even when direction just reversed.
  import { slideShow } from '../../lib/transitions.js';
  import { swipe } from '../../lib/swipe.js';
  import { arrowPrev, arrowNext, arrowGrayPrev, arrowGrayNext } from '../../lib/assets.js';

  let { src, alt, title, caption, narrative, hasPrev, hasNext, prevSlide, nextSlide, getDir, sliding } =
    $props();
</script>

<div
  class="slide-container"
  use:swipe={{ onLeft: nextSlide, onRight: prevSlide }}
  in:slideShow|local={{ dir: getDir(), mode: 'in' }}
  out:slideShow|local={{ dir: getDir(), mode: 'out' }}
>
  <div class="pop-img">
    <!-- Arrows hidden during the slide (`sliding`) so the outgoing and incoming
         slides' arrows don't cross into an "X"; they reappear when it settles. -->
    <nav class="slide-nav prev-slide">
      {#if !sliding}
        {#if hasPrev}
          <button onclick={prevSlide}>
            <img src={arrowPrev} alt="previous slide" class="slide-arrow" />
          </button>
        {:else}
          <span class="no-more"><img src={arrowGrayPrev} alt="no more slides" class="slide-arrow" /></span>
        {/if}
      {/if}
    </nav>

    <img class="slide-image" {alt} {src} />

    <nav class="slide-nav next-slide">
      {#if !sliding}
        {#if hasNext}
          <button onclick={nextSlide}>
            <img src={arrowNext} alt="next slide" class="slide-arrow" />
          </button>
        {:else}
          <span class="no-more"><img src={arrowGrayNext} alt="no more slides" class="slide-arrow" /></span>
        {/if}
      {/if}
    </nav>

    <div>{@html caption}</div>
  </div>

  <div class="slide-caption">
    <h4>{@html title}</h4>
    <div>{@html narrative}</div>
  </div>
</div>
