<script>
  import { panels, home } from '../lib/data.js';
  import { panelPath } from '../lib/router.svelte.js';
  import { openPop, ui } from '../lib/store.svelte.js';
  import { panelBg, logo } from '../lib/assets.js';

  // Home pops come from the ordinal-99 node (replaces HomePopContent.js):
  //   intro -> [video, credits], fore -> [video]
  const introArticle = home?.articles[0];
  const foreArticle = home?.articles[1];
  const developmentVideo = introArticle?.learnmores.find((l) => l.learnmoreType === 'video');
  const intentionsVideo = foreArticle?.learnmores.find((l) => l.learnmoreType === 'video');
  const credits = introArticle?.learnmores.find((l) => l.learnmoreType === 'credits');

  const pop = (type, articleType, learnmore) =>
    openPop({ type, panelNum: 99, articleType, learnmore });
</script>

<main class="home">
  <header>
    <div class="home-msm-link">
      <a href="https://mainestatemuseum.org/exhibit/maine-labor-mural">
        <img src={logo()} alt="Maine State Museum" class="msm-logo" />
      </a>
    </div>

    <h1>Maine Labor Mural</h1>
    <p>
      The Maine Labor Mural depicts scenes of the state&rsquo;s labor history in an effort
      to honor the men and women who built Maine.
    </p>
    <p class="prompt">Tap/click a panel to learn more</p>
  </header>

  <section class="mural-menu">
    {#each panels as panel (panel.slug)}
      <a href={panelPath(panel.slug)} onclick={() => (ui.linkDirection = 2)}>
        <img alt={panel.slug} src={panelBg(panel.slug)} />
        <h2>{panel.title}</h2>
      </a>
    {/each}
  </section>

  <p>
    The Maine Labor Mural is oil on panel and was painted by Judy Taylor, Seal Cove, Maine, 2008
  </p>

  <div class="home-info">
    <p>Commissioned by the Maine Department of Labor; transferred to the Maine State Museum in 2019.</p>

    <p>
      {#if developmentVideo}
        <a class="pop_item" href="/"
          onclick={(e) => { e.preventDefault(); pop('video', 'intro', developmentVideo); }}>
          Tap here{' '}
        </a> to learn more about the development of the Maine Labor Mural. <br />
      {/if}

      {#if intentionsVideo}
        <a class="pop_item" href="/"
          onclick={(e) => { e.preventDefault(); pop('video', 'fore', intentionsVideo); }}>
          Tap here{' '}
        </a>
        to explore the artist&rsquo;s intentions behind the mural.
      {/if}
    </p>

    {#if credits}
      <p class="prompt pop_item">
        <a class="pop_item" href="/"
          onclick={(e) => { e.preventDefault(); pop('credits', 'intro', credits); }}>
          Credits
        </a>
      </p>
    {/if}
  </div>
</main>
