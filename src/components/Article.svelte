<script>
  import { fade } from 'svelte/transition';
  import { setContent, openPop } from '../lib/store.svelte.js';
  import { articleImg, learnmoreThumb } from '../lib/assets.js';

  let { panel, contentIndex } = $props();

  const panelNum = $derived(panel.ordinal);
  const introTitle = $derived(panel.articles[0].title);
  const foreTitle = $derived(panel.articles[1].title);
  const article = $derived(panel.articles[contentIndex]);

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const openLearnmore = (learnmore) =>
    openPop({ type: learnmore.learnmoreType, panelNum, articleType: article.articleType, learnmore });
</script>

<div class="current-panel-article" transition:fade|local={{ duration: 300 }}>
  <nav class="tabs">
    <ul>
      {#if contentIndex === 0}
        <li class="selected-article"><span>{introTitle}</span></li>
      {:else}
        <li><a href="/intro" onclick={(e) => { e.preventDefault(); setContent(0); }}>{introTitle}</a></li>
      {/if}
      {#if contentIndex === 1}
        <li class="selected-article"><span>{foreTitle}</span></li>
      {:else}
        <li><a href="/foreground" onclick={(e) => { e.preventDefault(); setContent(1); }}>{foreTitle}</a></li>
      {/if}
    </ul>
  </nav>

  <article class="article-body">
    <h2>{article.title}</h2>
    <div>{@html article.narrative}</div>
  </article>

  <div class="panel-image">
    <img alt={`panel: ${article.title} `} src={articleImg(panelNum, article.articleType)} />
    <div class="prompt">{@html article.caption}</div>
  </div>

  <nav class="learn-more">
    {#if article.learnmores.length > 0}
      <h3>Learn More</h3>
    {/if}
    <ul>
      {#each article.learnmores as learnmore (learnmore.title)}
        <li>
          <a class="pop_item" href="/"
            onclick={(e) => { e.preventDefault(); openLearnmore(learnmore); }}>
            <img alt={`learn more: ${learnmore.title} `}
              src={learnmoreThumb(panelNum, article.articleType, learnmore.learnmoreType)} />
            <span>{cap(learnmore.learnmoreType)}: </span>
            {learnmore.title}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>
