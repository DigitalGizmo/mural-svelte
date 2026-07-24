<script>
  import { panels } from '../lib/data.js';
  import { homePath, panelPath } from '../lib/router.svelte.js';
  import { ui, setContent } from '../lib/store.svelte.js';
  import { logo, miniNav } from '../lib/assets.js';

  let { panel } = $props();
</script>

<div class="msm-link">
  <a href="https://mainestatemuseum.org/exhibit/maine-labor-mural/">
    <img src={logo()} alt="Maine State Museum" class="msm-logo" />
  </a>
</div>

<div class="site-title">
  <a href={homePath}><h3>Maine Labor Mural</h3></a>
</div>

<div class="panel-nav">
  {#each panels as p (p.slug)}
    {#if p.ordinal === panel.ordinal}
      <img src={miniNav(p.ordinal)} alt={`${p.title} selected`} class="panel-nav-selected" />
    {:else}
      <a href={panelPath(p.slug)} onclick={() => (ui.linkDirection = p.ordinal > panel.ordinal ? 1 : 0)}>
        <img src={miniNav(p.ordinal)} alt={p.title} />
      </a>
    {/if}
  {/each}
</div>

<div class="panel-title">
  <h1>
    {#if ui.contentIndex === 2}
      <span>{panel.title}</span>
    {:else}
      <a href="/" onclick={(e) => { e.preventDefault(); setContent(2); }}>{panel.title}</a>
    {/if}
  </h1>
</div>
