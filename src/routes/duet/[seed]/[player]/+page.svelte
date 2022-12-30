<script lang="ts">
  import { page } from '$app/stores';
  import DuetGame from './DuetGame.svelte';

  const { seed, player } = $page.params;
</script>

<h1 class="typewriter-title" style="text-align: center">Codenames: Duet</h1>

<DuetGame {seed} {player} />

<br />

<a href="/">Home</a>
