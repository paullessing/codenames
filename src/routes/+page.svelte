<script lang="ts">
  import { WORDLISTS } from '../wordlists/english';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ol>
  {#each WORDLISTS['English (Duet)'] as word}
    <li>{word}</li>
  {/each}
</ol>
