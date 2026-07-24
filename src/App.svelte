<script>
  import { route } from './lib/router.svelte.js';
  import { ui } from './lib/store.svelte.js';
  import { bySlug } from './lib/data.js';
  import Home from './components/Home.svelte';
  import Panel from './components/Panel.svelte';
  import Pop from './components/pops/Pop.svelte';
</script>

{#if route.name === 'panel'}
  <Panel panel={bySlug[route.slug]} />
{:else}
  <Home />
{/if}

<!-- Global lightbox — mounted once, shown whenever a pop is open -->
{#if ui.pop}
  <Pop pop={ui.pop} />
{/if}
