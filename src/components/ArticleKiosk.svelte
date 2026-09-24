<script>
  // Kiosk article view — the legacy panels/article_detail.html stack:
  // image block / scrolling text / "Visit Our Exhibit" / grey learn-more band.
  // The tabs and the title block are supplied by PanelKiosk.
  import { fade } from 'svelte/transition';
  import { openPop } from '../lib/store.svelte.js';
  import { articleImg, learnmoreThumb } from '../lib/assets.js';

  let { panel, article } = $props();

  const panelNum = $derived(panel.ordinal);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const openLearnmore = (learnmore) =>
    openPop({ type: learnmore.learnmoreType, panelNum, articleType: article.articleType, learnmore });

  const openVisit = (visit) => openPop({ type: 'visit', panelNum, visit });
</script>

<div class="kiosk-article" transition:fade|local={{ duration: 300 }}>
  <div class="image">
    <img alt={article.title} src={articleImg(panelNum, article.articleType)} />
    {#if article.articleType === 'intro'}
      <div class="prompt">{@html article.caption}</div>
    {/if}
  </div>

  <div class="text-scroll">
    {@html article.narrative}
  </div>

  <h3 class="visit-link">
    {#if panel.visits.length > 0}
      Visit Our Exhibit:
      {#each panel.visits as visit (visit.title)}
        <a class="pop_item" href="/"
          onclick={(e) => { e.preventDefault(); openVisit(visit); }}>{visit.title}</a>
      {/each}
    {:else}
      &nbsp;
    {/if}
  </h3>

  <nav class="learn-more">
    {#if article.learnmores.length > 0}
      <h3>Learn More...</h3>
    {/if}
    <ul>
      {#each article.learnmores as learnmore (learnmore.title)}
        <li>
          <a class="pop_item" href="/"
            onclick={(e) => { e.preventDefault(); openLearnmore(learnmore); }}>
            <img alt={`learn more: ${learnmore.title} `}
              src={learnmoreThumb(panelNum, article.articleType, learnmore.learnmoreType)} />
            <span>{cap(learnmore.learnmoreType)}:</span>
            {learnmore.title}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>
