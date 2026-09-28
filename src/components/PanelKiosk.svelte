<script>
  // Kiosk panel shell — ported from the legacy panels/panel_base.html:
  //   row 1: "← HOME" | white title block | 11-block mini-nav
  //   row 2: dimmed prev sliver | white .main | dimmed next sliver
  // The two article pills live here (not in Detail/Article) so they persist across
  // both views, exactly as the legacy nav.tabs did.
  import DetailKiosk from './DetailKiosk.svelte';
  import ArticleKiosk from './ArticleKiosk.svelte';
  import { panels, slugOrder } from '../lib/data.js';
  import { homePath, panelPath, go } from '../lib/router.svelte.js';
  import { ui, setContent, beginPanelNav } from '../lib/store.svelte.js';
  import { panelPrev, panelNext, arrowPrev, arrowNext } from '../lib/assets.js';
  import { panelSlide } from '../lib/transitions.js';
  import { swipe } from '../lib/swipe.js';

  let { panel } = $props();

  // Land on the panel overview whenever we arrive at a different panel. `ci` reads
  // 2 as soon as the slug changes — before the effect runs — so the incoming panel
  // never flashes the previous panel's article on its way in. The outgoing panel is
  // inside the {#key} block, which Svelte freezes for the slide-out, so it keeps
  // showing whatever it was showing.
  // Capturing only the initial slug here is the point — the $effect below keeps it
  // in step from then on — so Svelte's state_referenced_locally warning doesn't apply.
  // svelte-ignore state_referenced_locally
  let shownSlug = $state(panel.slug);
  $effect(() => {
    if (panel.slug !== shownSlug) {
      shownSlug = panel.slug;
      setContent(2);
    }
  });
  const ci = $derived(panel.slug === shownSlug ? ui.contentIndex : 2);

  const idx = $derived(slugOrder.indexOf(panel.slug));
  const prevPanel = $derived(idx > 0 ? panels[idx - 1] : null);
  const nextPanel = $derived(idx < panels.length - 1 ? panels[idx + 1] : null);

  const swipeNext = () => { if (nextPanel) { beginPanelNav(1); go(panelPath(nextPanel.slug)); } };
  const swipePrev = () => { if (prevPanel) { beginPanelNav(0); go(panelPath(prevPanel.slug)); } };

  const article = $derived(ci === 2 ? null : panel.articles[ci]);

  // The blurb's "More..." link is baked into the content HTML as a dead Django URL
  // (/panels/<slug>/intro/). Intercept it and switch views instead of navigating.
  function onBlurbClick(e) {
    const link = e.target.closest('a.more-link');
    if (!link) return;
    e.preventDefault();
    setContent(0);
  }
</script>

<div class="kiosk-wrapper">
  <!-- Everything panel-specific lives in the keyed slider below — including HOME
       and the mini-nav, so the whole screen travels as one unit during a slide
       (the 2019 kiosk slid its entire .wrapper the same way). -->
  <div class="panel-stack">
    {#key panel.slug}
      <div
        class="panel-slider"
        use:swipe={{ onLeft: swipeNext, onRight: swipePrev }}
        in:panelSlide|local={{ dir: ui.linkDirection, mode: 'in' }}
        out:panelSlide|local={{ dir: ui.linkDirection, mode: 'out' }}
      >
        <div class="home-nav">
          <a href={homePath} onclick={() => (ui.linkDirection = 2)}>&larr; Home</a>
        </div>

        <div class="panel-nav">
          {#each panels as p (p.slug)}
            {#if p.ordinal === panel.ordinal}
              <span class="mini-nav selected" aria-current="true"></span>
            {:else}
              <a href={panelPath(p.slug)} aria-label={p.title}
                onclick={() => beginPanelNav(p.ordinal > panel.ordinal ? 1 : 0)}>
                <span class="mini-nav"></span>
              </a>
            {/if}
          {/each}
        </div>

        <div class="panel-title">
          {#if ci === 2}
            <h1>{panel.title}</h1>
            <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
            <div class="blurb" onclick={onBlurbClick}>{@html panel.blurb}</div>
          {:else}
            <h3>{panel.title}</h3>
            <h1>{article.title}</h1>
            <p class="close-link">
              <a href="/" aria-label="Back to panel"
                onclick={(e) => { e.preventDefault(); setContent(2); }}>
                <svg viewBox="0 0 32 32" class="close-x" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2" />
                  <path d="M10 10 L22 22 M22 10 L10 22" stroke="currentColor" stroke-width="2" />
                </svg>
              </a>
            </p>
          {/if}
        </div>

        <div class="prev-panel">
          {#if prevPanel}
            <img src={panelPrev(panel.slug)} alt={`Previous panel is ${prevPanel.slug}`} />
            {#if !ui.navigating}
              <a href={panelPath(prevPanel.slug)} onclick={() => beginPanelNav(0)}>
                <img src={arrowPrev} alt="previous panel" class="arrow" />
              </a>
            {/if}
          {/if}
        </div>

        <div class="main">
          {#if ci === 2}
            <DetailKiosk {panel} />
          {:else}
            {#key ci}
              <ArticleKiosk {panel} {article} />
            {/key}
          {/if}

          <nav class="tabs">
            <ul>
              {#each panel.articles as a, i (a.articleType)}
                {#if i === ci}
                  <li class="selected"><span>{@html a.title}</span></li>
                {:else}
                  <li>
                    <a href="/" onclick={(e) => { e.preventDefault(); setContent(i); }}>
                      {@html a.title}
                    </a>
                  </li>
                {/if}
              {/each}
            </ul>
          </nav>
        </div>

        <div class="next-panel">
          {#if nextPanel}
            <img src={panelNext(panel.slug)} alt={`${nextPanel.slug} next`} />
            {#if !ui.navigating}
              <a href={panelPath(nextPanel.slug)} onclick={() => beginPanelNav(1)}>
                <img src={arrowNext} alt="next panel" class="arrow" />
              </a>
            {/if}
          {/if}
        </div>
      </div>
    {/key}
  </div>
</div>
