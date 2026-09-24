<script>
  import { route } from './lib/router.svelte.js';
  import { ui } from './lib/store.svelte.js';
  import { bySlug } from './lib/data.js';
  import { KIOSK } from './lib/kiosk.js';
  import Home from './components/Home.svelte';
  import Panel from './components/Panel.svelte';
  import HomeKiosk from './components/HomeKiosk.svelte';
  import PanelKiosk from './components/PanelKiosk.svelte';
  import Attract from './components/Attract.svelte';
  import Pop from './components/pops/Pop.svelte';
</script>

<!-- Two layouts: the web design and the 2019 kiosk design. VITE_KIOSK picks one
     at build time (see src/lib/kiosk.js); they share the router, state and pops. -->
{#if KIOSK && route.name === 'attract'}
  <Attract />
{:else if route.name === 'panel'}
  {#if KIOSK}
    <PanelKiosk panel={bySlug[route.slug]} />
  {:else}
    <Panel panel={bySlug[route.slug]} />
  {/if}
{:else if KIOSK}
  <HomeKiosk />
{:else}
  <Home />
{/if}

<!-- Global lightbox — mounted once, shown whenever a pop is open -->
{#if ui.pop}
  <Pop pop={ui.pop} />
{/if}
