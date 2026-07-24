<script>
  import { voiceAudio } from '../../lib/assets.js';
  let { pop } = $props();
  const lm = $derived(pop.learnmore);
</script>

<div>
  {#each lm.voices as voice (voice.partNum)}
    <div>
      <h3>{voice.title}</h3>
      <audio class="voices" controls
        src={voiceAudio(pop.panelNum, pop.articleType, lm.learnmoreType, voice.partNum)}></audio>
      <blockquote>
        <div>{@html voice.narrative}</div>
      </blockquote>
    </div>
  {/each}
</div>
