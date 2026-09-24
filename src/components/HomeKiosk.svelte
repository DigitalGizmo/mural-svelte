<script>
  // Kiosk home — ported from the legacy templates/index.html: the whole mural as
  // one SVG with an invisible rect over each panel, intro text above, the two
  // video links and Credits below. No MSM logo (it linked off-site).
  import { panels, home } from '../lib/data.js';
  import { panelPath } from '../lib/router.svelte.js';
  import { openPop, ui } from '../lib/store.svelte.js';
  import { muralFull } from '../lib/assets.js';

  const introArticle = home?.articles[0];
  const foreArticle = home?.articles[1];
  const developmentVideo = introArticle?.learnmores.find((l) => l.learnmoreType === 'video');
  const intentionsVideo = foreArticle?.learnmores.find((l) => l.learnmoreType === 'video');
  const credits = introArticle?.learnmores.find((l) => l.learnmoreType === 'credits');

  const pop = (type, articleType, learnmore) =>
    openPop({ type, panelNum: 99, articleType, learnmore });

  // Legacy Panel.main_x (panels/models.py): panel n sits at 3 + (n-1) * 339 in the
  // 3732-wide mural, each rect 333 x 750.
  const mainX = (ordinal) => 3 + (ordinal - 1) * 339;
</script>

<div class="home">
  <h1>Maine Labor Mural</h1>

  <p class="intro">
    The Maine Labor Mural depicts scenes of the state&rsquo;s labor history in an effort
    to honor the men and women who built Maine.
  </p>

  <p>
    Oil on panel; painted by Judy Taylor, Seal Cove, Maine, 2008<br />
    Commissioned by the Maine Department of Labor; transferred to the Maine State Museum in 2019.
  </p>

  <p>Tap a panel to learn more</p>

  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 3732 754" class="mural-full">
    <image x="0" y="0" href={muralFull} width="3732" height="754" />

    {#each panels as panel (panel.slug)}
      <a
        href={panelPath(panel.slug)}
        aria-label={panel.title}
        onclick={() => (ui.linkDirection = 2)}
      >
        <rect class="mural-panel-hotspot" x={mainX(panel.ordinal)} y="2" width="333" height="750" />
      </a>
    {/each}
  </svg>

  <p>
    {#if developmentVideo}
      <a class="pop_item" href="/"
        onclick={(e) => { e.preventDefault(); pop('video', 'intro', developmentVideo); }}>
        Tap here
      </a> to learn more about the development of the Maine Labor Mural.<br />
    {/if}

    {#if intentionsVideo}
      <a class="pop_item" href="/"
        onclick={(e) => { e.preventDefault(); pop('video', 'fore', intentionsVideo); }}>
        Tap here
      </a> to explore the artist&rsquo;s intentions behind the mural.
    {/if}
  </p>

  {#if credits}
    <p class="prompt pop_item">
      <a href="/" onclick={(e) => { e.preventDefault(); pop('credits', 'intro', credits); }}>
        Credits
      </a>
    </p>
  {/if}
</div>
